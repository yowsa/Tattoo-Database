class SearchManager:
    def __init__(self, tag_manager, item_manager):
        self.tag_manager = tag_manager
        self.item_manager = item_manager
    
    def get_all_maching_products(self, search_word):
        all_maching_products = []
        all_tag_maches = self.tag_manager.get_all_matches(search_word)
        for match in all_tag_maches:
            item_id = match["ItemId"]
            item_tag_list = self.tag_manager.get_item_tags_list(item_id)
            item_details = self.item_manager.get_item_details(item_id)
            item_details.update({'Tags' : item_tag_list})
            all_maching_products.append(item_details)
        return all_maching_products



