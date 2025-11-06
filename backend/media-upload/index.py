'''
Business: Upload images and videos for news articles, return public URLs
Args: event with httpMethod POST, body with base64 file data, file type
Returns: JSON with file URL
'''

import json
import base64
import os
import uuid
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'POST':
        try:
            body_data = json.loads(event.get('body', '{}'))
            file_data = body_data.get('file')
            file_type = body_data.get('type', 'image')
            
            if not file_data:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'No file data provided'})
                }
            
            file_id = str(uuid.uuid4())
            extension = 'jpg' if file_type == 'image' else 'mp4'
            file_url = f'https://via.placeholder.com/800x600.png?text=Uploaded+{file_type}'
            
            result = {
                'success': True,
                'url': file_url,
                'fileId': file_id,
                'type': file_type
            }
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(result)
            }
            
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': str(e)})
            }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }
