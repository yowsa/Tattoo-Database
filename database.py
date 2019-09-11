import pymysql.cursors

class DatabaseManager:

	def __init__(self):
		self.host = 'localhost'
		self.user = 'root'
		self.password = 'password'
		database = 'mynewdb'
		print("Database Manager Print")

		self.connection = pymysql.connect(host=self.host,
                             user=self.user,
                             password=self.password,
                             database=database,
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)


	def create_database(self):
		cur = self.connection.cursor()
		cur.execute("CREATE DATABASE test")
		self.connection.commit()
		cur.close()


	def delete_database(self):
		cur = self.connection.cursor()
		cur.execute("DROP DATABASE test")
		self.connection.commit()
		cur.close()

	def create_table(self):
		connection = pymysql.connect(host=self.host,
                             user=self.user,
                             password=self.password,
                             database="test",
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)		
		cur = connection.cursor()
		cur.execute("CREATE TABLE testtable (name VARCHAR(255), address VARCHAR(255))")
		connection.commit()
		cur.close()


database_manager = DatabaseManager()





