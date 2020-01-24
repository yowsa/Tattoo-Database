
import unittest
import database_connector
import database_manager
import product_manager
import database_helper
import image_manager


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


def assertCount(database_connector, table_name, count):
    sql_query = "SELECT COUNT(*) FROM " + table_name
    result = database_connector.execute(sql_query)
    if result[0]['COUNT(*)'] == count:
        return True
    return False


def test_items_tags_setup(item_manager, tag_manager):
    """ 
    Note: Adds 4 items to use during testing
    item 1-3: with tag 1 tag
    item 4: with 3 tags

    Return: list of ids of the added items
    """
    item_ids = []

    item_id = database_helper.get_id()
    item_ids.append(item_id)
    item_manager.add_item(item_id, item_id, item_id)
    tag_manager.add_tag("bird", item_id)

    item_id = database_helper.get_id()
    item_ids.append(item_id)
    item_manager.add_item(item_id, item_id, item_id)
    tag_manager.add_tag("bird", item_id)

    item_id = database_helper.get_id()
    item_ids.append(item_id)
    item_manager.add_item(item_id, item_id, item_id)
    tag_manager.add_tag("bird3", item_id)

    item_id = database_helper.get_id()
    item_ids.append(item_id)
    item_manager.add_item(item_id, item_id, item_id)
    tag_manager.add_tag("h", item_id)
    tag_manager.add_tag("hiya", item_id)
    tag_manager.add_tag("hello", item_id)
    return item_ids


def assertTagExists(tag, result):
    for val in result:
        if val['Tag'] == tag:
            return True
    return False


def tear_down_database_setup(database_connector):
    # setting datbase to None again
    database_connector.set_database(None)
    # deleting test database
    database_connector.execute("DROP DATABASE TestDB")


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
        create_test_database_setup(self.database_connector)

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
        self.item_manager.add_item(item_id, item_id, item_id)

        # assert
        self.assertTrue(assertCount(self.database_connector, 'Items', 1))

    def test_delete_item(self):
        # arrange
        item_ids = test_items_tags_setup(
            self.item_manager, self.tag_manager)

        # act
        self.item_manager.delete_item(item_ids[0])

        # assert
        self.assertTrue(assertCount(self.database_connector, 'Items', 3))

    def test_add_tag(self):
        # arrange
        item_id = database_helper.get_id()

        # act
        self.tag_manager.add_tag("TestTag", item_id)

        # assert
        self.assertTrue(assertCount(self.database_connector, 'Tags', 1))

    def test_get_all_matches(self):
        # arrange
        test_items_tags_setup(
            self.item_manager, self.tag_manager)

        # act
        matches = self.tag_manager.get_all_matches("h")

        # assert
        self.assertEqual(len(matches), 3)
        self.assertTrue(assertTagExists("hello", matches))

    def test_get_item_details(self):
        # arrange
        item_id = database_helper.get_id()
        self.item_manager.add_item(item_id, item_id, item_id)

        # act
        item_details = self.item_manager.get_item_details(item_id)

        # assert
        self.assertEqual(len(item_details), 3)
        self.assertIn(item_id, item_details['VectorPath'])
        self.assertIn(item_id, item_details['PngPath'])

    def test_get_all_matching_products(self):
        # arrange
        test_items_tags_setup(
            self.item_manager, self.tag_manager)

        # act
        all_matching_products = self.product_manager.get_all_matching_products(
            "bir")

        # assert
        self.assertEqual(len(all_matching_products), 3)

    def test_get_unique_tags_list(self):
        # arrange
        test_items_tags_setup(
            self.item_manager, self.tag_manager)

        # act
        unique_tags = self.tag_manager.get_unique_tags_list()

        # assert
        self.assertEqual(len(unique_tags), 5)

    def test_delete_tags_for_item(self):
        # arrange
        item_ids = test_items_tags_setup(
            self.item_manager, self.tag_manager)

        # act
        self.tag_manager.delete_tags_for_item(item_ids[3])

        # assert
        assertCount(self.database_connector, "Tags", 3)

    def tearDown(self):
        tear_down_database_setup(self.database_connector)

    @classmethod
    def tearDownClass(self):
        self.database_connector = None
        self.item_manager = None
        self.tag_manager = None


if __name__ == '__main__':
    unittest.main()
