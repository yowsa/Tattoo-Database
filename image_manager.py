import boto3


class ImageManager:
    def __init__(self):
        self.s3_client = boto3.client('s3')
        self.vector_bucket = 'jf-test-bucket'
        self.png_bucket = 'jf-test-bucket'

    def add_vetor(self, img_name, item_id):
        path_name = item_id + ".eps"
        response = self.s3_client.upload_file(
            img_name, self.vector_bucket, path_name)
        return response

    def add_small_img(self, img_name, item_id):
        path_name = item_id + ".png"
        response = self.s3_client.upload_file(
            img_name, self.vector_bucket, path_name)
        return response
