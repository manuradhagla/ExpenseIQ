from flask import Blueprint
from server.controllers.budget_controller import list_budgets, upsert_budget, delete_budget

budget_bp = Blueprint("budgets", __name__, url_prefix="/api/budgets")
budget_bp.get("/")(list_budgets)
budget_bp.post("/")(upsert_budget)
budget_bp.delete("/<budget_id>")(delete_budget)
