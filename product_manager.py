import database_helper

class ProductManager:
    def __init__(self, item_manager, tag_manager):
        self.item_manager = item_manager
        self.tag_manager = tag_manager
    
    def add_product(self, tags):
        item_id = database_helper.get_id()
        self.item_manager.add_item(item_id)
        for tag in tags:
            self.tag_manager.add_tag(tag, item_id)
