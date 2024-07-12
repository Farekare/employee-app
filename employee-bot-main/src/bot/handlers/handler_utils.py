from db.db import MongoClient
from os import getenv
from dotenv import load_dotenv
import csv
import io
load_dotenv()

async def get_contacts():
    client = MongoClient(getenv('DB_URI'),'telegram_bot', 'users')
    data = await client.get_data()
    return data

def make_csv_buffer(data):
    fields = ['name', 'email', 'region', 'tags', 'notes']
    csv_buffer = io.StringIO()
    writer = csv.DictWriter(csv_buffer, fieldnames=fields)
    writer.writeheader()
    for row in data:
        row['tags'] = ', '.join(row['tags'])
        writer.writerow(row)
    return csv_buffer

async def make_csv_string():
    data = await get_contacts()
    csv_buffer = make_csv_buffer(data)
    csv_string = csv_buffer.getvalue().encode()
    csv_buffer.close()
    return csv_string
