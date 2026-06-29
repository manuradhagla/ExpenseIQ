from bson import ObjectId
from flask import request, jsonify
from flask_login import current_user, login_required
from server.db import get_db
from server.services.alert_service import evaluate_budget_alerts


@login_required
def list_budgets():
    month = request.args.get("month")
    query = {"user_id": current_user.id}
    if month:
        query["month"] = month
    items = []
    for doc in get_db().budgets.find(query).sort("month", -1):
        doc["id"] = str(doc.pop("_id"))
        items.append(doc)
    return jsonify({"items": items})


@login_required
def upsert_budget():
    data = request.get_json() or {}
    month = data.get("month")
    threshold = data.get("threshold")
    category = data.get("category")
    if not month or threshold is None:
        return jsonify({"error": "month and threshold are required"}), 400

    collection = get_db().budgets
    collection.update_one(
        {"user_id": current_user.id, "month": month, "category": category},
        {
            "$set": {
                "user_id": current_user.id,
                "month": month,
                "category": category,
                "threshold": float(threshold),
            }
        },
        upsert=True,
    )
    budget = collection.find_one({"user_id": current_user.id, "month": month, "category": category})
    budget["id"] = str(budget.pop("_id"))
    evaluate_budget_alerts(current_user.id, month)
    return jsonify({"message": "Budget saved.", "budget": budget})


@login_required
def delete_budget(budget_id):
    try:
        object_id = ObjectId(budget_id)
    except Exception:
        return jsonify({"error": "Budget not found."}), 404
    result = get_db().budgets.delete_one({"_id": object_id, "user_id": current_user.id})
    if not result.deleted_count:
        return jsonify({"error": "Budget not found."}), 404
    return jsonify({"message": "Budget removed."})
