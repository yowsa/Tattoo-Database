import unittest 
from database import DatabaseCreationForTest

#setup skapa ny databas, tabell etc
#teardown  ta bort databas etc


class TestDatabaseManager(unittest.TestCase):

	@classmethod
	def setUpClass(self):
		self.database_creation_for_test = DatabaseCreationForTest()

	def setUp(self):
		self.database_creation_for_test.create_test_database()
		self.database_creation_for_test.set_test_database()
		self.database_creation_for_test.create_test_table("test")

#	def test_submit_to_table(self):
#		self.database_creation_for_test.submit_to_table("test", "TestName", "TestLName")
#		self.assertEqual("hej", "hej")

	def tearDown(self):
		self.database_creation_for_test.delete_test_database("test")




if __name__ == '__main__':
    unittest.main()