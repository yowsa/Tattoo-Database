import boto3
import os.path
import helper


class ImageManager:
    def __init__(self):
        self.s3_client = boto3.client('s3')
        s3_resource = boto3.resource('s3')
        self.bucket = s3_resource.Bucket('jf-test-bucket')
        self.vector_folder = 'vector/'
        self.png_folder = 'png/'

    def add_image(self, file_name, item_id, vector=True):
        folder = self.vector_folder if vector else self.png_folder
        new_file_name = self._set_img_name(file_name, item_id)
        self.bucket.upload_file(
            file_name, folder + new_file_name)
        return new_file_name

    def delete_image(self, item_id):
        if helper.is_valid_id(item_id):
            self.bucket.objects.filter(Prefix=item_id).delete()
            return "All matching images (if any) deleted"
        return "Not a valid id"

    def _set_img_name(self, file, item_id):
        ext = os.path.splitext(file)[1]
        return item_id + ext
