import uuid


def get_id():
    return str(uuid.uuid4())


def is_valid_id(id):
    try:
        test_id = uuid.UUID(id)
        if str(test_id) == id:
            return True
        else:
            return False
    except ValueError:
        return False
