import helper
from image_manager import ImageManager


class ProductManager:
    def __init__(self, item_manager, tag_manager, image_manager):
        self.item_manager = item_manager
        self.tag_manager = tag_manager
        self.image_manager = image_manager

    def add_product(self, tags, vector_file, png_file):
        item_id = helper.get_id()
        vector_path = self.image_manager.add_image(vector_file, item_id, True)
        png_path = self.image_manager.add_image(png_file, item_id, False)
        self.item_manager.add_item(item_id, vector_path, png_path)
        for tag in tags:
            self.tag_manager.add_tag(tag, item_id)
        return item_id

    def delete_product(self, item_id):
        self.tag_manager.delete_tags_for_item(item_id)
        self.item_manager.delete_item(item_id)
        self.image_manager.delete_image(item_id)

    def get_all_products(self):
        all_items = self.item_manager.get_all_items()
        for item in all_items:
            item_id = item["ItemId"]
            item_tag_list = self.tag_manager.get_item_tags(item_id)
            item.update({'Tags': item_tag_list})
        return all_items

    def get_all_matching_products(self, search_word):
        all_maching_products = []
        all_tag_maches = self.tag_manager.get_all_matches(search_word)
        for match in all_tag_maches:
            item_id = match["ItemId"]
            item_tag_list = self.tag_manager.get_item_tags(item_id)
            item_details = self.item_manager.get_item_details(item_id)
            item_details.update({'Tags': item_tag_list})
            all_maching_products.append(item_details)
        return all_maching_products
