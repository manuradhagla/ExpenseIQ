from flask import Response, jsonify, request
from flask_login import current_user, login_required
from server.db import get_db
from server.services.report_service import generate_csv, generate_pdf


@login_required
def export_csv():
    month = request.args.get("month")
    expenses = list(
        get_db()
        .expenses.find({"user_id": current_user.id, "spent_on": {"$regex": f"^{month}-"}})
        .sort("spent_on", -1)
    )
    data = generate_csv(expenses)
    return Response(
        data,
        mimetype="text/csv",
        headers={"Content-Disposition": f"attachment; filename=expenseiq-{month}.csv"},
    )


@login_required
def export_pdf():
    month = request.args.get("month")
    expenses = list(
        get_db()
        .expenses.find({"user_id": current_user.id, "spent_on": {"$regex": f"^{month}-"}})
        .sort("spent_on", -1)
    )
    pdf_data = generate_pdf(expenses, month)
    return Response(
        pdf_data,
        mimetype="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=expenseiq-{month}.pdf"},
    )


@login_required
def reports_meta():
    return jsonify(
        {
            "message": "Use /api/reports/export/csv?month=YYYY-MM or /api/reports/export/pdf?month=YYYY-MM",
            "formats": ["csv", "pdf"],
        }
    )
