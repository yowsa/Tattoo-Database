import database_helper
from image_manager import ImageManager


class ProductManager:
    def __init__(self, item_manager, tag_manager):
        self.item_manager = item_manager
        self.tag_manager = tag_manager

    def add_product(self, tags):
        item_id = database_helper.get_id()
        self.item_manager.add_item(item_id)
        for tag in tags:
            self.tag_manager.add_tag(tag, item_id)

    def delete_product(self, item_id):
        self.tag_manager.delete_tags_for_item(item_id)
        self.item_manager.delete_item(item_id)
    
    def get_all_products(self):
        all_items = self.item_manager.get_all_items()
        for item in all_items:
            item_id = item["ItemId"]
            item_tag_list = self.tag_manager.get_item_tags(item_id)
            item.update({'Tags' : item_tag_list})
        return all_items
    
    def get_all_matching_products(self, search_word):
        all_maching_products = []
        all_tag_maches = self.tag_manager.get_all_matches(search_word)
        for match in all_tag_maches:
            item_id = match["ItemId"]
            item_tag_list = self.tag_manager.get_item_tags(item_id)
            item_details = self.item_manager.get_item_details(item_id)
            item_details.update({'Tags' : item_tag_list})
            all_maching_products.append(item_details)
        return all_maching_products

