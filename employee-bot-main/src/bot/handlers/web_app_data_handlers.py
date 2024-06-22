from aiogram import Router, F
import json
from db.db import MongoClient
from os import getenv
from dotenv import load_dotenv
load_dotenv()
web_app_data_router = Router()

@web_app_data_router.message(F.content_type == 'web_app_data')
async def add_employee_handler(web_app_data):
    employee_data_dict = json.loads(web_app_data.web_app_data.data)
    tags = list(map(lambda s: s.lower(), employee_data_dict['tags'].split()))
    tags.sort()
    employee_data_dict['tags'] = tags
    client = MongoClient(getenv('DB_URI'), 'Employee-bot', 'employees')
    await client.add_data(employee_data_dict)
    await web_app_data.answer('Сотрудник успешно добавлен!')
    print(f'Recieved new employee: {employee_data_dict}')
