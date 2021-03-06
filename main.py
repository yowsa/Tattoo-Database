from flask import Flask, jsonify, request, render_template, redirect, url_for
from flask_assets import Bundle, Environment
from flask_login import LoginManager, UserMixin, login_required, login_user, current_user, logout_user  

from database_connector import DatabaseConnector
from database_manager import ItemManager, TagManager
from product_manager import ProductManager
from image_manager import ImageManager
from image_manager import AwsConnector
from config import DatabaseConf, ImageConf
from response import Response
import login_config


CONFIG = login_config.get_config()
database_connector = DatabaseConnector(
    database=CONFIG.DB, host=CONFIG.HOST, user=CONFIG.USER, password=CONFIG.PASSWORD)
database_connector.create_database(CONFIG.DB)
database_connector.create_tables()
connection = database_connector.get_connection()
item_manager = ItemManager(database_connector)
tag_manager = TagManager(database_connector)
s3_resource = AwsConnector(CONFIG.BOTO3_PROFILE).get_s3_resource()
image_manager = ImageManager(s3_resource, CONFIG.BUCKET)
product_manager = ProductManager(item_manager, tag_manager, image_manager)

application = Flask(__name__)
application.secret_key = CONFIG.SECRET_KEY

login_manager = LoginManager()
login_manager.init_app(application)


js = Bundle('js/helper.js', 'js/add-products.js', 'js/lettering.js', 'js/front-page.js', 'js/search.js', 'js/ajax.js', 'js/setup.js', output='gen/main.js')
css = Bundle('css/style.css', 'css/lettering.css', 'css/vendor/pagination.css', output='gen/style.css')

assets = Environment(application)

assets.debug = CONFIG.ASSET_DEBUG

assets.register('main_js', js)
assets.register('main_css', css)

class User(UserMixin):
    pass

@login_manager.user_loader
def user_loader(username):
    if username not in CONFIG.USERS:
        return 
    user = User()
    user.id = username
    return user

@application.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))

    if request.method == 'GET':
        return render_template('login.html')

    username = request.form['username']
    if request.form['username'] in CONFIG.USERS and request.form['password'] == CONFIG.USERS[username]['password']:
        user = User()
        user.id = username
        login_user(user)
        return redirect(url_for('index'))
    return render_template('login.html', message="Username or password was wrong. Please try again.", alert_type="alert-danger")

@login_manager.unauthorized_handler
def unauthorized_handler():
    return redirect(url_for('login'))

@application.route('/logout', methods=['GET'])
def logout():
    logout_user()
    return redirect(url_for('login'))

@application.route('/')
@login_required
def index():
    return render_template('search.html')

@application.route('/add')
@login_required
def add():
    return render_template('add-product.html')

@application.route('/edit')
@login_required
def edit():
    return render_template('search.html')

@application.route('/fontfinder')
@login_required
def lettering():
    return render_template('lettering.html')

@application.route('/api/tags', methods=['GET'])
def unique_tags():
    try:
        unique_tags = tag_manager.get_unique_tags_list()
        return jsonify(Response.OK.message("All unique tags", unique_tags))
    except:
        return jsonify(Response.UNKNOWN_ERROR.message("Something went wrong"))

@application.route('/api/add-products', methods=['POST'])
def add_product():
    info = request.form
    tags = tuple(info['tags'].split(","))
    vector_file = request.files['vector_file']
    vector_file_ext = image_manager.get_file_ext(vector_file.filename)
    png_file = request.files['png_file'] if 'png_file' in request.files else vector_file
    png_file_ext = image_manager.get_file_ext(png_file.filename)
    if image_manager.is_supported_format(vector_file.filename, ImageConf.VECTOR_FORMATS):
        response = product_manager.add_product(
            tags, vector_file.read(), vector_file_ext, png_file.read(), png_file_ext, CONFIG.VECTOR_FOLDER, CONFIG.PNG_FOLDER)
        return response
    return Response.USER_ERROR.message("File format not supported")


@application.route('/api/search', methods=['GET'])
def search_all():
    search_result = product_manager.get_all_products()
    return search_result


@application.route('/api/search/<word>', methods=['POST'])
def search_word(word):
    return product_manager.get_all_matching_products(word)


@application.route('/api/search/random', methods=['GET'])
def random():
    return product_manager.get_random_products(7)


@application.route('/api/product/<string:item_id>', methods=['PUT', 'DELETE'])
def product(item_id):
    if request.method == 'PUT':
        tags = request.json['tags'].split(",")
        tags = tuple(tag.strip() for tag in tags)
        return product_manager.update_product_tags(item_id, tags)
    elif request.method == 'DELETE':
        return product_manager.delete_product(item_id)

@application.route('/api/paths', methods=['GET'])
def paths():
    return {'bucket_url':CONFIG.BUCKET_URL}


if __name__ == '__main__':
    application.run(debug=CONFIG.FLASK_DEBUG)
