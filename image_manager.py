import boto3
import os.path
import helper


class AwsConnector:

    def get_s3_resource(self):
        return boto3.resource('s3')

    def get_s3_bucket(self, bucket_name):
        return self.get_s3_resource().Bucket(bucket_name)


class ImageManager:
    def __init__(self, s3_resource, bucket_name):
        self.bucket = s3_resource.Bucket(bucket_name)
        self.vector_folder = 'vector'
        self.png_folder = 'png'

    def add_image(self, file_name, item_id, vector=True):
        new_file_name = self._get_img_path(file_name, item_id, vector)
        self.bucket.upload_file(
            file_name, new_file_name)
        return new_file_name

    def delete_image(self, item_id, vector=True):
        folder = self.vector_folder if vector else self.png_folder
        img_path = os.path.join(folder, item_id)
        response = self.bucket.objects.filter(Prefix=img_path).delete()
        if response and response[0]['ResponseMetadata']['HTTPStatusCode'] == 200:
            return True
        return False

    def _get_img_path(self, file_name, item_id, vector=True):
        folder = self.vector_folder if vector else self.png_folder
        ext = os.path.splitext(file_name)[1]
        return os.path.join(folder, item_id) + ext
