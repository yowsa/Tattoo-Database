import pymysql.cursors

class DatabaseManager:

	def __init__(self, database=None):
		self.connection = pymysql.connect(host='localhost',
                             user='root',
                             password='password',
                             database=database,
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)


	def execute(self, *args):
		cur = self.connection.cursor()
		cur.execute(*args)
		self.connection.commit()
		cur.close()


class DatabaseCreationForTest:

	def __init__(self):
		self.test_database_manager = DatabaseManager()

	def create_test_database(self):
		cur = test_database_manager.connection.cursor()
		cur.execute("CREATE DATABASE test")
		test_database_manager.connection.commit()
		cur.close()

	def set_test_database(self):
		self.test_database_manager = DatabaseManager(database='test')

	def delete_test_database(self):
		cur = self.test_database_manager.connection.cursor()
		cur.execute("DROP DATABASE test")
		self.test_database_manager.connection.commit()
		cur.close()

	def create_test_table(self):
		cur = self.test_database_manager.connection.cursor()
		cur.execute("CREATE TABLE testtable (name VARCHAR(255), address VARCHAR(255))")
		self.test_database_manager.connection.commit()
		cur.close()




database_manager = DatabaseManager(database='tattoo_db')

