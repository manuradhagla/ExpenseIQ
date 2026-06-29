from datetime import datetime
from server.db import get_db


def evaluate_budget_alerts(user_id: int, month: str):
    db = get_db()
    monthly_budget = db.budgets.find_one({"user_id": str(user_id), "month": month, "category": None})
    if not monthly_budget:
        return []

    expenses = list(db.expenses.find({"user_id": str(user_id), "spent_on": {"$regex": f"^{month}-"}}))
    spent = sum(float(x.get("amount", 0)) for x in expenses)

    alerts = []
    threshold = float(monthly_budget.get("threshold", 0))
    utilization = (spent / threshold) * 100 if threshold else 0
    if utilization >= 100:
        alerts.append(("critical", f"You have crossed monthly budget by {spent - threshold:.2f}."))
    elif utilization >= 80:
        alerts.append(("warning", f"You have used {utilization:.1f}% of your monthly budget."))

    created = []
    for severity, message in alerts:
        existing = db.alerts.find_one({"user_id": str(user_id), "type": "budget_threshold", "message": message})
        if existing:
            continue
        entry = {
            "user_id": str(user_id),
            "type": "budget_threshold",
            "severity": severity,
            "message": message,
            "is_read": False,
            "created_at": datetime.utcnow().isoformat(),
        }
        inserted = db.alerts.insert_one(entry)
        entry["id"] = str(inserted.inserted_id)
        created.append(entry)
    return created
