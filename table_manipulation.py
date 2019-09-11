from database import database_manager


class TattooManager():

	#def __init__(self):
	#find connection


	def add_tattoo(self, tableName, firstName, lastName):
		cur = database_manager.connection.cursor()
		cur.execute("INSERT INTO " + tableName + " (firstname, lastname) VALUES (%s, %s)", (firstName, lastName))
		database_manager.connection.commit()
		cur.close()

	def remove_tattoo(self, tableName, firstName):
		cur = database_manager.connection.cursor()
		cur.execute("DELETE FROM " + tableName +" WHERE firstname=%s", (firstName,))
		database_manager.connection.commit()
		cur.close()





"""
class TagManager():
	def __init__(self):



	def add_tag(self):



	def remove_tag(self):
"""

