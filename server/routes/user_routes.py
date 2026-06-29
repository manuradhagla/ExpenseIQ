from flask import Blueprint
from server.controllers.user_controller import profile, update_profile, admin_overview

user_bp = Blueprint("users", __name__, url_prefix="/api/users")
user_bp.get("/profile")(profile)
user_bp.put("/profile")(update_profile)
user_bp.get("/admin/overview")(admin_overview)
