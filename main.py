import os
from flask import Flask, render_template, request, jsonify
import pymysql.cursors
from table_manipulation import TattooManager
from database import database_manager
import uuid

app = Flask(__name__)

tattoo_manager = TattooManager()

UPLOAD_FOLDER = os.getcwd() + '/uploads'
allowed_extentions = ('.ai', '.pdf', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.tif')

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/hey')
def users():
    cur = database_manager.connection.cursor()
    cur.execute('''SELECT * FROM tattoos''')
    rv = cur.fetchall()
    return str(rv)


@app.route('/all')
def all_data():
    cur = database_manager.connection.cursor()
    cur.execute('''SELECT * FROM tattoos''')
    rv = cur.fetchall()
    return jsonify(rv)


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == "POST":
        details = request.form
        file = request.files['vector_file']
        tags = details['tag']
        action = details['action']
        file_name, file_extention = os.path.splitext(file.filename)
        random_id_name = str(uuid.uuid4()) + file_extention
        if file_extention in allowed_extentions:
            print(file_extention)
        if action == "submit":
            tattoo_manager.add_tattoo(random_id_name)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], random_id_name))
 #       if action == "remove":
  #          tattoo_manager.remove_tattoo(tattoo_name)
        return 'success'
    return render_template('index.html')



if __name__ == '__main__':
    app.run(debug=True)
