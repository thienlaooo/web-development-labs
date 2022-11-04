from flask import Flask
from MedicineAPI import medicine_api
from StoreAPI import store_api
from UserAPI import user_api

app = Flask(__name__)
app.register_blueprint(medicine_api)
app.register_blueprint(store_api)
app.register_blueprint(user_api)


@app.route("/api/v1/hello-world-22")
def hello_world():
    return "Hello World 22"


@app.errorhandler(ValueError)
def handle_bad_request(e: ValueError):
    return str(e), 400
