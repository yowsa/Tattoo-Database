import boto3
from PIL import Image
import os.path
import helper
import io
import math
from config import ImageConf
from login_config import AwsConf


class AwsConnector:
    def get_s3_resource(self):
        return boto3.resource('s3')


class ImageManager:
    def __init__(self, s3_resource: object, bucket_name: str):
        self.bucket = s3_resource.Bucket(bucket_name)

    def upload_file(self, bytes_file: bytes, file_name: str, bucket_name: str):
        response = self.bucket.put_object(Body=bytes_file, Key=file_name, ACL='public-read')
        return response

    def upload_vector_file(self, bytes_file: bytes, item_id: str, file_ext: str, subfolder: str = ''):
        """
        Keyword arguments:
        file: a bytes object
        item_id: identifying string
        subfolder: folder path(s) if needed.

        Return: image path
        """
        image_path = self._get_img_path(item_id, file_ext, subfolder)
        self.upload_file(bytes_file, image_path, self.bucket)
        return image_path

    def upload_png_file(self, png_file: bytes, item_id: str, png_file_ext: str, subfolder: str = ''):
        if png_file_ext != '.png':
            png_file = self._get_png(png_file)
        
        image_path = self._get_img_path(item_id, '.png', subfolder)
        self.upload_file(png_file, image_path, self.bucket)
        return image_path

    def delete_file(self, image_path: str):
        """Return: True if query was successful, whether object existed or not"""
        response = self.bucket.Object(image_path).delete()
        if response and response['ResponseMetadata']['HTTPStatusCode'] == 204:
            return True
        return False

    def _get_img_path(self, item_id: str, file_ext: str, subfolder: str = ''):
        return os.path.join(subfolder, item_id) + file_ext

    def get_file_ext(self, file_path: str):
        return os.path.splitext(file_path)[1].lower()

    def is_supported_format(self, file_path: str, formats: tuple):
        file_ext = self.get_file_ext(file_path)
        return file_ext in formats

    def _scale_vector(self, vector: object, min_width: int):
        if vector.width < min_width:
            scale_to = math.ceil(min_width / vector.width)
            vector.load(scale=scale_to)
        return vector

    def _get_png(self, vector_file: bytes):
        """
        Converts a vector bytes file to image object, it scales it to minimum size,
        resizes to correct png size, saves it and returns it as bytes ready to upload.
        """
        with Image.open(io.BytesIO(vector_file)) as image_object:
            image_object = self._scale_vector(
                image_object, ImageConf.VECTOR_MIN_WIDTH)

            resized_img = self._resize_png(
                image_object, (ImageConf.PNG_WIDTH))
            image_bytes = io.BytesIO()
            resized_img.save(image_bytes, format='PNG')
            return image_bytes.getvalue()

    def _resize_png(self, png: object, width: int):
        ratio = width / png.size[1]
        height = int(png.size[0] * ratio)
        resized_image = png.resize((height, width))
        return resized_image

    def calculate_brightness(self, vector_file):
        with Image.open(io.BytesIO(vector_file)) as image:
            greyscale_image = image.convert('L')
            histogram = greyscale_image.histogram()
            pixels = sum(histogram)
            brightness = scale = len(histogram)

            for index in range(0, scale):
                ratio = histogram[index] / pixels
                brightness += ratio * (-scale + index)

            return 1 if brightness == 255 else brightness / scale
