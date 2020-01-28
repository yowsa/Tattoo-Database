import helper

ITEM_ID_1 = "1e852a2d-35c2-409e-ac86-38224f5ac2d7"
ITEM_ID_2 = "90e484d5-1f74-4596-97cb-9c6a8733f01c"
ITEM_ID_3 = "b0bd7389-ac55-4c3f-bbc1-0c4b06a856ed"
ITEM_ID_4 = "c0a8e5af-2c3c-43f9-916f-0eda4d5e89f6"

PNG_PATH_1 = "test.png"

VECTOR_PATH_1 = "test.vector"


def create_test_database_setup(database_connector):
    # create database
    database_connector.execute("CREATE DATABASE TestDB")
    # set database
    database_connector.set_database("TestDB")
    # create items table
    database_connector.execute(
        ("CREATE TABLE Items"
         "(ItemId VARCHAR(45) NOT NULL PRIMARY KEY, "
         "VectorPath VARCHAR(255) NOT NULL, "
         "PngPath VARCHAR(255) NOT NULL);"))
    # create tags table
    database_connector.execute(
        ("CREATE TABLE Tags "
         "(TagId VARCHAR(45) NOT NULL PRIMARY KEY, "
         "Tag VARCHAR(255) CHARACTER SET UTF8MB4 COLLATE utf8mb4_unicode_ci NOT NULL, "
         "ItemId VARCHAR(45) NOT NULL);"))


def assertCount(database_connector, table_name, count):
    sql_query = "SELECT COUNT(*) FROM " + table_name
    result = database_connector.execute(sql_query)
    return result[0]['COUNT(*)'] == count


def add_test_item_with_tags(item_manager, tag_manager, item_id, tags: tuple):
    item_manager.add_item(item_id, item_id, item_id)
    for tag in tags:
        tag_manager.add_tag(tag, item_id)


def test_items_tags_setup(item_manager, tag_manager):
    """ 
    Note: Adds 4 items to use during testing
    item 1-3: with tag 1 tag
    item 4: with 3 tags

    Return: list of ids of the added items
    """
    item_ids = (ITEM_ID_1, ITEM_ID_2, ITEM_ID_3, ITEM_ID_4)

    add_test_item_with_tags(item_manager, tag_manager, ITEM_ID_1, ('bird',))

    add_test_item_with_tags(item_manager, tag_manager, ITEM_ID_2, ('bird',))

    add_test_item_with_tags(item_manager, tag_manager, ITEM_ID_3, ('bird3',))

    add_test_item_with_tags(item_manager, tag_manager,
                            ITEM_ID_4, ('h', 'hiya', 'hello'))
    return item_ids


def assertTagExists(tag, result):
    return any(val['Tag'] == tag for val in result)


def tear_down_database_setup(database_connector):
    # setting datbase to None again
    database_connector.set_database(None)
    # deleting test database
    database_connector.execute("DROP DATABASE TestDB")
