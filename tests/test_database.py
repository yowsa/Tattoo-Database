import sys
sys.path.append("/Users/josefinfundin/Dev/Tattoo-Database")
import unittest
import database_connector
import database_manager

def create_test_database_setup(database_connector):
    database_connector.execute("CREATE DATABASE TestDB") #create database
    database_connector.set_database("TestDB") #set database
    database_connector.execute(
        "CREATE TABLE Items (ItemId VARCHAR(45) NOT NULL PRIMARY KEY, VectorPath VARCHAR(255) NOT NULL, PngPath VARCHAR(255) NOT NULL);") #create items table
    database_connector.execute(
        "CREATE TABLE Tags (TagId VARCHAR(45) NOT NULL PRIMARY KEY, Tag VARCHAR(255) CHARACTER SET UTF8MB4 COLLATE utf8mb4_unicode_ci NOT NULL,ItemId VARCHAR(45) NOT NULL);") #create tags table

def tear_down_database_setup(database_connector):
    database_connector.set_database(None) #setting datbase to None again
    database_connector.execute("DROP DATABASE TestDB") #deleting test database

class TestDatabaseManager(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.test_database_connector = database_connector.DatabaseConnector()
        self.test_item_manager = database_manager.ItemManager(self.test_database_connector)
        self.test_tag_manager = database_manager.TagManager(self.test_database_connector)

    def setUp(self):
        create_test_database_setup(self.test_database_connector)
    
    def test_add_item(self):
        count = self.test_database_connector.execute("SELECT COUNT(*) FROM Items;")
        self.assertEqual(count['COUNT(*)'], 0)
        self.test_item_manager.add_item()
        count = self.test_database_connector.execute("SELECT COUNT(*) FROM Items;")
        self.assertEqual(count['COUNT(*)'], 1)
    
    def test_delete_item(self):
        count = self.test_database_connector.execute("SELECT COUNT(*) FROM Items;")
        self.assertEqual(count['COUNT(*)'], 0)
        item_id = self.test_item_manager.add_item()
        count = self.test_database_connector.execute("SELECT COUNT(*) FROM Items;")
        self.assertEqual(count['COUNT(*)'], 1)
        self.test_item_manager.delete_item(item_id)
        count = self.test_database_connector.execute("SELECT COUNT(*) FROM Items;")
        self.assertEqual(count['COUNT(*)'], 0)
    
    def test_add_tag(self):
        count = self.test_database_connector.execute("SELECT COUNT(*) FROM Tags;")
        self.assertEqual(count['COUNT(*)'], 0)
        item_id = self.test_item_manager.add_item()
        self.test_tag_manager.add_tag("test tag", item_id)
        count = self.test_database_connector.execute("SELECT COUNT(*) FROM Tags;")
        self.assertEqual(count['COUNT(*)'], 1)

    def tearDown(self):
        tear_down_database_setup(self.test_database_connector)

    @classmethod
    def tearDownClass(self):
        self.test_database_connector = None
        self.test_item_manager = None
        self.test_tag_manager = None

if __name__ == '__main__':
    unittest.main()