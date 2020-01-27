import unittest
import boto3
from image_manager import AWSConnector
from image_manager import ImageManager
from moto import mock_s3
import helper


@mock_s3
class TestImageManager(unittest.TestCase):
    bucket = 'jf-test555-bucket'

    def setUp(self):
        # aws_connector = AWSConnector()
        self.s3_resource = boto3.resource('s3')
        self.s3_resource.create_bucket(Bucket=self.bucket, CreateBucketConfiguration={
            'LocationConstraint': 'eu-west-2'},)
        self.image_manager = ImageManager(self.s3_resource, self.bucket)

    def test_add_image(self):
        # arrange
        id = helper.get_id()
        filename = "tests/test2.jpg"
        vector_img = "vector/" + self.image_manager._set_img_name(filename, id)
        png_img = "png/" + self.image_manager._set_img_name(filename, id)

        # act
        self.image_manager.add_image(filename, id)
        self.image_manager.add_image(filename, id, False)
        images = tuple(
            img.key for img in self.image_manager.bucket.objects.all())

        # assert
        self.assertEqual(len(images), 2)
        self.assertIn(vector_img, images)
        self.assertIn(png_img, images)

    def test_delete_image(self):
        # arrange
        id = helper.get_id()
        filename = "tests/test2.jpg"
        self.image_manager.add_image(filename, id)

        # act
        return_message = self.image_manager.delete_image(id)

        # assert
        self.assertTrue(return_message)
    
    def test__set_img_name(self):
        # arrange
        filename = "tests/test2.jpg"
        item_id = helper.get_id()

        # act
        img_name = self.image_manager._set_img_name(filename, item_id)

        #assert
        self.assertTrue(img_name.endswith('.jpg'))
        self.assertEqual(img_name, item_id + '.jpg')

    def tearDown(self):
        bucket = self.s3_resource.Bucket(self.bucket)
        for key in bucket.objects.all():
            key.delete()
        bucket.delete()
