from motor.motor_asyncio import AsyncIOMotorClient
from typing import List

class MongoClient():
    def __init__(self, db_uri, db_name='', collection_name=''):
        self._db_uri = db_uri
        self._db_name = db_name
        self._collection_name = collection_name
        self._client = AsyncIOMotorClient(self._db_uri)
        self._db = self._client[self._db_name]
        self._collection = self._db[self._collection_name]
        print('Connection to mongo established')

    async def add_data(self, data: dict):
        await self._collection.insert_one(data)

    async def add_data_list(self, data: List[dict]):
        await self._collection.insert_many(data)


    async def get_data(self):
        cursor = self._collection.find({}, {"_id": 0, "__v": 0 })
        result = await cursor.to_list(None)
        return result
