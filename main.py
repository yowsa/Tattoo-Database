from database_connector import DatabaseConnector
from database_manager import ItemManager, TagManager

database_connector = DatabaseConnector('db')
connection = database_connector.get_connection()
item_manager = ItemManager(database_connector)
tag_manager = TagManager(database_connector)

item_id = item_manager.add_item()
tag_manager.add_tag("bird", item_id)
