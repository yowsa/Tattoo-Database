import database_helper

class ItemManager:

    def __init__(self, database_connector):
        self.database_connector = database_connector
    
    def add_item(self, item_id):
        self.database_connector.execute("INSERT INTO items (item_id, vector_path, png_path) VALUES (%s, %s, %s)", (item_id, item_id+"_vector", item_id+"_png"))

    def delete_item(self, item_id):
        self.database_connector.execute("DELETE FROM items WHERE item_id=%s", (item_id))
    
    def get_item_details(self, item_id):
        item_details = self.database_connector.execute("SELECT * from items WHERE item_id=%s", (item_id))
        return item_details[0]
    

    
    # def edit_item(self):
    #     self.database_connector.execute()

class TagManager:

    def __init__(self, database_connector):
        self.database_connector = database_connector
    
    def add_tag(self, tag_name, item_id):
        tag_id = database_helper.get_id()
        self.database_connector.execute("INSERT INTO tags (tag_id, tag, item_id) VALUES (%s, %s, %s)", (tag_id, tag_name, item_id))
    
    def get_all_matches(self, search_word):
        all_matches = self.database_connector.execute("SELECT * FROM tags WHERE tag LIKE %s;", ('%'+search_word+'%'))
        return all_matches
    
    def get_tags_list(self, item_id):
        item_tags = self.database_connector.execute("SELECT tag FROM tags WHERE item_id=%s", (item_id))
        tags_list = self._collate_tags_to_list(item_tags)
        return tags_list
    
    def _collate_tags_to_list(self, item_tags):
        tags_list = []
        for tag in item_tags:
            tags_list.append(tag['tag'])
        return tags_list



    # def delete_tag_all_instances(self, tag_name):
    #     self.database_connector.execute("DELETE FROM items WHERE tag=%s", (tag_name))
    
    # def edit_tag(self):
    #     self.database_connector.execute()


    

