import helper

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
    if result[0]['COUNT(*)'] == count:
        return True
    return False


def test_items_tags_setup(item_manager, tag_manager):
    """ 
    Note: Adds 4 items to use during testing
    item 1-3: with tag 1 tag
    item 4: with 3 tags

    Return: list of ids of the added items
    """
    item_ids = []

    item_id = helper.get_id()
    item_ids.append(item_id)
    item_manager.add_item(item_id, item_id, item_id)
    tag_manager.add_tag("bird", item_id)

    item_id = helper.get_id()
    item_ids.append(item_id)
    item_manager.add_item(item_id, item_id, item_id)
    tag_manager.add_tag("bird", item_id)

    item_id = helper.get_id()
    item_ids.append(item_id)
    item_manager.add_item(item_id, item_id, item_id)
    tag_manager.add_tag("bird3", item_id)

    item_id = helper.get_id()
    item_ids.append(item_id)
    item_manager.add_item(item_id, item_id, item_id)
    tag_manager.add_tag("h", item_id)
    tag_manager.add_tag("hiya", item_id)
    tag_manager.add_tag("hello", item_id)
    return item_ids


def assertTagExists(tag, result):
    for val in result:
        if val['Tag'] == tag:
            return True
    return False


def tear_down_database_setup(database_connector):
    # setting datbase to None again
    database_connector.set_database(None)
    # deleting test database
    database_connector.execute("DROP DATABASE TestDB")
