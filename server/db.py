from pymongo import MongoClient

mongo_client = None
mongo_db = None


def init_mongo(app):
    global mongo_client, mongo_db
    mongo_client = MongoClient(app.config["MONGO_URI"])
    mongo_db = mongo_client[app.config["MONGO_DB_NAME"]]
    mongo_db.users.create_index("email", unique=True)
    mongo_db.expenses.create_index([("user_id", 1), ("spent_on", -1)])
    mongo_db.budgets.create_index([("user_id", 1), ("month", 1), ("category", 1)], unique=True)
    mongo_db.alerts.create_index([("user_id", 1), ("created_at", -1)])


def get_db():
    if mongo_db is None:
        raise RuntimeError("MongoDB is not initialized.")
    return mongo_db
