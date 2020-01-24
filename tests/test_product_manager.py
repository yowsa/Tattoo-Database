
from . import setup_test
import unittest
import database_connector
import database_manager
import product_manager
import helper
import image_manager


class TestDatabaseManager(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.database_connector = database_connector.DatabaseConnector()
        self.item_manager = database_manager.ItemManager(
            self.database_connector)
        self.tag_manager = database_manager.TagManager(
            self.database_connector)
        self.image_manager = image_manager.ImageManager()
        self.product_manager = product_manager.ProductManager(
            self.item_manager, self.tag_manager, self.image_manager)

    def setUp(self):
        setup_test.create_test_database_setup(self.database_connector)

    def test_get_all_matching_products(self):
        # arrange
        setup_test.test_items_tags_setup(
            self.item_manager, self.tag_manager)

        # act
        all_matching_products = self.product_manager.get_all_matching_products(
            "bir")

        # assert
        self.assertEqual(len(all_matching_products), 3)

    def tearDown(self):
        setup_test.tear_down_database_setup(self.database_connector)

    @classmethod
    def tearDownClass(self):
        self.database_connector = None
        self.item_manager = None
        self.tag_manager = None
        self.image_manager = None
        self.product_manager = None


if __name__ == '__main__':
    unittest.main()
