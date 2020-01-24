import boto3
import os.path


class ImageManager:
    def __init__(self):
        self.s3_client = boto3.client('s3')
        self.s3_vector = 'jf-test-bucket'
        self.s3_small_img = 'jf-test-bucket'

    def add_image(self, file_name, item_id, folder=None):
        folder = folder if folder else self.s3_vector
        new_file_name = self._set_img_name(file_name, item_id)
        self.s3_client.upload_file(
            file_name, folder, new_file_name)
        return new_file_name
    
    def delete_image(self, item_id):
        self.s3_client.delete_object(Bucket=self.s3_vector, Key=item_id)
        self.s3_client.delete_object(Bucket=self.s3_small_img, Key=item_id)

    def _set_img_name(self, file, item_id):
        ext = os.path.splitext(file)[1]
        return item_id + ext


# im = ImageManager()
# s3 = boto3.resource('s3')
# bucket = s3.Bucket('jf-test-bucket')
# bucket.objects.filter(Prefix="bla´").delete()


# im.add_image("test2.jpg", "1ddd234")
# im.delete_image("test.jpg")´
