import pymysql.cursors


class DatabaseConnector:
    host = 'localhost'
    user = 'root'
    password = ''
    db = None
    charset = 'utf8mb4'
    cursorclass = pymysql.cursors.DictCursor
    
    def __init__(self, database=None):
        if database != None:
            self.db = database

    def set_database(self, database):
        self.db = database

    def get_connection(self):
        return pymysql.connect(host=self.host,
                                     user=self.user,
                                     password=self.password,
                                     db=self.db,
                                     charset=self.charset,
                                     cursorclass=self.cursorclass)

    def execute(self, *args):
        connection = self.get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute(*args)
            connection.commit()
        finally:
            connection.close()
        return cursor.fetchone()