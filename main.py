import os
from flask import Flask, render_template, request
import pymysql.cursors
from table_manipulation import TattooManager
from database import database_manager

app = Flask(__name__)

tattoo_manager = TattooManager()

UPLOAD_FOLDER = os.getcwd() + '/uploads'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/hey')
def users():
    cur = database_manager.connection.cursor()
    cur.execute('''SELECT * FROM tattoos''')
    rv = cur.fetchall()
    return str(rv)


@app.route('/', methods=['GET', 'POST'])
def index():
    tattoo_manager.get_next_tattoo_id("tattoos", "tattoo_db")
    if request.method == "POST":
        details = request.form
        file = request.files['vector_file']
        tags = details['tag']
        action = details['action']
        if action == "submit":
            #tattoo_manager.add_tattoo(img_path)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
            #print(tattoo_manager.get_tattoo_id())
 #       if action == "remove":
  #          tattoo_manager.remove_tattoo(tattoo_name)
        return 'success'
    return render_template('index.html')



if __name__ == '__main__':
    app.run(debug=True)
