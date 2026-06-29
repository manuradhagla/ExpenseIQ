from flask import Blueprint
from server.controllers.expense_controller import list_expenses, create_expense, update_expense, delete_expense

expense_bp = Blueprint("expenses", __name__, url_prefix="/api/expenses")
expense_bp.get("/")(list_expenses)
expense_bp.post("/")(create_expense)
expense_bp.put("/<expense_id>")(update_expense)
expense_bp.delete("/<expense_id>")(delete_expense)
