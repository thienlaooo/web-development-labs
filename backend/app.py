from flask import Flask, jsonify
from api.Auth import auth_bp
from api.MedicineAPI import medicine_api
from api.StoreAPI import store_api
from api.UserAPI import user_api
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    app.register_blueprint(medicine_api)
    app.register_blueprint(store_api)
    app.register_blueprint(user_api)
    app.register_blueprint(auth_bp)
    CORS(app)

    @app.route("/api/v1/hello-world-22")
    def hello_world():
        return "Hello World 22"

    @app.errorhandler(ValueError)
    def handle_bad_request(e: ValueError):
        return str(e), 400

    return app




