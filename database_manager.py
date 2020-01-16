import database_helper

class ItemManager:

    def __init__(self, database_connector):
        self.database_connector = database_connector
    
    def add_item(self):
        item_id = database_helper.get_uuid()
        self.database_connector.execute("INSERT INTO items (item_id, vector_path, png_path) VALUES (%s, %s, %s)", (item_id, item_id+"_vector", item_id+"_png"))
        return item_id

    def delete_item(self, item_id):
        self.database_connector.execute("DELETE FROM items WHERE item_id=%s", (item_id))
    
    def get_item(self, item_id):
        item = self.database_connector.execute("SELECT vector_path, png_path from items WHERE item_id=%s", (item_id))
        return item
    

    
    # def edit_item(self):
    #     self.database_connector.execute()

class TagManager:

    def __init__(self, database_connector):
        self.database_connector = database_connector
    
    def add_tag(self, tag_name, item_id):
        tag_id = database_helper.get_uuid()
        self.database_connector.execute("INSERT INTO tags (tag_id, tag, item_id) VALUES (%s, %s, %s)", (tag_id, tag_name, item_id))
    
    def get_all_matches(self, search_word):
        all_matches = self.database_connector.execute("SELECT * FROM tags WHERE tag LIKE %s;", ('%'+search_word+'%'))
        return all_matches

    # def delete_tag_all_instances(self, tag_name):
    #     self.database_connector.execute("DELETE FROM items WHERE tag=%s", (tag_name))
    
    # def edit_tag(self):
    #     self.database_connector.execute()


    

