from database import database_manager


class TattooManager():

	def add_tattoo(self, name, img_path):
		database_manager.execute("INSERT INTO tattoos (name, img_path) VALUES (%s, %s)", (name, img_path))

	def remove_tattoo(self, name):
		database_manager.execute("DELETE FROM tattos WHERE name=%s", (name,))

	def get_tattoo_id(self):
		database_manager.execute("SELECT LAST_INSERT_ID() FROM tattoos")






#def execute(a,b, *args, g=1, **kwargs):
#	cur.execute(*, **kwarg)


class TagManager():

	def add_tag(self):
		database_manager.execute("INSERT INTO tags (tag, tattoo_id) VALUES (%s, %s)", (tag, tattoo_id))


	def remove_tag(self):
		database_manager.execute("DELETE FROM tags WHERE name=%s", (name,))
