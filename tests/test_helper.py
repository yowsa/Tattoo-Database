
import unittest
import helper


class TestDatabaseManager(unittest.TestCase):

    def test_get_id(self):
        # arrange & act
        id = helper.get_id()

        # assert
        self.assertEqual(type(id), str)
        self.assertEqual(len(id), 36)

    def test_is_valid_id(self):
        # arrange
        id = helper.get_id()
        invalid_id = "1234"

        # act & assert
        self.assertTrue(helper.is_valid_id(id))
        self.assertFalse(helper.is_valid_id(invalid_id))
