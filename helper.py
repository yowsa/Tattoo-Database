import uuid


def get_id():
    return str(uuid.uuid4())


def is_valid_id(id):
    try:
        test_id = uuid.UUID(id)
        return str(test_id) == id
    except ValueError:
        return False
