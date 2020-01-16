import sys
sys.path.append("/Users/josefinfundin/Dev/Tattoo-Database")
import unittest
import database_connector
import database_manager


def create_test_database(database_connector):
    database_connector.execute("CREATE DATABASE test_db")


def set_test_database(database_connector):
    database_connector.set_database("test_db")

def set_database_to_none(database_connector):
    database_connector.set_database(None)


def delete_test_database(database_connector):
    database_connector.execute("DROP DATABASE test_db")


def create_items_test_table(database_connector):
    database_connector.execute(
        "CREATE TABLE items (item_id VARCHAR(45) NOT NULL PRIMARY KEY, vector_path VARCHAR(255) NOT NULL, png_path VARCHAR(255) NOT NULL);")


def create_tags_test_table(database_connector):
    database_connector.execute(
        "CREATE TABLE tags (tag_id VARCHAR(45) NOT NULL PRIMARY KEY, tag VARCHAR(255) CHARACTER SET UTF8MB4 COLLATE utf8mb4_unicode_ci NOT NULL,item_id VARCHAR(45) NOT NULL);")


class TestDatabaseManager(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.test_database_connector = database_connector.DatabaseConnector()
        self.test_item_manager = database_manager.ItemManager(self.test_database_connector)
        self.test_tag_manager = database_manager.TagManager(self.test_database_connector)

    def setUp(self):
        create_test_database(self.test_database_connector)
        set_test_database(self.test_database_connector)
        create_items_test_table(self.test_database_connector)
        create_tags_test_table(self.test_database_connector)
    
    def test_add_item(self):
        count = self.test_database_connector.execute("SELECT COUNT(*) FROM items;")
        self.assertEqual(count[0]['COUNT(*)'], 0)
        self.test_item_manager.add_item()
        count = self.test_database_connector.execute("SELECT COUNT(*) FROM items;")
        self.assertEqual(count[0]['COUNT(*)'], 1)
    
    def test_delete_item(self):
        count = self.test_database_connector.execute("SELECT COUNT(*) FROM items;")
        self.assertEqual(count[0]['COUNT(*)'], 0)
        item_id = self.test_item_manager.add_item()
        count = self.test_database_connector.execute("SELECT COUNT(*) FROM items;")
        self.assertEqual(count[0]['COUNT(*)'], 1)
        self.test_item_manager.delete_item(item_id)
        count = self.test_database_connector.execute("SELECT COUNT(*) FROM items;")
        self.assertEqual(count[0]['COUNT(*)'], 0)
    
    def test_add_tag(self):
        count = self.test_database_connector.execute("SELECT COUNT(*) FROM tags;")
        self.assertEqual(count[0]['COUNT(*)'], 0)
        item_id = self.test_item_manager.add_item()
        self.test_tag_manager.add_tag("test tag", item_id)
        count = self.test_database_connector.execute("SELECT COUNT(*) FROM tags;")
        self.assertEqual(count[0]['COUNT(*)'], 1)

    def tearDown(self):
        set_database_to_none(self.test_database_connector)
        delete_test_database(self.test_database_connector)

    @classmethod
    def tearDownClass(self):
        self.test_database_connector = None
        self.test_item_manager = None
        self.test_tag_manager = None

if __name__ == '__main__':
    unittest.main()