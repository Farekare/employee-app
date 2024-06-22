from aiogram import Router, F
from aiogram.filters import CommandStart, Command
from aiogram.types import Message
from keyboards.miniapps_keyboards import addEmployeeKeyboard
from db.db import MongoClient
from os import getenv
from dotenv import load_dotenv
load_dotenv()
# message router used with main dispatcher
message_router = Router()

# /start command handler in private messages
@message_router.message(F.chat.type == 'private', CommandStart())
async def command_start_handler(message: Message):
    await message.answer('Приветствую! Я бот для взаимодействия с базой сотрудников\n. Чтобы добавить сотрудника, нажмите на кнопку "Добавить сотрудника" на клавиатуре внизу.',reply_markup=addEmployeeKeyboard())


# /search command handler
@message_router.message(Command('search'))
async def command_seach_handler(message: Message, command=Command('search')):
     # if there is no tags
    if command.args is None:
        await message.answer('Команда должна иметь вид /search "тег1" ... "тегN"')
    else:
        tags = list(map(lambda s: s.lower(), command.args.split()))
        tags.sort()
        client = MongoClient(getenv('DB_URI'), 'Employee-bot', 'employees')
        result = await client.get_data(tags)
        print(result)
        