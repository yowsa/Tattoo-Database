from database_connector import DatabaseConnector
from database_manager import ItemManager, TagManager

database_connector = DatabaseConnector('db')
connection = database_connector.get_connection()
item_manager = ItemManager(database_connector)
tag_manager = TagManager(database_connector)

item_id = item_manager.add_item()
tag_manager.add_tag("bird", item_id)

# try:
#     with database_connector.get_cursor(connection) as cursor:
#         # Create a new record
#         sql = "INSERT INTO `users` (`email`, `password`) VALUES (%s, %s)"
#         cursor.execute(sql, ('webmaster@python.org', 'very-secret'))

#     # connection is not autocommit by default. So you must commit to save
#     # your changes.
#     database_connector.commit_changes(connection)

#     with database_connector.get_cursor(connection) as cursor:
#         # Read a single record
#         sql = "SELECT `id`, `password` FROM `users` WHERE `email`=%s"
#         cursor.execute(sql, ('webmaster@python.org',))
#         result = cursor.fetchone()
#         print(result)
# finally:
#     database_connector.close_connection(connection)
