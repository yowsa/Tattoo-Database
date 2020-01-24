from flask import request
from flask import Flask, jsonify

from database_connector import DatabaseConnector
from database_manager import ItemManager, TagManager
from search_manager import SearchManager
from product_manager import ProductManager

database_connector = DatabaseConnector('db')
connection = database_connector.get_connection()
item_manager = ItemManager(database_connector)
tag_manager = TagManager(database_connector)
search_manager = SearchManager(tag_manager, item_manager)
product_manager = ProductManager(item_manager, tag_manager)

app = Flask(__name__)


@app.route('/')
def index():
    return 'Hello, World, this is the index!'


@app.route('/unique_tags', methods=['GET', 'POST'])
def unique_tags():
    if request.method == 'GET':
        return jsonify(tag_manager.get_unique_tags_list())


@app.route('/add_product', methods=['GET', 'POST'])
def add_product():
    if request.method == 'POST':
        # TODO: updated tags below to get data from FE
        tags = ["bird", "hello"]
        product_manager.add_product(tags)
        return 'A product has been added'


@app.route('/delete_product', methods=['GET', 'POST'])
def delete_product():
    if request.method == '`POST`':
        # TODO: update POST and to recieve item_id from FE
        item_id = "6baa81a4-5a9d-4130-bc5f-1e842d1ecb53"
        product_manager.delete_product(item_id)
        return "A product has been deleted"


@app.route('/search', methods=['GET', 'POST'])
def search():
    # TODO: hook up actual request argument below ones FE is a built and update to POST
    search_word = "sw"
    if request.method == 'POST':
        return jsonify(search_manager.get_all_matching_products(search_word))


if __name__ == '__main__':
    app.run(debug=True)
