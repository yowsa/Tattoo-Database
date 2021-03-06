
from . import setup_test
import unittest
from moto import mock_s3
import database_connector
import database_manager
import product_manager
from image_manager import ImageManager
from image_manager import AwsConnector


@mock_s3
class TestProductManager(unittest.TestCase):
    BUCKET = 'jf-test555-bucket'
    VECTOR_TO_UPLOAD = "images/1.eps"
    VECTOR_FILE_EXT = '.eps'
    VECTOR_SUBFOLDER = 'vector'
    PNG_SUBFOLDER = 'png'
    PNG_FILE_EXT = '.png'
    ITEM_ID_1 = "1e852a2d-35c2-409e-ac86-38224f5ac2d7"
    PNG_TO_UPLOAD = "images/test.png"
    TAGS = ('bird', 'fineline')
    IMG_BRIGHTNESS = "0.75"

    @classmethod
    def setUpClass(self):
        self.database_connector = database_connector.DatabaseConnector()
        self.item_manager = database_manager.ItemManager(
            self.database_connector)
        self.tag_manager = database_manager.TagManager(
            self.database_connector)
        aws_connector = AwsConnector(None)
        self.s3_resource = aws_connector.get_s3_resource()
        self.image_manager = ImageManager(self.s3_resource, self.BUCKET)
        self.product_manager = product_manager.ProductManager(
            self.item_manager, self.tag_manager, self.image_manager)

    def setUp(self):
        setup_test.create_test_database_setup(self.database_connector)
        self.s3_resource.create_bucket(Bucket=self.BUCKET, CreateBucketConfiguration={
            'LocationConstraint': 'eu-west-2'},)

    def tearDown(self):
        setup_test.tear_down_database_setup(self.database_connector)
        bucket = self.s3_resource.Bucket(self.BUCKET)
        for key in bucket.objects.all():
            key.delete()
        bucket.delete()

    def test_add_product(self):
        # act
        with open(self.VECTOR_TO_UPLOAD, 'rb') as vector_file:
            vector_bytes = vector_file.read()
            self.product_manager.add_product(
                self.TAGS, vector_bytes, self.VECTOR_FILE_EXT, self.PNG_TO_UPLOAD, self.PNG_FILE_EXT, self.VECTOR_SUBFOLDER, self.PNG_SUBFOLDER)

            # assert
            self.assertEqual(setup_test.count_rows(
                self.database_connector, 'Items'), 1)
            self.assertEqual(setup_test.count_rows(
                self.database_connector, 'Tags'), 2)

    def test_delete_product(self):
        # arrange
        with open(self.VECTOR_TO_UPLOAD, 'rb') as vector_file:
            vector_bytes = vector_file.read()

            item_id = self.product_manager.add_product(
                self.TAGS, vector_bytes, self.VECTOR_FILE_EXT,  self.VECTOR_TO_UPLOAD)['Body']
            vector_path = self.VECTOR_SUBFOLDER + item_id + self.VECTOR_FILE_EXT
            png_path = self.PNG_SUBFOLDER + item_id + self.PNG_FILE_EXT

            # act
            self.product_manager.delete_product(item_id)
            images = tuple(
                img.key for img in self.image_manager.bucket.objects.all())

            # assert
            self.assertEqual(setup_test.count_rows(
                self.database_connector, 'Items'), 0)
            self.assertEqual(setup_test.count_rows(
                self.database_connector, 'Tags'), 0)
            self.assertNotIn(vector_path, images)
            self.assertNotIn(png_path, images)

    def test_get_all_products(self):
        # arrange
        setup_test.test_items_tags_setup(self.item_manager, self.tag_manager)

        # act
        all_products = self.product_manager.get_all_products()['Body']

        # assert
        self.assertEqual(len(all_products), 4)

    def test_get_all_matching_products(self):
        # arrange
        setup_test.test_items_tags_setup(
            self.item_manager, self.tag_manager)

        # act
        all_matching_products = self.product_manager.get_all_matching_products(
            "bir")['Body']

        # assert
        self.assertEqual(len(all_matching_products), 3)

    def test_update_product_tags(self):
        # arrange
        setup_test.test_items_tags_setup(self.item_manager, self.tag_manager)
        new_tags = ('horse', 'pony', 'hello')

        # act
        updated_tags = self.product_manager.update_product_tags(
            setup_test.ITEM_ID_4, new_tags)['Body']

        # assert
        self.assertCountEqual(new_tags, updated_tags)


if __name__ == '__main__':
    unittest.main()
