'''
Business: CMS API for managing news, categories, images, and links in admin panel
Args: event - dict with httpMethod, body, queryStringParameters, pathParams
      context - object with request_id, function_name attributes
Returns: HTTP response dict with statusCode, headers, body
'''

import json
import os
from typing import Dict, Any, List, Optional
import psycopg2
from psycopg2.extras import RealDictCursor
import requests
from bs4 import BeautifulSoup
from datetime import datetime

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    params = event.get('queryStringParameters', {}) or {}
    resource = params.get('resource', 'news')
    news_id = params.get('id')
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        if method == 'GET':
            if resource == 'import-news':
                limit = int(params.get('limit', 20))
                result = import_globalmsk_news(limit)
            elif resource == 'news':
                if news_id:
                    result = get_news_detail(cur, news_id)
                else:
                    result = get_news_list(cur, params)
            elif resource == 'categories':
                result = get_categories(cur)
            elif resource == 'stats':
                result = get_stats(cur)
            else:
                result = {'error': 'Unknown resource'}
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            if resource == 'news':
                result = create_news(conn, cur, body_data)
            elif resource == 'category':
                result = create_category(conn, cur, body_data)
            else:
                result = {'error': 'Unknown resource'}
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            if resource == 'news' and news_id:
                result = update_news(conn, cur, news_id, body_data)
            else:
                result = {'error': 'ID required for update'}
        
        elif method == 'DELETE':
            if resource == 'news' and news_id:
                result = delete_news(conn, cur, news_id)
            else:
                result = {'error': 'ID required for delete'}
        
        else:
            result = {'error': 'Method not allowed'}
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(result, ensure_ascii=False, default=str),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}, ensure_ascii=False),
            'isBase64Encoded': False
        }

def get_news_list(cur, params: Dict) -> List[Dict]:
    category = params.get('category')
    status = params.get('status', 'published')
    limit = int(params.get('limit', 50))
    offset = int(params.get('offset', 0))
    
    where_clauses = ["moderation_status = %s"]
    query_params = [status]
    
    if category:
        where_clauses.append("category_code = %s")
        query_params.append(category)
    
    where_sql = " AND ".join(where_clauses)
    
    query = f"""
        SELECT n.*, c.label as category_label
        FROM t_p58513026_news_portal_creation.news n
        LEFT JOIN t_p58513026_news_portal_creation.categories c ON n.category_code = c.code
        WHERE {where_sql}
        ORDER BY n.published_date DESC, n.id DESC
        LIMIT %s OFFSET %s
    """
    query_params.extend([limit, offset])
    
    cur.execute(query, query_params)
    return cur.fetchall()

def get_news_detail(cur, news_id: str) -> Dict:
    cur.execute("""
        SELECT n.*, c.label as category_label
        FROM t_p58513026_news_portal_creation.news n
        LEFT JOIN t_p58513026_news_portal_creation.categories c ON n.category_code = c.code
        WHERE n.id = %s
    """, (news_id,))
    news = cur.fetchone()
    
    if not news:
        return {'error': 'News not found'}
    
    cur.execute("""
        SELECT * FROM t_p58513026_news_portal_creation.news_images
        WHERE news_id = %s ORDER BY position
    """, (news_id,))
    news['images'] = cur.fetchall()
    
    cur.execute("""
        SELECT * FROM t_p58513026_news_portal_creation.news_links
        WHERE news_id = %s ORDER BY position
    """, (news_id,))
    news['links'] = cur.fetchall()
    
    cur.execute("""
        SELECT tag FROM t_p58513026_news_portal_creation.news_tags
        WHERE news_id = %s
    """, (news_id,))
    news['tags'] = [row['tag'] for row in cur.fetchall()]
    
    return news

def get_categories(cur) -> List[Dict]:
    cur.execute("SELECT * FROM t_p58513026_news_portal_creation.categories ORDER BY label")
    return cur.fetchall()

def get_stats(cur) -> Dict:
    cur.execute("SELECT COUNT(*) as total FROM t_p58513026_news_portal_creation.news")
    total = cur.fetchone()['total']
    
    cur.execute("""
        SELECT moderation_status, COUNT(*) as count 
        FROM t_p58513026_news_portal_creation.news 
        GROUP BY moderation_status
    """)
    by_status = cur.fetchall()
    
    return {'total': total, 'by_status': by_status}

def create_news(conn, cur, data: Dict) -> Dict:
    cur.execute("""
        INSERT INTO t_p58513026_news_portal_creation.news 
        (title, category_code, time_label, image_url, description, content, author, 
         source_url, video_url, priority, moderation_status, seo_title, seo_description, seo_keywords)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id
    """, (
        data.get('title', ''),
        data.get('category_code', ''),
        data.get('time_label', ''),
        data.get('image_url', ''),
        data.get('description', ''),
        data.get('content', ''),
        data.get('author', ''),
        data.get('source_url', ''),
        data.get('video_url', ''),
        data.get('priority', 0),
        data.get('moderation_status', 'published'),
        data.get('seo_title', ''),
        data.get('seo_description', ''),
        data.get('seo_keywords', '')
    ))
    news_id = cur.fetchone()['id']
    
    if data.get('images'):
        for idx, img in enumerate(data['images']):
            cur.execute("""
                INSERT INTO t_p58513026_news_portal_creation.news_images 
                (news_id, image_url, caption, position)
                VALUES (%s, %s, %s, %s)
            """, (news_id, img.get('url', ''), img.get('caption', ''), idx))
    
    if data.get('links'):
        for idx, link in enumerate(data['links']):
            cur.execute("""
                INSERT INTO t_p58513026_news_portal_creation.news_links 
                (news_id, title, url, position)
                VALUES (%s, %s, %s, %s)
            """, (news_id, link.get('title', ''), link.get('url', ''), idx))
    
    if data.get('tags'):
        for tag in data['tags']:
            cur.execute("""
                INSERT INTO t_p58513026_news_portal_creation.news_tags (news_id, tag)
                VALUES (%s, %s)
            """, (news_id, tag))
    
    conn.commit()
    return {'id': news_id, 'success': True}

def update_news(conn, cur, news_id: str, data: Dict) -> Dict:
    cur.execute("""
        UPDATE t_p58513026_news_portal_creation.news 
        SET title = %s, category_code = %s, time_label = %s, image_url = %s,
            description = %s, content = %s, author = %s, source_url = %s,
            video_url = %s, priority = %s, moderation_status = %s,
            seo_title = %s, seo_description = %s, seo_keywords = %s,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = %s
    """, (
        data.get('title', ''),
        data.get('category_code', ''),
        data.get('time_label', ''),
        data.get('image_url', ''),
        data.get('description', ''),
        data.get('content', ''),
        data.get('author', ''),
        data.get('source_url', ''),
        data.get('video_url', ''),
        data.get('priority', 0),
        data.get('moderation_status', 'published'),
        data.get('seo_title', ''),
        data.get('seo_description', ''),
        data.get('seo_keywords', ''),
        news_id
    ))
    
    conn.commit()
    return {'id': news_id, 'success': True}

def delete_news(conn, cur, news_id: str) -> Dict:
    cur.execute("UPDATE t_p58513026_news_portal_creation.news SET moderation_status = 'deleted' WHERE id = %s", (news_id,))
    conn.commit()
    return {'success': True}

def create_category(conn, cur, data: Dict) -> Dict:
    cur.execute("""
        INSERT INTO t_p58513026_news_portal_creation.categories (code, label, icon)
        VALUES (%s, %s, %s)
        RETURNING id
    """, (data.get('code', ''), data.get('label', ''), data.get('icon', '')))
    cat_id = cur.fetchone()['id']
    conn.commit()
    return {'id': cat_id, 'success': True}

def import_globalmsk_news(limit: int = 20) -> Dict:
    '''
    Import news from globalmsk.ru portal
    '''
    try:
        url = 'https://www.globalmsk.ru/news'
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        news_list = []
        
        news_items = soup.find_all('div', class_='news-item', limit=limit)
        if not news_items:
            news_items = soup.find_all('article', limit=limit)
        if not news_items:
            news_items = soup.find_all('div', class_='item', limit=limit)
        
        for item in news_items:
            try:
                title_elem = item.find(['h2', 'h3', 'h4', 'a'])
                if not title_elem:
                    continue
                    
                title = title_elem.get_text(strip=True)
                
                link_elem = item.find('a', href=True)
                link = link_elem['href'] if link_elem else ''
                if link and not link.startswith('http'):
                    link = f'https://www.globalmsk.ru{link}'
                
                img_elem = item.find('img')
                image_url = ''
                if img_elem:
                    image_url = img_elem.get('src', '') or img_elem.get('data-src', '')
                    if image_url and not image_url.startswith('http'):
                        image_url = f'https://www.globalmsk.ru{image_url}'
                
                description_elem = item.find(['p', 'div'], class_=['description', 'excerpt', 'summary'])
                description = description_elem.get_text(strip=True) if description_elem else ''
                
                time_elem = item.find(['time', 'span'], class_=['date', 'time', 'published'])
                time_label = time_elem.get_text(strip=True) if time_elem else datetime.now().strftime('%d.%m.%Y %H:%M')
                
                category_elem = item.find(['span', 'a'], class_=['category', 'tag'])
                category = category_elem.get_text(strip=True) if category_elem else 'Новости'
                
                if title:
                    news_list.append({
                        'title': title,
                        'description': description[:500] if description else title[:200],
                        'image_url': image_url,
                        'source_url': link,
                        'time_label': time_label,
                        'category_code': 'imported',
                        'category_label': category,
                        'content': f'<p>{description}</p>' if description else ''
                    })
                    
            except Exception:
                continue
        
        if not news_list:
            fallback_links = soup.find_all('a', href=True, limit=limit)
            for link in fallback_links:
                href = link['href']
                if '/news/' in href and not any(x in href for x in ['#', 'javascript:', 'mailto:']):
                    title = link.get_text(strip=True)
                    if len(title) > 10:
                        full_url = href if href.startswith('http') else f'https://www.globalmsk.ru{href}'
                        news_list.append({
                            'title': title,
                            'description': title[:200],
                            'image_url': '',
                            'source_url': full_url,
                            'time_label': datetime.now().strftime('%d.%m.%Y %H:%M'),
                            'category_code': 'imported',
                            'category_label': 'Новости',
                            'content': f'<p>{title}</p>'
                        })
        
        return {
            'success': True,
            'count': len(news_list[:limit]),
            'news': news_list[:limit]
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e),
            'news': []
        }