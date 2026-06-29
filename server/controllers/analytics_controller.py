from datetime import datetime
from bson import ObjectId
from pymongo import ReturnDocument
from flask import jsonify, request, send_from_directory
from flask_login import current_user, login_required
from server.config import Config
from server.db import get_db
from server.services.analytics_service import monthly_summary, anomaly_scores, generate_monthly_charts


@login_required
def analytics_overview():
    month = request.args.get("month") or datetime.now().strftime("%Y-%m")
    summary = monthly_summary(current_user.id, month)
    anomalies = anomaly_scores(current_user.id, month)
    charts = generate_monthly_charts(current_user.id, month, Config.CHARTS_DIR)
    return jsonify({"summary": summary, "anomalies": anomalies, "charts": charts})


@login_required
def get_chart(filename):
    return send_from_directory(Config.CHARTS_DIR, filename)


@login_required
def list_alerts():
    items = []
    for doc in get_db().alerts.find({"user_id": current_user.id}).sort("created_at", -1).limit(50):
        doc["id"] = str(doc.pop("_id"))
        items.append(doc)
    return jsonify({"items": items})


@login_required
def mark_alert_read(alert_id):
    try:
        object_id = ObjectId(alert_id)
    except Exception:
        return jsonify({"error": "Alert not found."}), 404
    collection = get_db().alerts
    result = collection.find_one_and_update(
        {"_id": object_id, "user_id": current_user.id},
        {"$set": {"is_read": True}},
        return_document=ReturnDocument.AFTER,
    )
    if not result:
        return jsonify({"error": "Alert not found."}), 404
    result["id"] = str(result.pop("_id"))
    return jsonify({"message": "Alert updated.", "alert": result})
