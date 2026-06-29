import os
from datetime import date
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from server.db import get_db


def _as_dataframe(expenses):
    if not expenses:
        return pd.DataFrame(columns=["spent_on", "amount", "category"])
    rows = [{"spent_on": e["spent_on"], "amount": e["amount"], "category": e["category"]} for e in expenses]
    return pd.DataFrame(rows)


def monthly_summary(user_id: int, month: str):
    db = get_db()
    expenses = list(db.expenses.find({"user_id": str(user_id), "spent_on": {"$regex": f"^{month}-"}}))

    df = _as_dataframe(expenses)
    total_expense = float(df["amount"].sum()) if not df.empty else 0.0
    category_breakdown = (
        df.groupby("category")["amount"].sum().to_dict() if not df.empty else {}
    )
    budgets = list(db.budgets.find({"user_id": str(user_id), "month": month, "category": None}))
    total_budget = sum(float(x.get("threshold", 0)) for x in budgets)
    return {
        "month": month,
        "total_expense": total_expense,
        "category_breakdown": category_breakdown,
        "budget": float(total_budget),
        "budget_utilization": round((total_expense / total_budget) * 100, 2) if total_budget > 0 else 0,
    }


def anomaly_scores(user_id: int, month: str):
    expenses = list(get_db().expenses.find({"user_id": str(user_id), "spent_on": {"$regex": f"^{month}-"}}))

    if not expenses:
        return []

    amounts = np.array([x["amount"] for x in expenses], dtype=float)
    mean = np.mean(amounts)
    std = np.std(amounts) or 1.0

    results = []
    for exp in expenses:
        z_score = (exp["amount"] - mean) / std
        anomaly = min(abs(float(z_score)) / 3, 1.0)
        results.append(
            {
                "expense_id": str(exp["_id"]),
                "title": exp["title"],
                "amount": exp["amount"],
                "spent_on": exp["spent_on"],
                "z_score": round(float(z_score), 3),
                "anomaly_score": round(anomaly, 3),
                "is_unusual": abs(z_score) >= 2,
            }
        )
    return results


def generate_monthly_charts(user_id: int, month: str, charts_dir: str):
    os.makedirs(charts_dir, exist_ok=True)
    summary = monthly_summary(user_id, month)
    categories = list(summary["category_breakdown"].keys())
    values = list(summary["category_breakdown"].values())

    pie_path = os.path.join(charts_dir, f"user_{user_id}_{month}_pie.png")
    bar_path = os.path.join(charts_dir, f"user_{user_id}_{month}_bar.png")

    if categories:
        plt.figure(figsize=(6, 6))
        plt.pie(values, labels=categories, autopct="%1.1f%%", startangle=90)
        plt.title(f"Category Spending - {month}")
        plt.tight_layout()
        plt.savefig(pie_path)
        plt.close()

        plt.figure(figsize=(8, 4))
        plt.bar(categories, values)
        plt.xticks(rotation=30, ha="right")
        plt.title(f"Category Totals - {month}")
        plt.tight_layout()
        plt.savefig(bar_path)
        plt.close()

    return {
        "pie_chart": os.path.basename(pie_path) if categories else None,
        "bar_chart": os.path.basename(bar_path) if categories else None,
        "summary": summary,
        "generated_at": date.today().isoformat(),
    }
