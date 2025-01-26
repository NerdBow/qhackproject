from flask import Flask, jsonify, request, g
from db import database
import json


def create_app():
    app = Flask(__name__)
    return app


def get_db():
    if not hasattr(g, 'db'):  # Check if db is already in the Flask global context
        g.db = database.connect()
    return g.db


app = create_app()


@app.route("/users", methods=["POST", "PUT", "GET"])
def handle_users():
    if request.method == "POST":
        # ADD USER TO THE DATABASE
        data = request.get_json()
        username = data.get("username")

        if username is None:
            return jsonify({"Error": "Unauthorized"}), 401
        database.add_user(get_db(), username)
        return jsonify({"StatusCode": 200}), 200

    elif request.method == "PUT":
        data = request.get_json()
        username = data.get("username")
        rotTime = data.get("rotTime")
        print(data)

        if username is None:
            return jsonify({"Error": "Unauthorized"}), 401
        if rotTime is None:
            return jsonify({"Error": "Bad Request"}), 400

        database.update_rot_time(get_db(), username, rotTime)
        return jsonify({"StatusCode": 200}), 200

    elif request.method == "GET":
        return jsonify(database.get_top_rotters(get_db())), 200


@app.teardown_appcontext
def close_db(error):
    db = getattr(g, '', None)
    if db is not None:
        db.close()


if __name__ == "__main__":
    with open("config.json") as f:
        config = json.load(f)
        app.run(host=config["IP"], port=config["PORT"], debug=True)
