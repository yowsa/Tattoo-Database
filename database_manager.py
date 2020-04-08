import helper


class ItemManager:

    def __init__(self, database_connector):
        self.database_connector = database_connector

    def add_item(self, item_id, vector_path, png_path, image_brightness):
        self.database_connector.execute(
            "INSERT INTO Items (ItemId, VectorPath, PngPath, ImageBrightness) VALUES (%s, %s, %s, %s)",
            (item_id, vector_path, png_path, image_brightness))

    def delete_item(self, item_id):
        self.database_connector.execute(
            "DELETE FROM Items WHERE ItemId=%s", item_id)

    def get_item_details(self, item_id):
        item_details = self.database_connector.execute(
            "SELECT * from Items WHERE ItemId=%s", item_id)
        assert len(item_details) == 1
        return item_details[0]

    def get_all_items(self):
        all_items = self.database_connector.execute("SELECT * from Items")
        return all_items

    def id_exists(self, item_id):
        result = self.database_connector.execute(
            "SELECT * from Items WHERE ItemId=%s", item_id)
        return bool(result)
    
    def get_random_items(self, num):
        random_items = self.database_connector.execute("SELECT * from Items ORDER BY RAND() LIMIT %s", num)
        return random_items
    

class TagManager:

    def __init__(self, database_connector):
        self.database_connector = database_connector

    def add_tags(self, tags: tuple, item_id: str):
        unique_tags = set(tags)
        for tag_name in unique_tags:
            tag_id = helper.get_id()
            self.database_connector.execute(
                "INSERT INTO Tags (TagId, Tag, ItemId) VALUES (%s, %s, %s)",
                (tag_id, tag_name.lower(), item_id))

    def get_unique_matches(self, search_word: str):
        all_matches = self.database_connector.execute(
            "SELECT DISTINCT ItemId FROM Tags WHERE Tag LIKE %s OR ItemID LIKE %s ;", (('%'+search_word.lower()+'%'), ('%'+search_word.lower()+'%')))
        return all_matches

    def get_item_tags(self, item_id):
        item_tags = self.database_connector.execute(
            "SELECT Tag FROM Tags WHERE ItemId=%s", item_id)
        tags_list = self._collate_tags(item_tags)
        return tags_list

    def _collate_tags(self, item_tags):
        return tuple(tag['Tag'] for tag in item_tags)

    def get_unique_tags_list(self):
        """Return: tuple with tag name and their count of occurances."""
        unique_tags = self.database_connector.execute(
            "SELECT Tag, count(*) as count FROM Tags GROUP By Tag;")
        return tuple((tag['Tag'], tag['count']) for tag in unique_tags)

    def delete_all_tags_for_item(self, item_id):
        self.database_connector.execute(
            "DELETE FROM Tags WHERE ItemId=%s", item_id)

    def delete_tags_for_item(self, tags: tuple, item_id: str):
        for tag in tags:
            self.database_connector.execute(
                "DELETE FROM Tags WHERE Tag=%s AND ItemId=%s", (tag, item_id))
