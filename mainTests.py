import unittest 
from database import DatabaseManager

#setup skapa ny databas, tabell etc
#teardown  ta bort databas etc


class TestDatabaseManager(unittest.TestCase):

	@classmethod
	def setUpClass(self):
		self.database_manager = DatabaseManager()

	def setUp(self):
		self.database_manager.create_database("test")
		self.database_manager.create_table("test")

	def test_submit_to_table(self):
		self.database_manager.submit_to_table("test", "TestName", "TestLName")
		self.assertEqual("hej", "hej")

	def tearDown(self):
		self.database_manager.delete_database("test")




if __name__ == '__main__':
    unittest.main()