# from dataclasses import dataclass


# @dataclass
class Product:
    def __init__(self, item_id: str, vector_path: str, png_path: str, tags: tuple):
        self.item_id = item_id
        self.vector_path = vector_path
        self.png_path = png_path
        self.tags = tags


    
