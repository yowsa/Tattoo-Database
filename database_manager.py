import database_helper


class ItemManager:

    def __init__(self, database_connector):
        self.database_connector = database_connector

    def add_item(self, item_id):
        self.database_connector.execute(
            "INSERT INTO items (item_id, vector_path, png_path) VALUES (%s, %s, %s)", (item_id, item_id+"_vector", item_id+"_png"))

    def delete_item(self, item_id):
        self.database_connector.execute(
            "DELETE FROM Items WHERE ItemId=%s", (item_id))

    def get_item_details(self, item_id):
        item_details = self.database_connector.execute(
            "SELECT * from items WHERE item_id=%s", (item_id))
        return item_details[0]
    
class TagManager:

    def __init__(self, database_connector):
        self.database_connector = database_connector

    def add_tag(self, tag_name, item_id):
        tag_id = database_helper.get_id()
        self.database_connector.execute(
            "INSERT INTO Tags (TagId, Tag, ItemId) VALUES (%s, %s, %s)", (tag_id, tag_name, item_id))

    def get_all_matches(self, search_word):
        all_matches = self.database_connector.execute(
            "SELECT * FROM tags WHERE tag LIKE %s;", ('%'+search_word+'%'))
        return all_matches
    
    def get_item_tags_list(self, item_id):
        item_tags = self.database_connector.execute("SELECT tag FROM tags WHERE item_id=%s", (item_id))
        tags_list = self._collate_tags_to_list(item_tags)
        return tags_list

    def _collate_tags_to_list(self, item_tags):
        tags_list = []
        for tag in item_tags:
            tags_list.append(tag['tag'])
        return tags_list
    
    def get_unique_tags_list(self):
        unique_tags = self.database_connector.execute("SELECT tag, count(*) as count FROM tags GROUP By tag;")
        return unique_tags
    
    def delete_tags_for_item(self, item_id):
        self.database_connector.execute("DELETE FROM tags WHERE item_id=%s", (item_id))


    

