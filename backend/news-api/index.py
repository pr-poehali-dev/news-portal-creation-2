'''
Business: API for managing news and categories with CRUD operations
Args: event - dict with httpMethod, body, queryStringParameters, pathParams
      context - object with request_id, function_name attributes
Returns: HTTP response with JSON data
'''

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL', '')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    query_params = event.get('queryStringParameters', {}) or {}
    path_params = event.get('pathParams', {}) or {}
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            resource = query_params.get('resource', path_params.get('resource', 'news'))
            
            if resource == 'news':
                cur.execute('''
                    SELECT n.id, n.title, n.category_code as category, 
                           c.label as category_label, n.time_label as time, 
                           n.image_url as image, n.description, n.created_at
                    FROM news n
                    JOIN categories c ON n.category_code = c.code
                    ORDER BY n.created_at DESC
                ''')
                news = cur.fetchall()
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps([dict(row) for row in news], default=str, ensure_ascii=False)
                }
            
            elif resource == 'categories':
                cur.execute('SELECT * FROM categories ORDER BY id')
                categories = cur.fetchall()
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps([dict(row) for row in categories], default=str, ensure_ascii=False)
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            resource = query_params.get('resource', path_params.get('resource', 'news'))
            
            if resource == 'news':
                cur.execute('''
                    INSERT INTO news (title, category_code, time_label, image_url, description)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING id, title, category_code, time_label, image_url, description
                ''', (
                    body_data['title'],
                    body_data['category_code'],
                    body_data['time_label'],
                    body_data['image_url'],
                    body_data.get('description', '')
                ))
                new_news = cur.fetchone()
                conn.commit()
                return {
                    'statusCode': 201,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps(dict(new_news), default=str, ensure_ascii=False)
                }
            
            elif resource == 'categories':
                cur.execute('''
                    INSERT INTO categories (code, label, icon)
                    VALUES (%s, %s, %s)
                    RETURNING *
                ''', (
                    body_data['code'],
                    body_data['label'],
                    body_data['icon']
                ))
                new_category = cur.fetchone()
                conn.commit()
                return {
                    'statusCode': 201,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps(dict(new_category), default=str, ensure_ascii=False)
                }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            resource = query_params.get('resource', path_params.get('resource', 'news'))
            item_id = query_params.get('id', path_params.get('id'))
            
            if resource == 'news' and item_id:
                cur.execute('''
                    UPDATE news 
                    SET title = %s, category_code = %s, time_label = %s, 
                        image_url = %s, description = %s, updated_at = CURRENT_TIMESTAMP
                    WHERE id = %s
                    RETURNING *
                ''', (
                    body_data['title'],
                    body_data['category_code'],
                    body_data['time_label'],
                    body_data['image_url'],
                    body_data.get('description', ''),
                    item_id
                ))
                updated_news = cur.fetchone()
                conn.commit()
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps(dict(updated_news) if updated_news else {}, default=str, ensure_ascii=False)
                }
            
            elif resource == 'categories' and item_id:
                cur.execute('''
                    UPDATE categories 
                    SET label = %s, icon = %s
                    WHERE id = %s
                    RETURNING *
                ''', (
                    body_data['label'],
                    body_data['icon'],
                    item_id
                ))
                updated_category = cur.fetchone()
                conn.commit()
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps(dict(updated_category) if updated_category else {}, default=str, ensure_ascii=False)
                }
        
        elif method == 'DELETE':
            resource = query_params.get('resource', path_params.get('resource', 'news'))
            item_id = query_params.get('id', path_params.get('id'))
            
            if resource == 'news' and item_id:
                cur.execute('DELETE FROM news WHERE id = %s', (item_id,))
                conn.commit()
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'message': 'News deleted successfully'})
                }
            
            elif resource == 'categories' and item_id:
                cur.execute('DELETE FROM categories WHERE id = %s', (item_id,))
                conn.commit()
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'message': 'Category deleted successfully'})
                }
        
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Invalid request'})
        }
    
    finally:
        cur.close()
        conn.close()