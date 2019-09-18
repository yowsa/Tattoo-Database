

class TattooManager():

	def __init__(self, database_manager=None):
		if database_manager is None:
			from database import database_manager
		self.database_manager = database_manager

	def add_tattoo(self, img_path):
		self.database_manager.execute("INSERT INTO tattoos (img_path) VALUES (%s)", (img_path))

	def remove_tattoo(self, name):
		self.database_manager.execute("DELETE FROM tattos WHERE name=%s", (name,))

	def get_next_tattoo_id(self, table, database):
		cur = self.database_manager.connection.cursor()
		cur.execute("SELECT AUTO_INCREMENT FROM information_schema.TABLES WHERE table_name = %s AND table_schema=%s", (table, database))
		rv = cur.fetchall()
		cur.connection.commit()
		cur.close()
		print(rv)


class TagManager():

	def add_tag(self, tag, tattoo_id):
		self.database_manager.execute("INSERT INTO tags (tag, tattoo_id) VALUES (%s, %s)", (tag, tattoo_id))


	def remove_tag(self, name):
		self.database_manager.execute("DELETE FROM tags WHERE name=%s", (name,))
