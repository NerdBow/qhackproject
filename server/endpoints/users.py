from flask import Blueprint, jsonify, request

blueprint = Blueprint("users", __name__)


@blueprint.route("/", methods=["POST", "GET"])
def handle_users():
    if request.method == "POST":
        print(request.data)
        print("POST")
        return jsonify({"haha": "AKI NO SORA"}), 200
    elif request.method == "GET":
        print(request.data)
        print("GET")
        return jsonify({"haha": "AKI NO SORA"}), 200


def get_user():
    return


def post_user():
    return
