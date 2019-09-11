from flask import Flask, render_template, request
import pymysql.cursors
from table_manipulation import TattooManager


app = Flask(__name__)

tattoo_manager = TattooManager()



connection = pymysql.connect(host='localhost',
                             user='root',
                             password='password',
                             db='mynewdb',
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)

connection.autocommit(True)

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
        lastName = details['lname']
        action = details['action']
        if action == "submit":
        	tattoo_manager.add_tattoo("MyUsers", firstName, lastName)
        if action == "remove":
        	tattoo_manager.remove_tattoo("MyUsers", firstName)
        return 'success'
    return render_template('index.html')



if __name__ == '__main__':
    app.run(debug=True)