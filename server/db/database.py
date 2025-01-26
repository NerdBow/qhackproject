import sqlite3


def connect():
    connection = sqlite3.connect("db/users.db")
    cursor = connection.cursor()
    return cursor


def setup_table(cursor):
    cursor.execute(
        "CREATE TABLE IF NOT EXIST 'users' (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL")
    cursor.execute(
        "CREATE TABLE IF NOT EXIST 'status' (id INTEGER PRIMARY KEY, username TEXT UNIQUE NOT NULL, status TEXT NOT NULL), FOREIGN KEY (id) REFERENCES users(id);")
    cursor.execute(
        "CREATE TABLE IF NOT EXIST 'friends' (user_id INTEGER PRIMARY KEY, friend_id INTEGER, FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (friend_id) REFERENCES users(id);")


def add_user(cursor, username):
    cursor.execute("INSERT INTO users VALUES(?)", username)


def add_status(cursor, user_id, username):
    cursor.execute("INSERT INTO status VALUES(?, ?)", user_id, username, "")


def add_friend(cursor, user_id, friend_name):
    res = cursor.execute(
        "SELECT id FROM users WHERE username = ?", friend_name)
    if res is None:
        print("add_friend: There was no friend")
        return
    friend_id = res.fetchone()
    cursor.execute("INSERT INTO friends VALUES(?, ?)", user_id, friend_id)


def update_status(cursor, user_id, isRot):
    cursor.execute("UPDATE status SET status = ? WHERE id = ?",
                   "Rotting" if isRot else "Productive", user_id)


def get_friends_status(cursor, user_id):
    res = cursor.execute(
        "SELECT u.id, u.username FROM user u JOIN friends f ON u.id = f.friend_id WHERE f.user_id = ?", user_id)
    if res is None:
        print("add_friend: There was no friend")
        return
    print(res.fetchall())
