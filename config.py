

class AwsConf:
    BUCKET = 'jf-test-bucket'
    VECTOR_FOLDER = 'vector'
    PNG_FOLDER = 'png'


class ImageConf:
    PNG_HEIGHT = 800
    PNG_WIDTH = 800
    VECTOR_MIN_WIDTH = 2000
    VECTOR_MIN_HEIGHT = 2000
    VECTOR_FORMATS = ('.eps', '.pdf')


class DatabaseConf:
    DB = 'db'
    HOST = 'localhost'
    USER = 'root'
    PASSWORD = ''
    ITEM_TABLE_SCHEMA = ("CREATE TABLE Items"
                         "(ItemId VARCHAR(45) NOT NULL PRIMARY KEY, "
                         "VectorPath VARCHAR(255) NOT NULL, "
                         "PngPath VARCHAR(255) NOT NULL);")
    TAGS_TABLE_SCHEMA = ("CREATE TABLE Tags "
                         "(TagId VARCHAR(45) NOT NULL PRIMARY KEY, "
                         "Tag VARCHAR(255) CHARACTER SET UTF8MB4 COLLATE utf8mb4_unicode_ci NOT NULL, "
                         "ItemId VARCHAR(45) NOT NULL);")
