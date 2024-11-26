from aiogram import Router, F
from aiogram.filters import CommandStart, Command
from aiogram.types import Message, ReplyKeyboardRemove
from aiogram import types
from keyboards.miniapps_keyboards import addEmployeeKeyboard
from os import getenv
from dotenv import load_dotenv
from .handler_utils import make_csv_string
from .fsm import FSM
from aiogram.fsm.context import FSMContext

load_dotenv()
# message router used with main dispatcher
message_router = Router()



# /start command handler in private messages
@message_router.message(F.chat.type == 'private', CommandStart())
async def command_start_handler(message: Message, state:FSMContext):
    await state.set_state(FSM.password)
    await message.answer('Hi! My name is Alfred. To start working please enter password', reply_markup=ReplyKeyboardRemove())
    

@message_router.message(FSM.password)
async def handle_password(message:Message, state:FSMContext):
    if message.text == getenv("BOT_PASSWORD"):
        await state.set_state(FSM.authorized)
        await message.answer('Authorization is successful. To start working press the button "Start the app".', reply_markup=addEmployeeKeyboard())
    else:
        await message.answer('Incorrect password.')

    
# /csv command handler
@message_router.message(FSM.authorized, Command('csv'))
async def csv_export_handler(message: Message):
    await message.answer('Contacts list in csv format:')
    csv_string = await make_csv_string()

    input_file = types.BufferedInputFile(csv_string,'contacts.csv')
    await message.answer_document(input_file)

