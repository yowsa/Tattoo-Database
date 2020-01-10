from DatabaseConnector import DatabaseConnector
from DatabaseManager import DatabaseManager

database_connector = DatabaseConnector('db')
connection = database_connector.getConnection()
database_manager = DatabaseManager(connection)

try:
    with database_manager.getCursor(connection) as cursor:
        # Create a new record
        sql = "INSERT INTO `users` (`email`, `password`) VALUES (%s, %s)"
        cursor.execute(sql, ('webmaster@python.org', 'very-secret'))

    # connection is not autocommit by default. So you must commit to save
    # your changes.
    database_manager.commitChanges(connection)

    with database_manager.getCursor(connection) as cursor:
        # Read a single record
        sql = "SELECT `id`, `password` FROM `users` WHERE `email`=%s"
        cursor.execute(sql, ('webmaster@python.org',))
        result = cursor.fetchone()
        print(result)
finally:
    database_connector.closeConnection(connection)
