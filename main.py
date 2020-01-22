from flask import request
from flask import Flask, jsonify

from database_connector import DatabaseConnector
from database_manager import ItemManager, TagManager
from product_manager import ProductManager

database_connector = DatabaseConnector('db')
connection = database_connector.get_connection()
item_manager = ItemManager(database_connector)
tag_manager = TagManager(database_connector)
product_manager = ProductManager(item_manager, tag_manager)

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
    search_word = "sw"  # TODO: hook up to actual input
    if request.method == "GET":
        return jsonify(product_manager.get_all_matching_products(search_word))


@app.route('/products', methods=['GET', 'POST'])
def products():
    if request.method == "GET":
        # TODO: Get all items with assosiated tags, just like with search words but all items
        return None
    elif request.method == 'POST':
        # TODO: updated tags below to get data from FE
        tags = ["bird", "hello"]
        product_manager.add_product(tags)


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
