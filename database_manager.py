import database_helper


class ItemManager:

    def __init__(self, database_connector):
        self.database_connector = database_connector

    def add_item(self, item_id):
        self.database_connector.execute(
            "INSERT INTO items (ItemId, VectorPath, PngPath) VALUES (%s, %s, %s)", (item_id, item_id+"_vector", item_id+"_png"))

    def delete_item(self, item_id):
        self.database_connector.execute(
            "DELETE FROM Items WHERE ItemId=%s", (item_id))

    def get_item_details(self, item_id):
        item_details = self.database_connector.execute(
            "SELECT * from Items WHERE ItemId=%s", (item_id))
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
            "SELECT * FROM Tags WHERE Tag LIKE %s;", ('%'+search_word+'%'))
        return all_matches
    
    def get_item_tags_list(self, item_id):
        item_tags = self.database_connector.execute("SELECT Tag FROM Tags WHERE ItemId=%s", (item_id))
        tags_list = self._collate_tags_to_list(item_tags)
        return tags_list

    def _collate_tags_to_list(self, item_tags):
        tags_list = []
        for tag in item_tags:
            tags_list.append(tag['Tag'])
        return tags_list
    
    def get_unique_tags_list(self):
        unique_tags = self.database_connector.execute("SELECT Tag, count(*) as count FROM Tags GROUP By Tag;")
        return unique_tags
    
    def delete_tags_for_item(self, item_id):
        self.database_connector.execute("DELETE FROM Tags WHERE ItemId=%s", (item_id))


    

