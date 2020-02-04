from dataclasses import dataclass


@dataclass
class Product:
    item_id: str
    vector_path: str
    png_path: str
    tags: tuple
    
