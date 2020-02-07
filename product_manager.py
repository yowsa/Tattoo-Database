import helper
from image_manager import ImageManager
from config import AwsConf
from product import Product
from response import Response


class ProductManager:
    def __init__(self, item_manager, tag_manager, image_manager):
        self.item_manager = item_manager
        self.tag_manager = tag_manager
        self.image_manager = image_manager

    def add_product(self, tags: tuple, vector_file, png_file=False):
        try:
            png_file = png_file or vector_file
            item_id = self.get_unique_id()
            vector_path = self.image_manager.upload_vector_file(
                vector_file, item_id, AwsConf.VECTOR_FOLDER)
            png_path = self.image_manager.upload_png_file(
                png_file, item_id, AwsConf.PNG_FOLDER)
            self.item_manager.add_item(item_id, vector_path, png_path)
            self.tag_manager.add_tags(tags, item_id)
            return Response.OK.message("Product added", item_id)
        except:
            return Response.UNKNOWN_ERROR.message("Something went wrong")

    def delete_product(self, item_id):
        try:
            product = self.get_product_object(item_id)
            self.tag_manager.delete_all_tags_for_item(item_id)
            self.item_manager.delete_item(item_id)
            self.image_manager.delete_file(product.vector_path)
            self.image_manager.delete_file(product.png_path)
            return Response.OK.message("Product deleted")
        except:
            return Response.UNKNOWN_ERROR.message("Something went wrong")

    def get_all_products(self):
        try: 
            all_items = self.item_manager.get_all_items()
            for item in all_items:
                item_id = item["ItemId"]
                item_tag_list = self.tag_manager.get_item_tags(item_id)
                item["Tags"] = item_tag_list
            return Response.OK.message("All products", all_items)
        except:
            return Response.UNKNOWN_ERROR.message("Something went wrong")

    def get_all_matching_products(self, search_word):
        try: 
            all_maching_products = []
            all_tag_maches = self.tag_manager.get_all_matches(search_word)
            for match in all_tag_maches:
                item_id = match["ItemId"]
                item_tag_list = self.tag_manager.get_item_tags(item_id)
                item_details = self.item_manager.get_item_details(item_id)
                item_details.update({'Tags': item_tag_list})
                all_maching_products.append(item_details)
            return Response.OK.message("All matching products", all_maching_products)
        except:
            return Response.UNKNOWN_ERROR.message("Something went wrong")     

    def get_product_object(self, item_id: str):
        item_details = self.item_manager.get_item_details(item_id)
        tags = self.tag_manager.get_item_tags(item_id)
        vector_path = item_details['VectorPath']
        png_path = item_details['PngPath']
        return Product(item_id, vector_path, png_path, tags)

    def get_unique_id(self):
        item_id = helper.get_id()
        while self.item_manager.id_exists(item_id):
            item_id = helper.get_id()
        return item_id

    def update_product_tags(self, item_id: str, tags: tuple):
        try:
            existing_tags = self.tag_manager.get_item_tags(item_id)
            to_add = set(tags) - set(existing_tags)
            to_delete = set(existing_tags) - set(tags)
            self.tag_manager.add_tags(tuple(to_add), item_id)
            self.tag_manager.delete_tags_for_item(tuple(to_delete), item_id)
            updated_tags = self.tag_manager.get_item_tags(item_id)
            return Response.OK.message("Tags updated", updated_tags)

        except:
            return Response.UNKNOWN_ERROR.message("Something went wrong")   
