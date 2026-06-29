import os
from flask import Flask, jsonify
from flask_cors import CORS
from server.config import Config
from server.extensions import login_manager, jwt
from server.db import init_mongo
from server.routes.auth_routes import auth_bp
from server.routes.expense_routes import expense_bp
from server.routes.budget_routes import budget_bp
from server.routes.analytics_routes import analytics_bp
from server.routes.report_routes import report_bp
from server.routes.user_routes import user_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    os.makedirs(app.config["CHARTS_DIR"], exist_ok=True)
    CORS(app, supports_credentials=True, origins=app.config["CORS_ORIGINS"])
    init_mongo(app)
    login_manager.init_app(app)
    jwt.init_app(app)
    login_manager.login_view = "auth.login"

    @login_manager.unauthorized_handler
    def unauthorized():
        return jsonify({"error": "Authentication required."}), 401

    app.register_blueprint(auth_bp)
    app.register_blueprint(expense_bp)
    app.register_blueprint(budget_bp)
    app.register_blueprint(analytics_bp)
    app.register_blueprint(report_bp)
    app.register_blueprint(user_bp)

    @app.get("/health")
    def health():
        return jsonify({"status": "ok", "service": "ExpenseIQ API"})

    return app


app = create_app()


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.getenv("PORT", "5000")),
        debug=True,
        use_reloader=False,
    )
