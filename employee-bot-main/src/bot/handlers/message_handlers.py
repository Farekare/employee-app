from aiogram import Router, F
from aiogram.filters import CommandStart, Command
from aiogram.types import Message
from aiogram import types
from keyboards.miniapps_keyboards import addEmployeeKeyboard
from db.db import MongoClient
from os import getenv
from dotenv import load_dotenv
import csv
import io
load_dotenv()
# message router used with main dispatcher
message_router = Router()

# /start command handler in private messages
@message_router.message(F.chat.type == 'private', CommandStart())
async def command_start_handler(message: Message):
    await message.answer('Hi! My name is Alfred. To start working press the button "Start the app".',reply_markup=addEmployeeKeyboard())


# /csv command handler
@message_router.message(Command('csv'))
async def csv_export_handler(message: Message):
    await message.answer('Contacts list in csv format:')
    client = MongoClient(getenv('DB_URI'),'telegram_bot', 'users')
    data = await client.get_data()

    fields = ['name', 'email', 'region', 'tags', 'notes']

    csv_buffer = io.StringIO()
    writer = csv.DictWriter(csv_buffer, fieldnames=fields)
    writer.writeheader()
    for row in data:
        row['tags'] = ', '.join(row['tags'])
        writer.writerow(row)

    csv_string = csv_buffer.getvalue().encode()
    csv_buffer.close()
    input_file = types.BufferedInputFile(csv_string,'contacts.csv')
    await message.answer_document(input_file)
    