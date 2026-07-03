import json
import os
import base64
import uuid
import psycopg2
import boto3


def handler(event: dict, context) -> dict:
    '''Управление объявлениями: получение списка и создание нового объявления с загрузкой фото в S3.
    GET — список всех объявлений. POST — создать новое объявление (name, price, category, description, location, condition, image_base64).
    '''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': '',
        }

    dsn = os.environ['DATABASE_URL']
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    table = f'"{schema}".listings'
    conn = psycopg2.connect(dsn)
    conn.autocommit = True
    cur = conn.cursor()

    if method == 'GET':
        cur.execute(
            f"SELECT id, name, price, category, image, description, location, "
            f"condition, seller, in_stock, views, created_at FROM {table} ORDER BY created_at DESC"
        )
        rows = cur.fetchall()
        listings = []
        for r in rows:
            listings.append({
                'id': r[0],
                'name': r[1],
                'price': float(r[2]),
                'category': r[3],
                'image': r[4],
                'description': r[5],
                'location': r[6],
                'condition': r[7],
                'seller': r[8],
                'inStock': r[9],
                'views': r[10],
                'date': r[11].strftime('%d.%m.%Y'),
            })
        cur.close()
        conn.close()
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
            'body': json.dumps({'listings': listings}, ensure_ascii=False),
        }

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        name = body.get('name', '').strip()
        price = body.get('price')
        category = body.get('category', '').strip()
        description = body.get('description', '').strip()
        location = body.get('location', '').strip()
        condition = body.get('condition', 'Новое')
        seller = body.get('seller', 'Пользователь')
        image_base64 = body.get('image_base64')

        if not name or price is None or not category or not description or not location:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Заполните все обязательные поля'}, ensure_ascii=False),
            }

        image_url = ''
        if image_base64:
            s3 = boto3.client(
                's3',
                endpoint_url='https://bucket.poehali.dev',
                aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
                aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
            )
            if ',' in image_base64:
                header, image_base64 = image_base64.split(',', 1)
            image_data = base64.b64decode(image_base64)
            key = f"listings/{uuid.uuid4()}.jpg"
            s3.put_object(Bucket='files', Key=key, Body=image_data, ContentType='image/jpeg')
            image_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"

        cur.execute(
            f"INSERT INTO {table} (name, price, category, image, description, location, condition, seller) "
            f"VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id, created_at",
            (name, price, category, image_url, description, location, condition, seller),
        )
        new_id, created_at = cur.fetchone()
        cur.close()
        conn.close()

        return {
            'statusCode': 201,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
            'body': json.dumps({
                'id': new_id,
                'name': name,
                'price': float(price),
                'category': category,
                'image': image_url,
                'description': description,
                'location': location,
                'condition': condition,
                'seller': seller,
                'inStock': True,
                'views': 0,
                'date': created_at.strftime('%d.%m.%Y'),
            }, ensure_ascii=False),
        }

    cur.close()
    conn.close()
    return {
        'statusCode': 405,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Метод не поддерживается'}, ensure_ascii=False),
    }