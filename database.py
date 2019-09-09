import pymysql.cursors

class DatabaseManager:

	def __init__(self):
		self.host = 'localhost'
		self.user = 'root'
		self.password = 'password'
		database = 'mynewdb'

		self.connection = pymysql.connect(host=self.host,
                             user=self.user,
                             password=self.password,
                             database=database,
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)


	def create_database(self, databaseName):
		cur = self.connection.cursor()
		cur.execute("CREATE DATABASE " + databaseName)
		self.connection.commit()
		cur.close()


	def delete_database(self, databaseName):
		cur = self.connection.cursor()
		cur.execute("DROP DATABASE " + databaseName)
		self.connection.commit()
		cur.close()

	def create_table(self, databaseName):
		self.connection = pymysql.connect(host=self.host,
                             user=self.user,
                             password=self.password,
                             database=databaseName,
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)		
		cur = self.connection.cursor()
		cur.execute("CREATE TABLE testtable (name VARCHAR(255), address VARCHAR(255))")
		self.connection.commit()
		cur.close()

	def submit_to_table(self, tableName, firstName, lastName):
		cur = connection.cursor()
		cur.execute("INSERT INTO " + tableName + " (firstName, lastName) VALUES (%s, %s)", (firstName, lastName))
		connection.commit()
		cur.close()

	def remove_from_table(self, tableName):
		cur = connection.cursor()
		cur.execute("DELETE FROM " + tableName +" WHERE firstName=%s", (firstName,))
		connection.commit()
		cur.close()




data = DatabaseManager()


#data.create_database("test")
#data.create_table("test")
#data.delete_database("test")



