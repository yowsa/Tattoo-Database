import pymysql.cursors
from config import DatabaseConf
from response import Response
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class DatabaseConnector:
    charset = 'utf8mb4'
    cursorclass = pymysql.cursors.DictCursor

    def __init__(self, database=None, host="localhost", user="root", password=""):
        self.db = database
        self.host = host
        self.user = user
        self.password = password

    def set_database(self, database):
        self.db = database

    def get_connection(self):
        try:
            return pymysql.connect(host=self.host,
                                   user=self.user,
                                   password=self.password,
                                   db=self.db,
                                   charset=self.charset,
                                   cursorclass=self.cursorclass)
        except pymysql.err.OperationalError:
            logger.error('Wrong Database credentials', exc_info=True)
            return Response.NOT_CONNECTED.message("Not connected to database due to wrong credentials.")
    
    def create_database(self, database):
        query = "CREATE DATABASE IF NOT EXISTS " + database
        self.execute(query)

    def create_tables(self):
        self.execute(DatabaseConf.ITEM_TABLE_SCHEMA)
        self.execute(DatabaseConf.TAGS_TABLE_SCHEMA)

    def execute(self, *args):
        connection = self.get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute(*args)
            connection.commit()
        finally:
            connection.close()
        return cursor.fetchall()
