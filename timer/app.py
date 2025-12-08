import os

from flask import Flask, render_template, session, request, jsonify, redirect
from flask_session import Session
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from calendar import monthrange, month_name 

DATABASE = "database.db"

def query_db(query, args=(), one=False):
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # Makes rows behave like dicts
    cur = conn.execute(query, args)
    rows = cur.fetchall()
    conn.commit()
    conn.close()
    return (dict(rows[0]) if rows else None) if one else [dict(row) for row in rows]

def insert_db(query, args=()):
    conn = sqlite3.connect(DATABASE)
    cur = conn.cursor()
    cur.execute(query, args)
    conn.commit()
    last_id = cur.lastrowid
    conn.close()
    return last_id

app = Flask(__name__)
app.config['SECRET_KEY'] = "ugouygnfbytdopuhuyd5wsreyrtciygy"



app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config["SESSION_REFRESH_EACH_REQUEST"] = False

app.config['SESSION_COOKIE_PATH'] = '/'
Session(app)




@app.route("/")
def index():
    return render_template("index.html") 


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        confirmpassword = request.form.get("confirmpassword")

        if password != confirmpassword:
            return render_template("register.html", error="Passwords do not match.")
        elif not username or not password:
            return render_template("register.html", error="Username and password cannot be empty.")
        elif query_db("SELECT * FROM users WHERE username = ?", (username,), one=True):
            return render_template("register.html", error="Username already exists.")
        
        insert_db("INSERT INTO users (username, hash) VALUES (?, ?)",(username, generate_password_hash(password)))

        session['id'] = query_db("SELECT id FROM users WHERE username = ?", [username], one=True)['id']
        return redirect("/")
        
    
    else:
        return render_template("register.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    
    if request.method == "POST":
        session.clear()
        username = request.form.get("username")
        password = request.form.get("password")
        if not username or not password:
            return render_template("login.html", error="Username and password cannot be empty.")
        user = query_db("SELECT * FROM users WHERE username = ?", (username,), one=True)
        if not user:
            return render_template("login.html", error="User not found.")
        if not check_password_hash(user['hash'], password):
            return render_template("login.html", error="Incorrect password.")
        session['id'] = user['id']
        session['lastminutes'] = 10
        session['lastseconds'] = 0
        return redirect("/")
    else:
        return render_template("login.html")

@app.route("/update_current_timer")
def update_current_timer():

    minutes = request.args.get('minutes')
    seconds = request.args.get('seconds')
    session['currentminutes'] = int(minutes)
    session['currentseconds'] = int(seconds)
    return {"status": "success"}

@app.route("/get_current_timer")
def get_current_timer():
    if session.get('currentminutes') is not None:

        return jsonify({"status":1, "minutes": session['currentminutes'] , "seconds": session['currentseconds']})
    else:
        return jsonify({"status":0})    

@app.route("/update_timer")
def update_timer():

    minutes = request.args.get('minutes')
    seconds = request.args.get('seconds')
    session['lastminutes'] = int(minutes)
    session['lastseconds'] = int(seconds)
    

    return {"status": "success"}

@app.route("/end_timer")
def get_timer():
    if session['id']:

        totaltime = round(int(session["lastminutes"]) * 60 + int(session["lastseconds"])/60,2)
        time = datetime.now()
        insert_db("INSERT INTO history (id , timedate, length) VALUES (?, ?, ?)", (session['id'], time, totaltime))
    return jsonify({"status": "success", "minutes": session['lastminutes'] , "seconds": session['lastseconds']})

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")

@app.route("/hourly_data")
def hourly_data():
    data = query_db("SELECT length, timedate FROM history WHERE id = ?", (session['id'],))
    hourly_data = [0] * 24 
    total = 0.01
    for i in data:
        total += i['length']
    for i in data:
        hourly_data[int(i['timedate'].split(" ")[1][:2])] += round(i['length']/total *100)
        
    labels = [f"{i}:00" for i in range(24)]
    
    return jsonify({"dataset":hourly_data, "labels": labels})

@app.route("/stats")
def stats():
    data = query_db("SELECT length, timedate FROM history WHERE id = ?", (session['id'],))
    total = sum(i['length'] for i in data)
    average = total / len(data) if data else 0
    total = round(total/60)
    average = round(average/60)
    return render_template("stats.html", total=total , average=average)


@app.route("/month_data", methods=["GET"])
def month_data():
    month = datetime.now().month
    data = query_db("SELECT length, timedate FROM history WHERE id = ?", (session['id'],))
    month_data = [0] * monthrange(datetime.now().year, int(month))[1]  # Days in the month
    for i in data:
        if int(i['timedate'].split("-")[1][:2]) == int(month):
            month_data[int(i['timedate'].split("-")[2][:2])-1] += round(i['length'])/60
        
    labels = [f"{month}/{i}" for i in range(1, len(month_data)+1)]
    
    return jsonify({"dataset":month_data, "labels": labels})

@app.route("/year_data", methods=["GET"])
def year_data():
    year = datetime.now().year
    data = query_db("SELECT length, timedate FROM history WHERE id = ?", (session['id'],))
    year_data = [0] * 12
    for i in data:
        if int(i['timedate'].split("-")[0]) == int(year):
          year_data[int(i['timedate'].split("-")[1][:2])-1] += round(i['length'])/60
        
    labels = [month_name[i] for i in range(1,13)]
    
    return jsonify({"dataset":year_data, "labels": labels})



@app.route("/invite_friend", methods=["GET", "POST"])
def invite_friend():
    if request.method == "POST":
        id = query_db("SELECT id FROM users WHERE username = ?", (request.form.get("username"),), one=True)
        if not id:
            return render_template("friends.html", error="User not found.")
        
        if query_db("SELECT * FROM friends WHERE (ID1 = ? AND ID2 = ?) OR (ID1 = ? AND ID2 = ?)",(session["id"], id["id"], id["id"], session["id"])):
            return render_template("friends.html", error ="user invited/friend") 
        insert_db("INSERT INTO friends (ID1, ID2, accepted) VALUES (?, ?, ?)", (session['id'], id['id'],0))

        return render_template("friends.html", success="Friend request sent.")
    

@app.route("/accept_friend", methods=["GET", "POST"])
def accept_friend():
    if request.method == "POST":
        insert_db("UPDATE friends SET accepted = 1 WHERE ID1 = ? AND ID2 = ?", (request.form.get("id"), session['id']))
    return render_template("friends.html", sucess= "accepted")

@app.route("/view_invites")
def view_invites():
    ids = query_db("SELECT ID1 FROM friends WHERE ID2 = ? AND accepted = 0", (session['id'],))
    users = [query_db("SELECT username,id FROM users WHERE id = ?", (i['ID1'],), one= True) for i in ids]
    return jsonify(users)

@app.route("/view_friends")
def view_friends():
    ids = query_db("SELECT ID1,ID2 FROM friends WHERE (ID2 = ? OR ID1 = ?) AND accepted = 1", (session['id'],session['id']))
    users = [query_db("SELECT username,id FROM users WHERE id IN (?,?)", (i['ID1'],i["ID2"])) for i in ids]
    friends = []
    
    for i in users:
        for h in i:
            
            if h["id"] != session["id"]:
            
                friends.append(h)
    return jsonify(friends)

@app.route("/friends")
def friends():
    return render_template("friends.html")

@app.route("/weekly_leaderboard")
def weekly_leaderboard():
    weekago = datetime.now() - timedelta(days=7)
    leaderboard= {}
    for pair in query_db("SELECT ID1,ID2 FROM friends WHERE accepted = 1 AND (ID1 = ? OR ID2 = ?)",(session["id"],session["id"])):
        id = pair["ID1"] if pair["ID2"] == session["id"] else pair["ID2"]
        unsafe = query_db("SELECT SUM(length) FROM history WHERE id = ? AND timedate BETWEEN ? AND ?",(id,weekago,datetime.now()), one=True)["SUM(length)"]
        name = query_db("SELECT username FROM users WHERE id = ?", (id,), one=True)["username"]
        temp = unsafe or 0
        leaderboard[name] = round(temp/60)
    
    unsafe = query_db("SELECT SUM(length) FROM history WHERE id = ? AND timedate BETWEEN ? AND ?",(session["id"],weekago,datetime.now()), one=True)["SUM(length)"]
    name = query_db("SELECT username FROM users WHERE id = ?", (session["id"],), one=True)["username"]
    temp = unsafe or 0
    leaderboard[name] = round(temp/60)

    leaderboard = sorted(leaderboard.items(), key= lambda item: item[1], reverse = True)
    
    return jsonify(leaderboard)


@app.route("/goals")
def goals():
    return render_template("goals.html")

@app.route("/create_goal", methods=["GET", "POST"])
def create_goal():
    if request.method == "POST":
        length = request.form.get("length")
        time = request.form.get("expire")
        title = request.form.get("title")
        if not length or not time:
            return render_template("goals.html", error="Length and time cannot be empty.")
        goalId = insert_db("INSERT INTO goals (length, expire, title, startDate) VALUES (?, ?, ?, ?)", (length, time, title, datetime.now()))
        insert_db("INSERT INTO goalsInvites (id, taskID, accepted) VALUES (?, ?, ?)",(session['id'], goalId, 1))
        return redirect("/goals")

@app.route("/invite_goal", methods=["GET", "POST"])
def invite_goal():
    # id = query_db("SELECT id FROM users WHERE username = ?", (request.form.get("username"),), one=True)
    # if not id:
    #     return render_template("goals.html", error="User not found.")
    id = request.form.get("id")
    if query_db("SELECT * FROM goalsInvites WHERE id = ? AND taskID = ?",(int(id), request.form.get("taskID"))):
        return redirect("/goals")
    insert_db("INSERT INTO goalsInvites (id, taskID, accepted) VALUES (?, ?, ?)",(int(id), request.form.get("taskID"), 0))
    return redirect("/goals")

@app.route("/view_goal_invites", methods=["GET", "POST"])
def view_goal_invites():
    ids = query_db("SELECT taskID FROM goalsInvites WHERE id = ? AND accepted = 0", (session['id'],))
    goals = [query_db("SELECT id, length, expire, title FROM goals WHERE id = ?", (i['taskID'],), one= True) for i in ids]
    return jsonify(goals)

@app.route("/accept_goal_invite", methods=["POST"])
def accept_goal_invite():
    insert_db("UPDATE goalsInvites SET accepted = 1 WHERE id = ? AND taskID = ?", (session['id'],request.form.get("taskID")))
    return redirect("/goals")


@app.route("/view_goals", methods=["GET", "POST"])
def view_goals():
    ids = query_db("SELECT taskID FROM goalsInvites WHERE id = ? AND accepted = 1", (session['id'],))
    goals = [query_db("SELECT id, length, expire, title FROM goals WHERE id = ? AND expire > ?", (i['taskID'], datetime.now() - timedelta(days=5)), one= True) for i in ids]
    return jsonify(goals)

@app.route("/get_progress", methods=["GET", "POST"])
def get_progress():
    taskID = request.args.get('taskID')

    goal = query_db("SELECT id,startDate,expire FROM goals WHERE id = ?", (taskID,), one=True)

    ids = query_db("SELECT id FROM goalsInvites WHERE taskID = ? AND accepted = 1", (taskID,))
    progress = {}
    for i in ids:
        unsafe = query_db("SELECT SUM(length) FROM history WHERE id = ? AND timedate BETWEEN ? AND ?",(i["id"],goal["startDate"],goal["expire"]), one=True)["SUM(length)"]
        name = query_db("SELECT username FROM users WHERE id = ?", (i["id"],), one=True)["username"]
        progress[name] =unsafe or 0
        progress[name] = round(progress[name]/60,2)

    
    return jsonify(list(progress.items()))