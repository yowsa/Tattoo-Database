

class TattooManager():

	def __init__(self, database_manager=None):
		if database_manager is None:
			from database import database_manager
		self.database_manager = database_manager

	def add_tattoo(self, vector_path):
		self.database_manager.execute("INSERT INTO tattoos (vector_path, png_path) VALUES (%s, %s)", (vector_path, vector_path))

	def remove_tattoo(self, name):
		self.database_manager.execute("DELETE FROM tattos WHERE name=%s", (name,))



class TagManager():

	def add_tag(self, tag, tattoo_id):
		self.database_manager.execute("INSERT INTO tags (tag, tattoo_id) VALUES (%s, %s)", (tag, tattoo_id))


	def remove_tag(self, name):
		self.database_manager.execute("DELETE FROM tags WHERE name=%s", (name,))
