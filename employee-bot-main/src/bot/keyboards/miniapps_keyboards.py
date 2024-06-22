from aiogram import types
from os import getenv
from dotenv import load_dotenv

load_dotenv()
def addEmployeeKeyboard():
    my_web_app = types.web_app_info.WebAppInfo(url=getenv("APP_URL"))
    kb = [[types.KeyboardButton(text='Добавить сотрудника', web_app=my_web_app)]]
    keyboard = types.ReplyKeyboardMarkup(row_width=1, keyboard=kb, resize_keyboard=True)
    return keyboard

