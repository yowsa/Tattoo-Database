class ImageConf:
    PNG_HEIGHT = 800
    PNG_WIDTH = 800
    VECTOR_MIN_WIDTH = 2000
    VECTOR_MIN_HEIGHT = 2000
    VECTOR_FORMATS = ('.eps', '.pdf', '.png')


class DatabaseConf:
    ITEM_TABLE_SCHEMA = ("CREATE TABLE IF NOT EXISTS Items"
                         "(ItemId VARCHAR(45) NOT NULL PRIMARY KEY, "
                         "VectorPath VARCHAR(255) NOT NULL, "
                         "PngPath VARCHAR(255) NOT NULL, "
                         "ImageBrightness FLOAT);")
    TAGS_TABLE_SCHEMA = ("CREATE TABLE IF NOT EXISTS Tags "
                         "(TagId VARCHAR(45) NOT NULL PRIMARY KEY, "
                         "Tag VARCHAR(255) CHARACTER SET UTF8MB4 COLLATE utf8mb4_unicode_ci NOT NULL, "
                         "ItemId VARCHAR(45) NOT NULL, "
                         "INDEX (Tag, ItemId));")
