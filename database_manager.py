import database_helper

class ItemManager:

    def __init__(self, database_connector):
        self.database_connector = database_connector
    
    def add_item(self):
        item_id = database_helper.get_uuid()
        self.database_connector.execute("INSERT INTO Items (ItemId, VectorPath, PngPath) VALUES (%s, %s, %s)", (item_id, item_id+"_vector", item_id+"_png"))
        return item_id

    def delete_item(self, item_id):
        self.database_connector.execute("DELETE FROM Items WHERE ItemId=%s", (item_id))
    

class TagManager:

    def __init__(self, database_connector):
        self.database_connector = database_connector
    
    def add_tag(self, tag_name, item_id):
        tag_id = database_helper.get_uuid()
        self.database_connector.execute("INSERT INTO Tags (TagId, Tag, ItemId) VALUES (%s, %s, %s)", (tag_id, tag_name, item_id))
    
    def get_all_matches(self, search_word):
        all_matches = self.database_connector.execute("SELECT * FROM tags WHERE tag LIKE %s;", ('%'+search_word+'%'))
        return all_matches


    

