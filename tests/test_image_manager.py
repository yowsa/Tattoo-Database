import unittest
import boto3
from PIL import Image
from boto3.resources.base import ServiceResource
from image_manager import AwsConnector
from image_manager import ImageManager
from moto import mock_s3
import helper


@mock_s3
class TestImageManager(unittest.TestCase):
    BUCKET = 'jf-test555-bucket'
    VECTOR_TO_UPLOAD = "images/1.eps"
    VECTOR_FILE_EXT = '.eps'
    VECTOR_SUBFOLDER = 'vector'
    ITEM_ID_1 = "1e852a2d-35c2-409e-ac86-38224f5ac2d7"
    PNG_TO_UPLOAD = "images/test.png"

    def setUp(self):
        aws_connector = AwsConnector()
        self.s3_resource = aws_connector.get_s3_resource()
        self.s3_resource.create_bucket(Bucket=self.BUCKET, CreateBucketConfiguration={
            'LocationConstraint': 'eu-west-2'},)
        self.image_manager = ImageManager(self.s3_resource, self.BUCKET)

    def tearDown(self):
        bucket = self.s3_resource.Bucket(self.BUCKET)
        for key in bucket.objects.all():
            key.delete()
        bucket.delete()

    def test_upload_vector_file(self):
        # act
        vector_path = self.image_manager.upload_vector_file(
            self.VECTOR_TO_UPLOAD, self.ITEM_ID_1)
        images = tuple(
            img.key for img in self.image_manager.bucket.objects.all())

        # assert
        self.assertIn(vector_path, images)

    def test_upload_png_file(self):
        # act
        png_path = self.image_manager.upload_png_file(
            self.VECTOR_TO_UPLOAD, self.ITEM_ID_1)
        images = tuple(
            img.key for img in self.image_manager.bucket.objects.all())

        # assert
        self.assertIn(png_path, images)

    def test_delete_file(self):
        # arrange
        vector_path = self.image_manager.upload_vector_file(
            self.VECTOR_TO_UPLOAD, self.ITEM_ID_1)

        # act
        return_message = self.image_manager.delete_file(vector_path)
        images = tuple(
            img.key for img in self.image_manager.bucket.objects.all())

        # assert
        self.assertTrue(return_message)
        self.assertNotIn(vector_path, images)

    def test__get_img_path(self):
        # act
        image_path = self.image_manager._get_img_path(
            self.ITEM_ID_1, self.VECTOR_FILE_EXT, self.VECTOR_SUBFOLDER)

        # assert
        self.assertTrue(image_path.endswith('.eps'))
        self.assertEqual(image_path, self.VECTOR_SUBFOLDER +
                         "/" + self.ITEM_ID_1 + self.VECTOR_FILE_EXT)

    def test__get_image_object(self):
        # act
        image_object = self.image_manager._get_image_object(
            self.VECTOR_TO_UPLOAD)

        # assert
        self.assertIsInstance(image_object, object)
        image_object.close()

    def test__get_file_ext(self):
        # act
        file_ext = self.image_manager._get_file_ext(self.VECTOR_TO_UPLOAD)

        # assert
        self.assertEqual(file_ext, self.VECTOR_FILE_EXT)

    def test__is_supported_format(self):
        # arrange
        formats = ('.eps', '.jpg')

        # act
        eps = self.image_manager._is_supported_format(
            self.VECTOR_TO_UPLOAD, formats)
        png = self.image_manager._is_supported_format(
            self.PNG_TO_UPLOAD, formats)

        # assert
        self.assertTrue(eps)
        self.assertFalse(png)

    def test__scale_vector(self):
        # arrange
        image_object = self.image_manager._get_image_object(
            self.VECTOR_TO_UPLOAD)
        min_width = 2000

        # act
        vector = self.image_manager._scale_vector(image_object, min_width)

        # assert
        self.assertTrue(vector.width >= min_width)
        image_object.close()

    def test__get_png(self):
        # act
        png = self.image_manager._get_png(self.VECTOR_TO_UPLOAD)

        # assert
        self.assertIsInstance(png, bytes)
