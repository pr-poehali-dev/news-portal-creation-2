'''
Business: CMS API for managing news, categories, images, and links in admin panel
Args: event - dict with httpMethod, body, queryStringParameters, pathParams
      context - object with request_id, function_name attributes
Returns: HTTP response dict with statusCode, headers, body
'''

import json
import os
from typing import Dict, Any, List
import psycopg2
from psycopg2.extras import RealDictCursor
import requests
from bs4 import BeautifulSoup
from datetime import datetime
import xml.etree.ElementTree as ET

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def sql_escape(value: Any) -> str:
    if value is None:
        return 'NULL'
    if isinstance(value, (int, float)):
        return str(value)
    if isinstance(value, bool):
        return 'true' if value else 'false'
    return "'" + str(value).replace("'", "''") + "'"

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
                result = import_globalmsk_news(conn, cur, limit)
            elif resource == 'import-rss':
                limit = int(params.get('limit', 20))
                result = import_rss_feed(conn, cur, limit)
            elif resource == 'news':
                if news_id:
                    result = get_news_detail(cur, news_id)
                else:
                    result = get_news_list(cur, params)
            elif resource == 'categories':
                result = get_categories(cur)
            elif resource == 'stats':
                result = get_stats(cur)
            elif resource == 'banners':
                placement = params.get('placement')
                banner_id = params.get('id')
                if banner_id:
                    result = get_banner_detail(cur, banner_id)
                else:
                    result = get_banners_list(cur, placement)
            else:
                result = {'error': 'Unknown resource'}
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            if resource == 'news':
                result = create_news(conn, cur, body_data)
            elif resource == 'category':
                result = create_category(conn, cur, body_data)
            elif resource == 'banner':
                result = create_banner(conn, cur, body_data)
            else:
                result = {'error': 'Unknown resource'}
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            banner_id = params.get('id')
            if resource == 'news' and news_id:
                result = update_news(conn, cur, news_id, body_data)
            elif resource == 'banner' and banner_id:
                result = update_banner(conn, cur, banner_id, body_data)
            else:
                result = {'error': 'ID required for update'}
        
        elif method == 'DELETE':
            banner_id = params.get('id')
            if resource == 'news' and news_id:
                result = delete_news(conn, cur, news_id)
            elif resource == 'banner' and banner_id:
                result = delete_banner(conn, cur, banner_id)
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
    
    where_clauses = [f"moderation_status = {sql_escape(status)}"]
    
    if category:
        where_clauses.append(f"category_code = {sql_escape(category)}")
    
    where_sql = " AND ".join(where_clauses)
    
    query = f"""
        SELECT n.*, c.label as category_label
        FROM t_p58513026_news_portal_creation.news n
        LEFT JOIN t_p58513026_news_portal_creation.categories c ON n.category_code = c.code
        WHERE {where_sql}
        ORDER BY n.published_date DESC, n.id DESC
        LIMIT {limit} OFFSET {offset}
    """
    
    cur.execute(query)
    return cur.fetchall()

def get_news_detail(cur, news_id: str) -> Dict:
    query = f"""
        SELECT n.*, c.label as category_label
        FROM t_p58513026_news_portal_creation.news n
        LEFT JOIN t_p58513026_news_portal_creation.categories c ON n.category_code = c.code
        WHERE n.id = {sql_escape(news_id)}
    """
    cur.execute(query)
    news = cur.fetchone()
    
    if not news:
        return {'error': 'News not found'}
    
    cur.execute(f"""
        SELECT * FROM t_p58513026_news_portal_creation.news_images
        WHERE news_id = {sql_escape(news_id)} ORDER BY position
    """)
    news['images'] = cur.fetchall()
    
    cur.execute(f"""
        SELECT * FROM t_p58513026_news_portal_creation.news_links
        WHERE news_id = {sql_escape(news_id)} ORDER BY position
    """)
    news['links'] = cur.fetchall()
    
    cur.execute(f"""
        SELECT tag FROM t_p58513026_news_portal_creation.news_tags
        WHERE news_id = {sql_escape(news_id)}
    """)
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
    query = f"""
        INSERT INTO t_p58513026_news_portal_creation.news 
        (title, category_code, time_label, image_url, description, content, author, 
         source_url, video_url, priority, moderation_status, seo_title, seo_description, seo_keywords)
        VALUES (
            {sql_escape(data.get('title', ''))},
            {sql_escape(data.get('category_code', ''))},
            {sql_escape(data.get('time_label', ''))},
            {sql_escape(data.get('image_url', ''))},
            {sql_escape(data.get('description', ''))},
            {sql_escape(data.get('content', ''))},
            {sql_escape(data.get('author', ''))},
            {sql_escape(data.get('source_url', ''))},
            {sql_escape(data.get('video_url', ''))},
            {data.get('priority', 0)},
            {sql_escape(data.get('moderation_status', 'published'))},
            {sql_escape(data.get('seo_title', ''))},
            {sql_escape(data.get('seo_description', ''))},
            {sql_escape(data.get('seo_keywords', ''))}
        )
        RETURNING id
    """
    cur.execute(query)
    news_id = cur.fetchone()['id']
    
    if data.get('images'):
        for idx, img in enumerate(data['images']):
            cur.execute(f"""
                INSERT INTO t_p58513026_news_portal_creation.news_images 
                (news_id, image_url, caption, position)
                VALUES ({news_id}, {sql_escape(img.get('url', ''))}, {sql_escape(img.get('caption', ''))}, {idx})
            """)
    
    if data.get('links'):
        for idx, link in enumerate(data['links']):
            cur.execute(f"""
                INSERT INTO t_p58513026_news_portal_creation.news_links 
                (news_id, title, url, position)
                VALUES ({news_id}, {sql_escape(link.get('title', ''))}, {sql_escape(link.get('url', ''))}, {idx})
            """)
    
    if data.get('tags'):
        for tag in data['tags']:
            cur.execute(f"""
                INSERT INTO t_p58513026_news_portal_creation.news_tags (news_id, tag)
                VALUES ({news_id}, {sql_escape(tag)})
            """)
    
    conn.commit()
    return {'id': news_id, 'success': True}

def update_news(conn, cur, news_id: str, data: Dict) -> Dict:
    fields = []
    if 'title' in data:
        fields.append(f"title = {sql_escape(data['title'])}")
    if 'category_code' in data:
        fields.append(f"category_code = {sql_escape(data['category_code'])}")
    if 'time_label' in data:
        fields.append(f"time_label = {sql_escape(data['time_label'])}")
    if 'image_url' in data:
        fields.append(f"image_url = {sql_escape(data['image_url'])}")
    if 'description' in data:
        fields.append(f"description = {sql_escape(data['description'])}")
    if 'content' in data:
        fields.append(f"content = {sql_escape(data['content'])}")
    if 'author' in data:
        fields.append(f"author = {sql_escape(data['author'])}")
    if 'source_url' in data:
        fields.append(f"source_url = {sql_escape(data['source_url'])}")
    if 'video_url' in data:
        fields.append(f"video_url = {sql_escape(data['video_url'])}")
    if 'priority' in data:
        fields.append(f"priority = {data['priority']}")
    if 'moderation_status' in data:
        fields.append(f"moderation_status = {sql_escape(data['moderation_status'])}")
    if 'seo_title' in data:
        fields.append(f"seo_title = {sql_escape(data['seo_title'])}")
    if 'seo_description' in data:
        fields.append(f"seo_description = {sql_escape(data['seo_description'])}")
    if 'seo_keywords' in data:
        fields.append(f"seo_keywords = {sql_escape(data['seo_keywords'])}")
    
    fields.append("updated_at = NOW()")
    
    if not fields:
        return {'error': 'No fields to update'}
    
    query = f"""
        UPDATE t_p58513026_news_portal_creation.news 
        SET {', '.join(fields)}
        WHERE id = {sql_escape(news_id)}
    """
    cur.execute(query)
    conn.commit()
    
    return {'success': True}

def delete_news(conn, cur, news_id: str) -> Dict:
    cur.execute(f"DELETE FROM t_p58513026_news_portal_creation.news_tags WHERE news_id = {sql_escape(news_id)}")
    cur.execute(f"DELETE FROM t_p58513026_news_portal_creation.news_links WHERE news_id = {sql_escape(news_id)}")
    cur.execute(f"DELETE FROM t_p58513026_news_portal_creation.news_images WHERE news_id = {sql_escape(news_id)}")
    cur.execute(f"DELETE FROM t_p58513026_news_portal_creation.news WHERE id = {sql_escape(news_id)}")
    conn.commit()
    
    return {'success': True}

def create_category(conn, cur, data: Dict) -> Dict:
    query = f"""
        INSERT INTO t_p58513026_news_portal_creation.categories (code, label, color)
        VALUES ({sql_escape(data.get('code', ''))}, {sql_escape(data.get('label', ''))}, {sql_escape(data.get('color', '#000000'))})
        RETURNING code
    """
    cur.execute(query)
    code = cur.fetchone()['code']
    conn.commit()
    
    return {'code': code, 'success': True}

def import_globalmsk_news(conn, cur, limit: int = 20) -> List[Dict]:
    url = "https://www.globalmsk.ru/"
    response = requests.get(url, timeout=10)
    response.encoding = 'utf-8'
    soup = BeautifulSoup(response.text, 'html.parser')
    
    imported_news = []
    news_items = soup.find_all('a', class_='news_roll_item', limit=limit)
    
    for item in news_items:
        try:
            source_url = 'https://www.globalmsk.ru' + item.get('href', '')
            title_elem = item.find('div', class_='nr_title')
            title = title_elem.text.strip() if title_elem else ''
            
            if not title:
                continue
            
            query = f"SELECT COUNT(*) as count FROM t_p58513026_news_portal_creation.news WHERE source_url = {sql_escape(source_url)}"
            cur.execute(query)
            if cur.fetchone()['count'] > 0:
                continue
            
            img_elem = item.find('img')
            image_url = 'https://www.globalmsk.ru' + img_elem.get('src', '') if img_elem else ''
            
            time_elem = item.find('div', class_='nr_info_block_time')
            time_label = time_elem.text.strip() if time_elem else 'Только что'
            
            cat_elem = item.find('a', class_='nr_info_block_rub')
            category_code = cat_elem.get('href', '').split('/')[-1] if cat_elem else 'news'
            
            query = f"""
                INSERT INTO t_p58513026_news_portal_creation.news 
                (title, category_code, time_label, image_url, source_url, author, moderation_status)
                VALUES (
                    {sql_escape(title)},
                    {sql_escape(category_code)},
                    {sql_escape(time_label)},
                    {sql_escape(image_url)},
                    {sql_escape(source_url)},
                    'GlobalMsk.ru',
                    'draft'
                )
                RETURNING id, title, category_code, time_label, image_url
            """
            cur.execute(query)
            result = cur.fetchone()
            imported_news.append(dict(result))
        
        except Exception as e:
            print(f"Error importing news: {e}")
            continue
    
    conn.commit()
    return imported_news

def import_rss_feed(conn, cur, limit: int = 20) -> List[Dict]:
    rss_url = "https://globalmsk.ru/dzen.php"
    response = requests.get(rss_url, timeout=10)
    response.encoding = 'utf-8'
    
    try:
        root = ET.fromstring(response.content)
    except:
        root = ET.fromstring(response.text.encode('utf-8'))
    
    imported_news = []
    items = root.findall('.//item')[:limit]
    
    for item in items:
        try:
            title = item.find('title').text if item.find('title') is not None else ''
            source_url = item.find('link').text if item.find('link') is not None else ''
            description = item.find('description').text if item.find('description') is not None else ''
            pub_date = item.find('pubDate').text if item.find('pubDate') is not None else ''
            
            media_ns = '{http://search.yahoo.com/mrss/}'
            media_content = item.find(f'{media_ns}content')
            image_url = ''
            if media_content is not None:
                image_url = media_content.get('url', '')
            
            if not image_url:
                enclosure = item.find('enclosure')
                if enclosure is not None and enclosure.get('type', '').startswith('image'):
                    image_url = enclosure.get('url', '')
            
            author_elem = item.find('author')
            author = author_elem.text if author_elem is not None else 'GlobalMsk.ru'
            
            if not title or not source_url:
                continue
            
            query = f"SELECT COUNT(*) as count FROM t_p58513026_news_portal_creation.news WHERE source_url = {sql_escape(source_url)}"
            cur.execute(query)
            if cur.fetchone()['count'] > 0:
                continue
            
            query = f"""
                INSERT INTO t_p58513026_news_portal_creation.news 
                (title, description, image_url, source_url, author, time_label, category_code, moderation_status)
                VALUES (
                    {sql_escape(title)},
                    {sql_escape(description)},
                    {sql_escape(image_url)},
                    {sql_escape(source_url)},
                    {sql_escape(author)},
                    'Только что',
                    'news',
                    'draft'
                )
                RETURNING id, title, description, image_url, source_url
            """
            cur.execute(query)
            result = cur.fetchone()
            imported_news.append(dict(result))
        
        except Exception as e:
            print(f"Error importing RSS item: {e}")
            continue
    
    conn.commit()
    return imported_news

def get_banners_list(cur, placement: str = None) -> List[Dict]:
    where_clause = f"WHERE placement = {sql_escape(placement)}" if placement else ""
    query = f"""
        SELECT * FROM t_p58513026_news_portal_creation.banners
        {where_clause}
        ORDER BY priority DESC, id DESC
    """
    cur.execute(query)
    return cur.fetchall()

def get_banner_detail(cur, banner_id: str) -> Dict:
    query = f"SELECT * FROM t_p58513026_news_portal_creation.banners WHERE id = {sql_escape(banner_id)}"
    cur.execute(query)
    banner = cur.fetchone()
    return banner if banner else {'error': 'Banner not found'}

def create_banner(conn, cur, data: Dict) -> Dict:
    query = f"""
        INSERT INTO t_p58513026_news_portal_creation.banners 
        (placement, title, media_type, media_url, link_url, rsy_code, is_active, priority)
        VALUES (
            {sql_escape(data.get('placement', ''))},
            {sql_escape(data.get('title', ''))},
            {sql_escape(data.get('media_type', 'image'))},
            {sql_escape(data.get('media_url', ''))},
            {sql_escape(data.get('link_url', ''))},
            {sql_escape(data.get('rsy_code', ''))},
            {data.get('is_active', True)},
            {data.get('priority', 0)}
        )
        RETURNING id
    """
    cur.execute(query)
    banner_id = cur.fetchone()['id']
    conn.commit()
    return {'id': banner_id, 'success': True}

def update_banner(conn, cur, banner_id: str, data: Dict) -> Dict:
    fields = []
    if 'placement' in data:
        fields.append(f"placement = {sql_escape(data['placement'])}")
    if 'title' in data:
        fields.append(f"title = {sql_escape(data['title'])}")
    if 'media_type' in data:
        fields.append(f"media_type = {sql_escape(data['media_type'])}")
    if 'media_url' in data:
        fields.append(f"media_url = {sql_escape(data['media_url'])}")
    if 'link_url' in data:
        fields.append(f"link_url = {sql_escape(data['link_url'])}")
    if 'rsy_code' in data:
        fields.append(f"rsy_code = {sql_escape(data['rsy_code'])}")
    if 'is_active' in data:
        fields.append(f"is_active = {data['is_active']}")
    if 'priority' in data:
        fields.append(f"priority = {data['priority']}")
    
    fields.append("updated_at = NOW()")
    
    if not fields:
        return {'error': 'No fields to update'}
    
    query = f"""
        UPDATE t_p58513026_news_portal_creation.banners 
        SET {', '.join(fields)}
        WHERE id = {sql_escape(banner_id)}
    """
    cur.execute(query)
    conn.commit()
    return {'success': True}

def delete_banner(conn, cur, banner_id: str) -> Dict:
    query = f"DELETE FROM t_p58513026_news_portal_creation.banners WHERE id = {sql_escape(banner_id)}"
    cur.execute(query)
    conn.commit()
    return {'success': True}