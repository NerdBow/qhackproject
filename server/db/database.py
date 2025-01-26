import sqlite3


def connect():
    return sqlite3.connect("db/users.db")


def setup_table(db):
    with db:
        db.cursor().execute(
            "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, rotTime INTEGER);")


def add_user(db, username):
    try:
        with db:
            db.cursor().execute(
                "INSERT INTO users (username, rotTime) VALUES(?, ?)", (username, 0))
            return True
    except:
        return False


def update_rot_time(db, username, rotTime):
    with db:
        db.cursor().execute(
            "UPDATE users SET rotTime = ? WHERE username = ?;", (rotTime, username))


def get_top_rotters(db):
    with db:
        res = db.cursor().execute(
            "SELECT * FROM users ORDER BY rotTime DESC LIMIT 10;")
        if res is None:
            return []
        return res.fetchall()
