from flask import Flask
from endpoints import users


def create_app():
    app = Flask(__name__)
    app.register_blueprint(users.blueprint, url_prefix="/users")
    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
