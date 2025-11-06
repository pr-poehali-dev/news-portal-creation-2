import json
import os
from typing import Dict, Any
from anthropic import Anthropic
import requests

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Generate content using Claude AI based on user prompt
    Args: event with httpMethod, body containing prompt and contentType
    Returns: HTTP response with generated title, description, content
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    prompt: str = body_data.get('prompt', '')
    content_type: str = body_data.get('contentType', 'news')
    generate_image_only: bool = body_data.get('generateImageOnly', False)
    
    if not prompt:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Prompt is required'}),
            'isBase64Encoded': False
        }
    
    if generate_image_only:
        image_url = f"https://image.pollinations.ai/prompt/{requests.utils.quote(prompt)}?width=1200&height=630&nologo=true"
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'image_url': image_url}, ensure_ascii=False),
            'isBase64Encoded': False
        }
    
    api_key = os.environ.get('ANTHROPIC_API_KEY')
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'API key not configured'}),
            'isBase64Encoded': False
        }
    
    client = Anthropic(api_key=api_key)
    
    content_type_prompts = {
        'news': 'Напиши новость в журналистском стиле. Используй факты и объективный тон.',
        'article': 'Напиши аналитическую статью с экспертным мнением и детальным разбором темы.',
        'biography': 'Напиши биографию личности с хронологией событий и достижениями.',
        'press-release': 'Напиши официальный пресс-релиз в корпоративном стиле.',
        'blog': 'Напиши блог-пост в неформальном стиле с личным мнением.',
        'horoscope': 'Напиши гороскоп с предсказаниями и советами.'
    }
    
    system_prompt = content_type_prompts.get(content_type, content_type_prompts['news'])
    
    user_prompt = f'''{system_prompt}

Тема: {prompt}

Верни результат СТРОГО в формате JSON:
{{
  "title": "Заголовок материала",
  "description": "Краткое описание (2-3 предложения)",
  "content": "<p>Полный HTML текст с тегами p, h2, h3, ul, li, strong, em</p>"
}}

Требования к контенту:
- Заголовок: яркий, цепляющий, до 100 символов
- Описание: информативное, 2-3 предложения
- Контент: структурированный HTML, минимум 3 абзаца
- Используй HTML теги: <h2>, <h3>, <p>, <strong>, <em>, <ul>, <li>
- Пиши на русском языке
- НЕ используй markdown, только HTML
'''
    
    message = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=4000,
        messages=[
            {"role": "user", "content": user_prompt}
        ]
    )
    
    response_text = message.content[0].text
    
    try:
        start_idx = response_text.find('{')
        end_idx = response_text.rfind('}') + 1
        if start_idx != -1 and end_idx > start_idx:
            json_str = response_text[start_idx:end_idx]
            generated_content = json.loads(json_str)
        else:
            generated_content = json.loads(response_text)
    except json.JSONDecodeError:
        generated_content = {
            'title': 'Сгенерированный контент',
            'description': prompt,
            'content': f'<p>{response_text}</p>'
        }
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(generated_content, ensure_ascii=False),
        'isBase64Encoded': False
    }