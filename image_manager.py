import boto3
from PIL import Image
import os.path
import helper
import io
import math
from config import AwsConf, ImageConf


class AwsConnector:
    def get_s3_resource(self):
        return boto3.resource('s3')


class ImageManager:
    def __init__(self, s3_resource, bucket_name):
        self.bucket = s3_resource.Bucket(bucket_name)
        self.vector_folder = 'vector'
        self.png_folder = 'png'

    def upload_file(self, bytes_file, file_name, bucket_name):
        response = self.bucket.put_object(Body=bytes_file, Key=file_name)
        return response

    def upload_vector_file(self, file: str, item_id: str, subfolder: str = ''):
        """
        Keyword arguments:
        file: a string reference to the file on your computer
        item_id: identifying string
        subfolder: folder path(s) if needed.

        Return: image path
        """
        if self._is_supported_format(file, ImageConf.VECTOR_FORMATS):
            file_ext = self._get_file_ext(file)
            image = open(file, "rb")
            bytes_file = image.read()
            image_path = self._get_img_path(item_id, file_ext, subfolder)
            self.upload_file(bytes_file, image_path, self.bucket)
            image.close()
            return image_path

    def upload_png_file(self, file: str, item_id: str, subfolder: str = ''):
        # TODO: check if fiel is already a png if so don't scale etc
        png = self._get_png(file)
        image_path = self._get_img_path(item_id, '.png', subfolder)
        self.upload_file(png, image_path, self.bucket)
        return image_path

    def delete_file(self, image_path: str):
        """Return: True if query was successful, whether object existed or not"""
        response = self.bucket.Object(image_path).delete()
        if response and response['ResponseMetadata']['HTTPStatusCode'] == 204:
            return True
        return False

    def _get_img_path(self, item_id: str, file_ext: str, subfolder: str = ''):
        return os.path.join(subfolder, item_id) + file_ext

    def _get_image_object(self, file_path: str):
        return Image.open(file_path)

    def _get_file_ext(self, file_path):
        return os.path.splitext(file_path)[1].lower()

    def _is_supported_format(self, file_path, formats: tuple):
        file_ext = self._get_file_ext(file_path)
        return file_ext in formats

    def _scale_vector(self, vector: object, min_width: int):
        if vector.width < min_width:
            scale_to = math.ceil(min_width / vector.width)
            vector.load(scale=scale_to)
        return vector

    def _get_png(self, file: str):
        # TODO: Implement check to only allow vector files
        """
        Converts a vector file to image object, scales the vector to minimun size,
        resizes to correct png size, saves it and returns it as bytes ready to upload.
        """
        image_object = self._get_image_object(file)
        vector = self._scale_vector(
            image_object, ImageConf.VECTOR_MIN_WIDTH)
        resized_img = self._resize_png(
            vector, (ImageConf.PNG_HEIGHT, ImageConf.PNG_WIDTH))
        image_bytes = io.BytesIO()
        resized_img.save(image_bytes, format='PNG')
        resized_img.seek(0)
        image_object.close()
        return image_bytes.getvalue()

    def _resize_png(self, png: object, height_width: tuple):
        resized_image = png.resize(height_width)
        return resized_image


# s3 = AwsConnector().get_s3_resource()

# im = ImageManager(s3, AwsConf.BUCKET)

# print(im.delete_file('testarpng.png'))

# im.upload_file('images/test.png', "hellothere.png", AwsConf.BUCKET)
