import sys
sys.path.append("/Users/josefinfundin/Dev/Tattoo-Database")
import unittest
import database_connector
import database_manager
import search_manager
import database_helper


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
        self.test_search_manager = search_manager.SearchManager(self.test_tag_manager, self.test_item_manager)

    def setUp(self):
        create_test_database(self.test_database_connector)
        set_test_database(self.test_database_connector)
        create_items_test_table(self.test_database_connector)
        create_tags_test_table(self.test_database_connector)
    
    def test_add_item(self):
        count = self.test_database_connector.execute("SELECT COUNT(*) FROM items;")
        self.assertEqual(count[0]['COUNT(*)'], 0)
        item_id = database_helper.get_id()
        self.test_item_manager.add_item(item_id)
        count = self.test_database_connector.execute("SELECT COUNT(*) FROM items;")
        self.assertEqual(count[0]['COUNT(*)'], 1)
    
    def test_delete_item(self):
        count = self.test_database_connector.execute("SELECT COUNT(*) FROM items;")
        self.assertEqual(count[0]['COUNT(*)'], 0)
        item_id = database_helper.get_id()
        self.test_item_manager.add_item(item_id)
        count = self.test_database_connector.execute("SELECT COUNT(*) FROM items;")
        self.assertEqual(count[0]['COUNT(*)'], 1)
        self.test_item_manager.delete_item(item_id)
        count = self.test_database_connector.execute("SELECT COUNT(*) FROM items;")
        self.assertEqual(count[0]['COUNT(*)'], 0)
    
    def test_add_tag(self):
        count = self.test_database_connector.execute("SELECT COUNT(*) FROM tags;")
        self.assertEqual(count[0]['COUNT(*)'], 0)
        item_id = database_helper.get_id()
        self.test_item_manager.add_item(item_id)
        self.test_tag_manager.add_tag("test tag", item_id)
        count = self.test_database_connector.execute("SELECT COUNT(*) FROM tags;")
        self.assertEqual(count[0]['COUNT(*)'], 1)

    def test_get_all_matches(self):
        item_id = database_helper.get_id()
        self.test_item_manager.add_item(item_id)
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

    def test_get_item_details(self):
        item_id = database_helper.get_id()
        self.test_item_manager.add_item(item_id)
        item_details = self.test_item_manager.get_item_details(item_id)
        self.assertEqual(len(item_details), 3)
        self.assertEqual(item_details['vector_path'],item_id+'_vector')
        self.assertEqual(item_details['png_path'],item_id+'_png')

    def test_get_all_maching_products(self):
        item_id = database_helper.get_id()
        self.test_item_manager.add_item(item_id)
        self.test_tag_manager.add_tag("bird", item_id)
        item_id = database_helper.get_id()
        self.test_item_manager.add_item(item_id)
        self.test_tag_manager.add_tag("bird2", item_id)
        item_id = database_helper.get_id()
        self.test_item_manager.add_item(item_id)
        self.test_tag_manager.add_tag("bird3", item_id)
        item_id = database_helper.get_id()
        self.test_item_manager.add_item(item_id)
        self.test_tag_manager.add_tag("hey", item_id)
        item_id = database_helper.get_id()
        self.test_item_manager.add_item(item_id)
        self.test_tag_manager.add_tag("h", item_id)
        self.test_tag_manager.add_tag("hiya", item_id)
        self.test_tag_manager.add_tag("hello", item_id)
        all_maching_products = self.test_search_manager.get_all_maching_products("bir")
        self.assertEqual(len(all_maching_products), 3)
        all_maching_products = self.test_search_manager.get_all_maching_products("h")
        self.assertEqual(len(all_maching_products), 4)

        

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