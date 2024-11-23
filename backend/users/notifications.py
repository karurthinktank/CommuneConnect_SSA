from tms.notifications import NotificationHandler
from django.conf import settings


class UserNotification:
    def __int__(self, *args, **kwargs):
        super(UserNotification, self).__init__(*args, **kwargs)

    @staticmethod
    def user_creation(data):
        try:
            to_emails = [data['email']]
            cc_mails = list()
            payload = dict()
            payload['subject'] = "[For Information] Your user account with ElawFirm portal has been created"
            payload['title'] = "Welcome to ElawFirm"
            payload['message'] = """Hello <strong>{}<strong/><br>Your login details: <br>""".format(data['fullname'])
            table_content = {
                "Email": data['email'],
                "Username": data['username'],
                "Password": data['password'],
                "Portal login URL:": settings.SERVER_URL
            }
            payload['content_table'] = table_content
            NotificationHandler().send_email_notification(payload, request=None, to_emails=to_emails,cc_emails=cc_mails)
            return True, "Success"
        except Exception as e:
            print(str(e))
            return False, "Error while sending User creation notification"
