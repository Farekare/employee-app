from motor.motor_asyncio import AsyncIOMotorClient


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

    async def get_data(self, parameters={}):
        cursor = self._collection.find({'tags': {'$in': parameters}})
        result = await cursor.to_list(None)
        return result
