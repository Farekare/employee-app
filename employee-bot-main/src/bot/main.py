import asyncio
import logging
import sys
from os import getenv
from aiogram import Bot, Dispatcher
from aiogram.enums import ParseMode
from dotenv import load_dotenv
from handlers.message_handlers import message_router

load_dotenv()

# main dispatcher
dp = Dispatcher()

dp.include_router(message_router)
TOKEN = getenv('BOT_TOKEN')

async def main():
    bot = Bot(token=TOKEN, parse_mode=ParseMode.HTML)
    await dp.start_polling(bot)


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    asyncio.run(main())