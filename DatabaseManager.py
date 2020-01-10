class DatabaseManager:

    def __init__(self, connection):
        self.connection = connection

    def getCursor(self, connection):
        return connection.cursor()

    def commitChanges(self, connection):
        connection.commit()





