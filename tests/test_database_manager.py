
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

    def setUp(self):
        setup_test.create_test_database_setup(self.database_connector)

    def tearDown(self):
        setup_test.tear_down_database_setup(self.database_connector)

    def test_add_item(self):
        # arrange
        item_id = helper.get_id()

        # act
        self.item_manager.add_item(item_id, item_id, item_id, setup_test.IMG_BRIGHTNESS)

        # assert
        self.assertEqual(setup_test.count_rows(
            self.database_connector, 'Items'), 1)

    def test_delete_item(self):
        # arrange
        item_ids = setup_test.test_items_tags_setup(
            self.item_manager, self.tag_manager)

        # act
        self.item_manager.delete_item(item_ids[0])

        # assert
        self.assertEqual(setup_test.count_rows(
            self.database_connector, 'Items'), 3)

    def test_get_item_details(self):
        # arrange
        item_id = helper.get_id()
        self.item_manager.add_item(item_id, item_id, item_id, setup_test.IMG_BRIGHTNESS)

        # act
        item_details = self.item_manager.get_item_details(item_id)

        # assert
        self.assertEqual(len(item_details), 4)
        self.assertIn(item_id, item_details['VectorPath'])
        self.assertIn(item_id, item_details['PngPath'])
        self.assertEqual(setup_test.IMG_BRIGHTNESS, item_details['ImageBrightness'])

    def test_get_all_items(self):
        # arrange
        setup_test.test_items_tags_setup(
            self.item_manager, self.tag_manager)

        # act
        all_items = self.item_manager.get_all_items()

        # assert
        self.assertEqual(len(all_items), 4)
    
    def test_get_random_items(self):
        # arrange
        setup_test.test_items_tags_setup(
            self.item_manager, self.tag_manager)

        # act
        random_items = self.item_manager.get_random_items(2)

        # assert
        self.assertEqual(len(random_items), 2)

    def test_add_tags(self):
        # arrange
        tags = ('hello', 'hello', 'josie')

        # act
        self.tag_manager.add_tags(tags, setup_test.ITEM_ID_1)

        # assert
        self.assertEqual(setup_test.count_rows(
            self.database_connector, 'Tags'), 2)

    def test_get_unique_matches(self):
        # arrange
        setup_test.test_items_tags_setup(
            self.item_manager, self.tag_manager)

        # act
        matches = self.tag_manager.get_unique_matches("h")
        find_unique_id = self.tag_manager.get_unique_matches(setup_test.ITEM_ID_1)

        # assert
        self.assertEqual(len(matches), 2)
        self.assertEqual(len(find_unique_id), 1)
        self.assertEqual(find_unique_id[0]['ItemId'], setup_test.ITEM_ID_1)
        
    def test_get_item_tags(self):
        # arrange
        item_ids = setup_test.test_items_tags_setup(
            self.item_manager, self.tag_manager)

        # act
        item_tags = self.tag_manager.get_item_tags(item_ids[3])

        # assert
        self.assertIn("h", item_tags)
        self.assertIn("hiya", item_tags)
        self.assertIn("hello", item_tags)

    def test__collate_tags(self):
        # arrange
        item_tags = [{'Tag': 'h'}, {'Tag': 'hiya'}, {'Tag': 'hello'}]

        # act
        tags = self.tag_manager._collate_tags(item_tags)

        # assert
        self.assertTupleEqual(tags, ('h', 'hiya', 'hello'))

    def test_get_unique_tags_list(self):
        # arrange
        setup_test.test_items_tags_setup(
            self.item_manager, self.tag_manager)

        # act
        unique_tags = self.tag_manager.get_unique_tags_list()

        # assert
        self.assertEqual(len(unique_tags), 5)

    def test_delete_all_tags_for_item(self):
        # arrange
        setup_test.test_items_tags_setup(
            self.item_manager, self.tag_manager)

        # act
        self.tag_manager.delete_all_tags_for_item(setup_test.ITEM_ID_4)

        # assert
        self.assertEqual(setup_test.count_rows(
            self.database_connector, 'Tags'), 4)

    def test_delete_tags_for_item(self):
        # arrange
        setup_test.test_items_tags_setup(
            self.item_manager, self.tag_manager)

        # act
        self.tag_manager.delete_tags_for_item(
            ('h', 'hiya'), setup_test.ITEM_ID_4)

        # assert
        self.assertEqual(setup_test.count_rows(
            self.database_connector, 'Tags'), 5)


if __name__ == '__main__':
    unittest.main()
