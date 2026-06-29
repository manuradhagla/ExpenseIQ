from datetime import datetime, timezone
from bson import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from server.extensions import login_manager
from server.db import get_db


class User(UserMixin):
    def __init__(self, document):
        self.document = document
        # New users are created before MongoDB assigns _id.
        self.id = str(document["_id"]) if document.get("_id") else None
        self.full_name = document["full_name"]
        self.email = document["email"]
        self.password_hash = document["password_hash"]
        self.monthly_income = float(document.get("monthly_income", 0.0))
        self.created_at = document.get("created_at") or datetime.now(timezone.utc)
        self.is_admin = bool(document.get("is_admin", False))

    def set_password(self, password: str) -> None:
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "full_name": self.full_name,
            "email": self.email,
            "monthly_income": self.monthly_income,
            "created_at": self.created_at.isoformat(),
            "is_admin": self.is_admin,
        }

    @staticmethod
    def find_by_email(email: str):
        doc = get_db().users.find_one({"email": email})
        return User(doc) if doc else None

    @staticmethod
    def find_by_id(user_id: str):
        try:
            doc = get_db().users.find_one({"_id": ObjectId(user_id)})
        except Exception:
            doc = None
        return User(doc) if doc else None

    def save(self):
        collection = get_db().users
        payload = {
            "full_name": self.full_name,
            "email": self.email,
            "password_hash": self.password_hash,
            "monthly_income": self.monthly_income,
            "created_at": self.created_at,
            "is_admin": self.is_admin,
        }
        if self.document.get("_id"):
            collection.update_one({"_id": self.document["_id"]}, {"$set": payload})
        else:
            result = collection.insert_one(payload)
            self.document["_id"] = result.inserted_id
            self.id = str(result.inserted_id)


@login_manager.user_loader
def load_user(user_id):
    return User.find_by_id(user_id)
