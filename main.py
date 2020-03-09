from flask import Flask, jsonify, request, render_template
from flask_assets import Bundle, Environment

from database_connector import DatabaseConnector
from database_manager import ItemManager, TagManager
from product_manager import ProductManager
from image_manager import ImageManager
from image_manager import AwsConnector
from config import DatabaseConf, AwsConf, ImageConf
from response import Response

database_connector = DatabaseConnector(
    DatabaseConf.DB, DatabaseConf.HOST, DatabaseConf.USER, DatabaseConf.PASSWORD)
database_connector.create_database(DatabaseConf.DB)
database_connector.create_tables()
connection = database_connector.get_connection()
item_manager = ItemManager(database_connector)
tag_manager = TagManager(database_connector)
s3_resource = AwsConnector().get_s3_resource()
image_manager = ImageManager(s3_resource, AwsConf.BUCKET)
product_manager = ProductManager(item_manager, tag_manager, image_manager)

app = Flask(__name__)

js = Bundle('js/helper.js', 'js/add-products.js', 'js/vendor/pagination.js', 'js/search.js', 'js/ajax.js', 'js/setup.js', output='gen/main.js')
css = Bundle('css/test.css', 'css/vendor/pagination.css', output='gen/style.css')

assets = Environment(app)

assets.register('main_js', js)
assets.register('main_css', css)


@app.route('/')
def index():
    return render_template('add-product.html')


@app.route('/search')
def search():
    return render_template('search.html')


@app.route('/api/tags', methods=['GET'])
def unique_tags():
    try:
        unique_tags = tag_manager.get_unique_tags_list()
        return jsonify(Response.OK.message("All unique tags", unique_tags))
    except:
        return jsonify(Response.UNKNOWN_ERROR.message("Something went wrong"))


@app.route('/api/add-products', methods=['POST'])
def add_product():
    info = request.form
    tags = tuple(info['tags'].split(","))
    vector_file = request.files['vector_file']
    vector_file_ext = image_manager.get_file_ext(vector_file.filename)
    png_file = request.files['png_file'] if 'png_file' in request.files else vector_file
    png_file_ext = image_manager.get_file_ext(png_file.filename)
    if image_manager.is_supported_format(vector_file.filename, ImageConf.VECTOR_FORMATS):
        response = product_manager.add_product(
            tags, vector_file.read(), vector_file_ext, png_file.read(), png_file_ext)
    return response


@app.route('/api/search', methods=['GET'])
def search_all():
    search_result = product_manager.get_all_products()
    return search_result

@app.route('/api/search/<word>', methods=['POST'])
def search_word(word):
    print(word)
    search_result = product_manager.get_all_matching_products(word)
    return search_result


@app.route('/products', methods=['GET', 'POST'])
def products():
    if request.method == "GET":
        return jsonify(product_manager.get_all_products())
    elif request.method == 'POST':
        tags = request.form['tags']
        vector = request.files['vector']
        small_img = request.files['small_img']
        product_manager.add_product(tags, vector, small_img)


@app.route('/product/<string:item_id>', methods=['GET', 'PUT', 'DELETE'])
def product(item_id):
    if request.method == "GET":
        # TODO: Get item with matching id
        return None
    elif request.method == 'PUT':
        # TODO: update/edit product
        return None
    elif request.method == 'DELETE':
        product_manager.delete_product(item_id)
        return "A product has been deleted"


if __name__ == '__main__':
    app.run(debug=True)
