from enum import Enum


class Response(Enum):
    OK = 1
    USER_ERROR = 2
    SERVER_ERROR = 3
    INVALID_FILE = 4
    INVALID_FORMAT = 5
    FILE_NOT_FOUND = 6
    NOT_CONNECTED = 7
    CONNECTED = 8
    UNKNOWN_ERROR = 9

    def message(self, message: str, body=None, pngpath=None, tags=None):
        return {'ErrorCode': self.name, 'Message': message, 'Body': body, 'PngPath':pngpath, "Tags":tags}