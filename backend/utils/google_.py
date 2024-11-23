import json
from google.cloud import storage
import logging
from django.conf import settings


# def get_secret_data():
#     try:
#         # Create the Secret Manager client.
#         client = secretmanager.SecretManagerServiceClient()
#         # valeo-cp1789-dev@appspot.gserviceaccount.com  -cs047-sendgrid-api-key
#         secret_detail = settings.SENDGRID_KEY_PATH
#         response = client.access_secret_version(request={"name": secret_detail})
#         data = response.payload.data.decode("UTF-8")
#         logging.info("Sendgrid Key: ", data)
#         return data
#     except Exception as e:
#         print(e)
#         logging.error(e)


def upload_from_string(file_content, content_type, file_name, bucket_name):
    blob = None
    try:
        storage_client = storage.Client()
        bucket = storage_client.get_bucket(bucket_name)
        blob = storage.Blob(file_name, bucket)
        blob.upload_from_string(file_content, content_type=content_type)
    except Exception as e:
        logging.error(str(e))
    return blob


def move_file(file_name, bucket_name, to_file_path):
    """ Method to move file from one folder to another in bucket.

    :param file_name: file need to be moved
    :param bucket_name: Cloud Bucket Name
    :param to_file_path: Destination folder to move file
    :return: boolean
    """
    try:
        storage_client = storage.Client()  # GCS Connection
        bucket = storage_client.get_bucket(bucket_name)
        current_blob = bucket.blob(file_name)

        # MOVE current file
        bucket.copy_blob(current_blob, bucket, to_file_path)
        current_blob.delete()
        logging.info("File : %s moved to %s" % (file_name, to_file_path))

        return True
    except Exception as e:
        logging.error("Error occurred during file upload - %s" % str(e))
        return False


def read_file(file_name, bucket_name):
    """ Method to read file from bucket.

    :param file_name: file need to be moved
    :param bucket_name: Cloud Bucket Name
    :return: blob
    """
    blob = None
    try:
        storage_client = storage.Client()  # GCS Connection
        bucket = storage_client.get_bucket(bucket_name)
        blob = storage.Blob(file_name, bucket)

        return blob
    except Exception as e:
        logging.error("Error occurred during file read - %s" % str(e))
        return blob


def delete_file(file_name, bucket_name):
    """ Method to delete file from bucket.

    :param file_name: file need to be deleted
    :param bucket_name: Cloud Bucket Name
    :return: blob
    """
    try:
        storage_client = storage.Client()  # GCS Connection
        bucket = storage_client.get_bucket(bucket_name)
        blob = bucket.blob(file_name)
        blob.delete()

        return True
    except Exception as e:
        logging.error("Error occurred during file delete - %s" % str(e))
        return False