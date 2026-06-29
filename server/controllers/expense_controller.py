from datetime import datetime
from bson import ObjectId
from flask import request, jsonify
from flask_login import current_user, login_required
from server.db import get_db
from server.services.alert_service import evaluate_budget_alerts


@login_required
def list_expenses():
    page = max(int(request.args.get("page", 1)), 1)
    limit = min(max(int(request.args.get("limit", 10)), 1), 100)
    month = request.args.get("month")
    search = (request.args.get("search") or "").strip()

    mongo_query = {"user_id": current_user.id}
    if month:
        mongo_query["spent_on"] = {"$regex": f"^{month}-"}
    if search:
        mongo_query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"category": {"$regex": search, "$options": "i"}},
        ]

    expenses = get_db().expenses
    total = expenses.count_documents(mongo_query)
    cursor = (
        expenses.find(mongo_query)
        .sort("spent_on", -1)
        .skip((page - 1) * limit)
        .limit(limit)
    )
    items = []
    for doc in cursor:
        doc["id"] = str(doc.pop("_id"))
        items.append(doc)
    return jsonify(
        {
            "items": items,
            "total": total,
            "page": page,
            "pages": (total + limit - 1) // limit,
        }
    )


@login_required
def create_expense():
    data = request.get_json() or {}
    try:
        title = data["title"].strip()
        amount = float(data["amount"])
        if not title:
            return jsonify({"error": "Title is required."}), 400
        if amount <= 0:
            return jsonify({"error": "Amount must be greater than 0."}), 400
        expense = {
            "user_id": current_user.id,
            "title": title,
            "amount": amount,
            "category": data["category"].strip(),
            "payment_mode": data["payment_mode"].strip(),
            "note": data.get("note"),
            "spent_on": datetime.strptime(data["spent_on"], "%Y-%m-%d").date().isoformat(),
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
        }
    except (KeyError, ValueError):
        return jsonify({"error": "Invalid expense payload."}), 400

    result = get_db().expenses.insert_one(expense)
    expense["id"] = str(result.inserted_id)
    evaluate_budget_alerts(current_user.id, expense["spent_on"][:7])
    return jsonify({"message": "Expense created.", "expense": expense}), 201


@login_required
def update_expense(expense_id):
    collection = get_db().expenses
    try:
        object_id = ObjectId(expense_id)
    except Exception:
        return jsonify({"error": "Expense not found."}), 404
    expense = collection.find_one({"_id": object_id, "user_id": current_user.id})
    if not expense:
        return jsonify({"error": "Expense not found."}), 404
    data = request.get_json() or {}

    updates = {}
    for field in ["title", "category", "payment_mode", "note"]:
        if field in data:
            updates[field] = data[field]
    if "amount" in data:
        amount = float(data["amount"])
        if amount <= 0:
            return jsonify({"error": "Amount must be greater than 0."}), 400
        updates["amount"] = amount
    if "spent_on" in data:
        updates["spent_on"] = datetime.strptime(data["spent_on"], "%Y-%m-%d").date().isoformat()
    updates["updated_at"] = datetime.utcnow().isoformat()

    collection.update_one({"_id": expense["_id"]}, {"$set": updates})
    updated = collection.find_one({"_id": expense["_id"]})
    updated["id"] = str(updated.pop("_id"))
    evaluate_budget_alerts(current_user.id, updated["spent_on"][:7])
    return jsonify({"message": "Expense updated.", "expense": updated})


@login_required
def delete_expense(expense_id):
    try:
        object_id = ObjectId(expense_id)
    except Exception:
        return jsonify({"error": "Expense not found."}), 404
    result = get_db().expenses.delete_one({"_id": object_id, "user_id": current_user.id})
    if not result.deleted_count:
        return jsonify({"error": "Expense not found."}), 404
    return jsonify({"message": "Expense deleted."})
