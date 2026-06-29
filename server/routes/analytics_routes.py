from flask import Blueprint
from server.controllers.analytics_controller import analytics_overview, get_chart, list_alerts, mark_alert_read

analytics_bp = Blueprint("analytics", __name__, url_prefix="/api/analytics")
analytics_bp.get("/overview")(analytics_overview)
analytics_bp.get("/charts/<path:filename>")(get_chart)
analytics_bp.get("/alerts")(list_alerts)
analytics_bp.patch("/alerts/<alert_id>/read")(mark_alert_read)
