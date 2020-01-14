
import unittest
import sys
sys.path.append("/Users/josefinfundin/Dev/Tattoo-Database")
import database_connector
import database_manager


def create_test_database(database_connector):
    database_connector.execute("CREATE DATABASE test_db")


def set_test_database(database_connector):
    database_connector.set_database("test_db")


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

    def setUp(self):
        create_test_database(self.test_database_connector)
        set_test_database(self.test_database_connector)
        create_items_test_table(self.test_database_connector)
        create_tags_test_table(self.test_database_connector)
    
    def test_submit_to_table(self):
        self.assertEqual("hej", "hej")

    def tearDown(self):
        delete_test_database(self.test_database_connector)
        
    @classmethod
    def tearDownClass(self):
        self.test_database_connector = None

if __name__ == '__main__':
    unittest.main()