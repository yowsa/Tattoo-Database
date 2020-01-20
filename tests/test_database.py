
import unittest
import database_connector
import database_manager
import search_manager
import database_helper


def create_test_database_setup(database_connector):
    # create database
    database_connector.execute("CREATE DATABASE TestDB")
    # set database
    database_connector.set_database("TestDB")
    # create items table
    database_connector.execute(
        ("CREATE TABLE Items"
         "(ItemId VARCHAR(45) NOT NULL PRIMARY KEY, "
         "VectorPath VARCHAR(255) NOT NULL, "
         "PngPath VARCHAR(255) NOT NULL);"))
    # create tags table
    database_connector.execute(
        ("CREATE TABLE Tags "
         "(TagId VARCHAR(45) NOT NULL PRIMARY KEY, "
         "Tag VARCHAR(255) CHARACTER SET UTF8MB4 COLLATE utf8mb4_unicode_ci NOT NULL, "
         "ItemId VARCHAR(45) NOT NULL);"))


def count_entries(database_connector, table_name):
    sql_query = "SELECT COUNT(*) FROM " + table_name
    count = database_connector.execute(sql_query)
    return count[0]['COUNT(*)']


def test_items_tags_setup(test_item_manager, test_tag_manager):
    item_ids = []

    item_id = database_helper.get_id()
    item_ids.append(item_id)
    test_item_manager.add_item(item_id)
    test_tag_manager.add_tag("bird", item_id)

    item_id = database_helper.get_id()
    item_ids.append(item_id)
    test_item_manager.add_item(item_id)
    test_tag_manager.add_tag("bird", item_id)

    item_id = database_helper.get_id()
    item_ids.append(item_id)
    test_item_manager.add_item(item_id)
    test_tag_manager.add_tag("bird3", item_id)

    item_id = database_helper.get_id()
    item_ids.append(item_id)
    test_item_manager.add_item(item_id)
    test_tag_manager.add_tag("h", item_id)
    test_tag_manager.add_tag("hiya", item_id)
    test_tag_manager.add_tag("hello", item_id)
    return item_ids


def is_tag_in_result(tag, result):
    for val in result:
        if val['Tag'] == tag:
            return True


def tear_down_database_setup(database_connector):
    # setting datbase to None again
    database_connector.set_database(None)
    # deleting test database
    database_connector.execute("DROP DATABASE TestDB")


class TestDatabaseManager(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.test_database_connector = database_connector.DatabaseConnector()
        self.test_item_manager = database_manager.ItemManager(
            self.test_database_connector)
        self.test_tag_manager = database_manager.TagManager(
            self.test_database_connector)
        self.test_search_manager = search_manager.SearchManager(
            self.test_tag_manager, self.test_item_manager)

    def setUp(self):
        create_test_database_setup(self.test_database_connector)

    def test_get_id(self):
        # arrange & act
        id = database_helper.get_id()

        # assert
        self.assertEqual(type(id), str)
        self.assertEqual(len(id), 36)

    def test_add_item(self):
        # arrange
        item_id = database_helper.get_id()

        # act
        self.test_item_manager.add_item(item_id)

        # assert
        self.assertEqual(count_entries(
            self.test_database_connector, 'Items'), 1)

    def test_delete_item(self):
        # arrange
        item_ids = test_items_tags_setup(
            self.test_item_manager, self.test_tag_manager)

        # act
        self.test_item_manager.delete_item(item_ids[0])

        # assert
        self.assertEqual(count_entries(
            self.test_database_connector, 'Items'), 3)

    def test_add_tag(self):
        # arrange
        item_id = database_helper.get_id()

        # act
        self.test_tag_manager.add_tag("TestTag", item_id)

        # assert
        self.assertEqual(count_entries(
            self.test_database_connector, 'Tags'), 1)

    def test_get_all_matches(self):
        # arrange
        test_items_tags_setup(
            self.test_item_manager, self.test_tag_manager)
        # act
        matches = self.test_tag_manager.get_all_matches("h")

        # assert
        self.assertEqual(len(matches), 3)
        self.assertEqual(is_tag_in_result("hello", matches), True)

    def test_get_item_details(self):
        # arrange
        item_id = database_helper.get_id()
        self.test_item_manager.add_item(item_id)

        # act
        item_details = self.test_item_manager.get_item_details(item_id)

        # assert
        self.assertEqual(len(item_details), 3)
        self.assertEqual(item_details['VectorPath'], item_id+'_vector')
        self.assertEqual(item_details['PngPath'], item_id+'_png')

    def test_get_all_maching_products(self):
        # arrange
        test_items_tags_setup(
            self.test_item_manager, self.test_tag_manager)

        # act
        all_maching_products = self.test_search_manager.get_all_maching_products(
            "bir")

        # assert
        self.assertEqual(len(all_maching_products), 3)

    def test_get_unique_tags_list(self):
        # arrange
        test_items_tags_setup(
            self.test_item_manager, self.test_tag_manager)

        # act
        unique_tags = self.test_tag_manager.get_unique_tags_list()

        # assert
        self.assertEqual(len(unique_tags), 5)


    def test_delete_tags_for_item(self):
        # arrange
        item_ids = test_items_tags_setup(
            self.test_item_manager, self.test_tag_manager)

        # act
        self.test_tag_manager.delete_tags_for_item(item_ids[3])

        # assert
        self.assertEqual(count_entries(self.test_database_connector, "Tags"), 3)

    def tearDown(self):
        tear_down_database_setup(self.test_database_connector)

    @classmethod
    def tearDownClass(self):
        self.test_database_connector = None
        self.test_item_manager = None
        self.test_tag_manager = None


if __name__ == '__main__':
    unittest.main()
