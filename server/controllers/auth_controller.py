from flask import request, jsonify
from flask_login import login_user, logout_user, current_user, login_required
from flask_jwt_extended import create_access_token
from server.models.user import User


def register():
    data = request.get_json() or {}
    required = ["full_name", "email", "password"]
    if not all(k in data and data[k] for k in required):
        return jsonify({"error": "Missing required fields."}), 400

    email = data["email"].strip().lower()
    password = data["password"]
    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters."}), 400

    existing = User.find_by_email(email)
    if existing:
        return jsonify({"error": "Email already registered."}), 409

    user = User(
        {
            "full_name": data["full_name"].strip(),
            "email": email,
            "monthly_income": float(data.get("monthly_income", 0)),
            "is_admin": False,
            "password_hash": "",
        }
    )
    user.set_password(password)
    user.save()
    return jsonify({"message": "Registration successful.", "user": user.to_dict()}), 201


def login():
    data = request.get_json() or {}
    email = (data.get("email") or "").lower().strip()
    password = data.get("password") or ""

    user = User.find_by_email(email)
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password."}), 401

    login_user(user, remember=True)
    token = create_access_token(identity=str(user.id))
    return jsonify({"message": "Login successful.", "user": user.to_dict(), "token": token})


@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully."})


@login_required
def me():
    return jsonify({"user": current_user.to_dict()})
