class DatabaseManager:

    def __init__(self, connection):
        self.connection = connection

    def get_cursor(self, connection):
        return connection.cursor()

    def commit_changes(self, connection):
        connection.commit()





