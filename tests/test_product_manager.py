
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
    bucket = 'jf-test555-bucket'

    @classmethod
    def setUpClass(self):
        self.database_connector = database_connector.DatabaseConnector()
        self.item_manager = database_manager.ItemManager(
            self.database_connector)
        self.tag_manager = database_manager.TagManager(
            self.database_connector)
        aws_connector = AwsConnector()
        self.s3_resource = aws_connector.get_s3_resource()
        self.image_manager = ImageManager(self.s3_resource, self.bucket)
        self.product_manager = product_manager.ProductManager(
            self.item_manager, self.tag_manager, self.image_manager)

    def setUp(self):
        setup_test.create_test_database_setup(self.database_connector)
        self.s3_resource.create_bucket(Bucket=self.bucket, CreateBucketConfiguration={
            'LocationConstraint': 'eu-west-2'},)

    def test_add_product(self):
        # arrange
        tags = ['bird', 'fineline']
        vector_file = "tests/test2.jpg"
        png_file = "tests/test2.jpg"

        # act
        self.product_manager.add_product(tags, vector_file, png_file)

        # assert
        self.assertEqual(setup_test.count_rows(
            self.database_connector, 'Items'), 1)
        self.assertEqual(setup_test.count_rows(
            self.database_connector, 'Tags'), 2)

    def test_delete_product(self):
        # arrange
        tags = ['bird', 'fineline']
        vector_file = "tests/test2.jpg"
        png_file = "tests/test2.jpg"
        item_id = self.product_manager.add_product(tags, vector_file, png_file)

        # act
        self.product_manager.delete_product(item_id)

        # assert
        self.assertEqual(setup_test.count_rows(
            self.database_connector, 'Items'), 0)
        self.assertEqual(setup_test.count_rows(
            self.database_connector, 'Tags'), 0)

    def test_get_all_products(self):
        # arrange
        setup_test.test_items_tags_setup(self.item_manager, self.tag_manager)

        # act
        all_products = self.product_manager.get_all_products()

        # assert
        self.assertEqual(len(all_products), 4)

    def test_get_all_matching_products(self):
        # arrange
        setup_test.test_items_tags_setup(
            self.item_manager, self.tag_manager)

        # act
        all_matching_products = self.product_manager.get_all_matching_products(
            "bir")

        # assert
        self.assertEqual(len(all_matching_products), 3)

    def tearDown(self):
        setup_test.tear_down_database_setup(self.database_connector)
        bucket = self.s3_resource.Bucket(self.bucket)
        for key in bucket.objects.all():
            key.delete()
        bucket.delete()


if __name__ == '__main__':
    unittest.main()
