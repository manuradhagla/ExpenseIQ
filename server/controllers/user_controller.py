from flask import jsonify, request
from flask_login import current_user, login_required
from server.db import get_db


@login_required
def profile():
    return jsonify({"user": current_user.to_dict()})


@login_required
def update_profile():
    data = request.get_json() or {}
    if "full_name" in data:
        current_user.full_name = data["full_name"].strip()
    if "monthly_income" in data:
        current_user.monthly_income = float(data["monthly_income"])
    get_db().users.update_one(
        {"_id": current_user.document["_id"]},
        {"$set": {"full_name": current_user.full_name, "monthly_income": current_user.monthly_income}},
    )
    return jsonify({"message": "Profile updated.", "user": current_user.to_dict()})


@login_required
def admin_overview():
    if not current_user.is_admin:
        return jsonify({"error": "Unauthorized"}), 403
    users_count = get_db().users.count_documents({})
    return jsonify({"users_count": users_count})
