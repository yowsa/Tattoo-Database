
import unittest
import database_connector
import database_manager


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

    def setUp(self):
        create_test_database_setup(self.test_database_connector)

    def test_add_item(self):
        count = self.test_database_connector.execute(
            "SELECT COUNT(*) FROM Items;")
        self.assertEqual(count['COUNT(*)'], 0)
        self.test_item_manager.add_item()
        count = self.test_database_connector.execute(
            "SELECT COUNT(*) FROM Items;")
        self.assertEqual(count['COUNT(*)'], 1)

    def test_delete_item(self):
        count = self.test_database_connector.execute(
            "SELECT COUNT(*) FROM Items;")
        self.assertEqual(count['COUNT(*)'], 0)
        item_id = self.test_item_manager.add_item()
        count = self.test_database_connector.execute(
            "SELECT COUNT(*) FROM Items;")
        self.assertEqual(count['COUNT(*)'], 1)
        self.test_item_manager.delete_item(item_id)
        count = self.test_database_connector.execute(
            "SELECT COUNT(*) FROM Items;")
        self.assertEqual(count['COUNT(*)'], 0)

    def test_add_tag(self):
        count = self.test_database_connector.execute(
            "SELECT COUNT(*) FROM Tags;")
        self.assertEqual(count['COUNT(*)'], 0)
        item_id = self.test_item_manager.add_item()
        self.test_tag_manager.add_tag("test tag", item_id)
        count = self.test_database_connector.execute(
            "SELECT COUNT(*) FROM Tags;")
        self.assertEqual(count['COUNT(*)'], 1)

    def test_get_all_matches(self):
        item_id = self.test_item_manager.add_item()
        self.test_tag_manager.add_tag("bird", item_id)
        self.test_tag_manager.add_tag("bird2", item_id)
        self.test_tag_manager.add_tag("bird3", item_id)
        self.test_tag_manager.add_tag("swan", item_id)
        self.test_tag_manager.add_tag("sw", item_id)
        matches_len = len(self.test_tag_manager.get_all_matches("bird"))
        self.assertEqual(matches_len, 3)
        matches = self.test_tag_manager.get_all_matches("sw")
        self.assertEqual(len(matches), 2)
        sw = False
        swan = False
        for match in matches:
            if "sw" in match.values():
                sw = True
            if "swan" in match.values():
                swan = True
        self.assertEqual(sw, True)
        self.assertEqual(swan, True)

    def test_get_item(self):
        item_id = self.test_item_manager.add_item()
        get_item = self.test_item_manager.get_item(item_id)
        self.assertEqual(len(get_item), 1)
        self.assertEqual(get_item[0]['vector_path'],item_id+'_vector')
        self.assertEqual(get_item[0]['png_path'],item_id+'_png')

    def tearDown(self):
        tear_down_database_setup(self.test_database_connector)

    @classmethod
    def tearDownClass(self):
        self.test_database_connector = None
        self.test_item_manager = None
        self.test_tag_manager = None


if __name__ == '__main__':
    unittest.main()
