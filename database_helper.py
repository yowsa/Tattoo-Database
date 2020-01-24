import uuid


def get_id():
    return str(uuid.uuid4())


def is_valid_id(id):
    if str(uuid.UUID(id)) == id:
        return True
    return False
