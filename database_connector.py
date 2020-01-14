import pymysql.cursors


class DatabaseConnector:
    def __init__(self, database=None):
        self.host = 'localhost'
        self.user = 'root'
        self.password = ''
        self.db = database
        self.charset = 'utf8mb4'
        self.cursorclass = pymysql.cursors.DictCursor

    def set_database(self, database):
        self.db = database

    def get_connection(self):
        connection = pymysql.connect(host=self.host,
                                     user=self.user,
                                     password=self.password,
                                     db=self.db,
                                     charset=self.charset,
                                     cursorclass=self.cursorclass)
        return connection

    def execute(self, *args):
        connection = self.get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute(*args)
            connection.commit()
        finally:
            connection.close()
