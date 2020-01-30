from flask import request
from flask import Flask, jsonify

from database_connector import DatabaseConnector
from database_manager import ItemManager, TagManager
from product_manager import ProductManager
from image_manager import ImageManager
from image_manager import AwsConnector
from config import Database, Aws

database_connector = DatabaseConnector(Database.DB, Database.HOST, Database.USER, Database.PASSWORD)
connection = database_connector.get_connection()
item_manager = ItemManager(database_connector)
tag_manager = TagManager(database_connector)
s3_resource = AwsConnector().get_s3_resource()
image_manager = ImageManager(s3_resource, Aws.BUCKET)
product_manager = ProductManager(item_manager, tag_manager, image_manager)

app = Flask(__name__)


@app.route('/')
def index():
    return 'Hello, World, this is the index!'


@app.route('/tags', methods=['GET'])
def tags():
    if request.method == 'GET':
        return jsonify(tag_manager.get_unique_tags_list())


@app.route('/search', methods=['GET'])
def search():
    search_word = request.args.get("word")
    return jsonify(product_manager.get_all_matching_products(search_word))


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
