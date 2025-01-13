from aiogram.fsm.state import StatesGroup, State

class FSM(StatesGroup):
    password = State()
    authorized = State()
    import_csv = State()