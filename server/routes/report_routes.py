from flask import Blueprint
from server.controllers.report_controller import reports_meta, export_csv, export_pdf

report_bp = Blueprint("reports", __name__, url_prefix="/api/reports")
report_bp.get("/")(reports_meta)
report_bp.get("/export/csv")(export_csv)
report_bp.get("/export/pdf")(export_pdf)
