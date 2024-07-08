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
    await message.answer('Hi! My name is Alfred. To start working press the button "Start the app".',reply_markup=addEmployeeKeyboard())




        