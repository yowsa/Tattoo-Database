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


<<<<<<< HEAD
item_id = item_manager.add_item()
tag_manager.add_tag("bird", item_id)
=======
# item_id = item_manager.add_item()
# tag_manager.add_tag("fineline", "00c33513-0248-433e-ba9c-91b1ba7a4f12")
# print(tag_manager.get_all_matches("bird"))
# print(item_manager.get_item("0064c184-b226-4a39-8259-343794104020"))
# print(search_manager.get_all_maching_products("sw"))
# print(tag_manager.get_item_tags("9d26bffc-0f7e-464f-874d-ce721bd1f015"))
# print(tag_manager.get_unique_tags_list())


from flask import Flask, jsonify
from flask import request
app = Flask(__name__)


@app.route('/')
def index():
    return 'Hello, World, this is the index!'


@app.route('/unique_tags', methods=['GET', 'POST'])
def unique_tags():
    if request.method == 'GET':
        return jsonify(tag_manager.get_unique_tags_list())
    else:
        return "no tags requested"


@app.route('/add_product', methods=['GET', 'POST'])
def add_product():
    if request.method == 'GET':
        #TODO: updated tags below to get data from FE
        tags = ["bird", "fineline", "hello"]
        product_manager.add_product(tags)
        return 'A product has been added'
    else:
        return "no button clicked yet to add a product"


@app.route('/search', methods=['GET', 'POST'])
def search():
    #TODO: hook up actual request argument below ones FE is a built and update to POST
    search_word = "sw" 
    if request.method == 'GET':
        return jsonify(search_manager.get_all_maching_products(search_word))
    else:
        return "no word submitted yet"

# if __name__ == '__main__':
#     app.run(debug=True)
>>>>>>> updated unique tags function to include count for each tag, set up flask apis in main as a start to deliver data to the FE
