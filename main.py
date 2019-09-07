from flask import Flask, render_template, request
from flask_mysqldb import MySQL


app = Flask(__name__)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'password'
app.config['MYSQL_DB'] = 'mynewdb'


mysql = MySQL(app)


@app.route('/hey')
def users():
    cur = mysql.connection.cursor()
    cur.execute('''SELECT * FROM MyUsers''')
    rv = cur.fetchall()
    return str(rv)


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == "POST":
        details = request.form
        firstName = details['fname']
        lastName = details['lname']
        action = details['action']
        cur = mysql.connection.cursor()
        if action == "submit":
        	cur.execute("INSERT INTO MyUsers(firstName, lastName) VALUES (%s, %s)", (firstName, lastName))
        if action == "remove":
            cur.execute("DELETE FROM MyUsers WHERE firstName=%s", (firstName,))
        mysql.connection.commit()
        cur.close()
        return 'success'
    return render_template('index.html')



if __name__ == '__main__':
    app.run(debug=True)