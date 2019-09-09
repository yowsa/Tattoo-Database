from flask import Flask, render_template, request
import pymysql.cursors


app = Flask(__name__)

connection = pymysql.connect(host='localhost',
                             user='root',
                             password='password',
                             db='mynewdb',
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)

@app.route('/hey')
def users():
    cur = connection.cursor()
    cur.execute('''SELECT * FROM MyUsers''')
    rv = cur.fetchall()
    print(rv)
    return str(rv)


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == "POST":
        details = request.form
        firstName = details['fname']
        tableName = "MyUsers"
        lastName = details['lname']
        action = details['action']

        cur = connection.cursor()
        if action == "submit":
        	cur.execute("INSERT INTO " + tableName + "(firstName, lastName) VALUES (%s, %s)", (firstName, lastName))
        if action == "remove":
            cur.execute("DELETE FROM MyUsers WHERE firstName=%s", (firstName,))
        connection.commit()
        cur.close()
        return 'success'
    return render_template('index.html')



if __name__ == '__main__':
    app.run(debug=True)