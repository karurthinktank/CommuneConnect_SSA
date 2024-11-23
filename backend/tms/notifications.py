#!/usr/bin/env python
# -*- coding: utf-8 -*-

from django.conf import settings
from django.template.loader import render_to_string

from utils.send_mail import sendmail_with_sendgrid


class NotificationHandler:
    def __init__(self, *arg, **kwargs):
        super(NotificationHandler, self).__init__(*arg, **kwargs)

    @staticmethod
    def send_email_notification(data, request=None, to_emails=None, cc_emails=None):
        try:
            # TODO: construct template payload
            email_domain = settings.DOMAIN_NAME.startswith('@') and settings.DOMAIN_NAME or "@" + settings.DOMAIN_NAME

            # from_email = from_email and from_email or notif.from_email
            from_email = 'no-reply' + email_domain
            cc = []
            if cc_emails:
                cc_emails.extend(cc)
            else:
                cc_emails = cc
            # Set Technical account as default recipients when recipients is empty
            if not to_emails:
                to_emails = []
                to_emails.extend(cc)
                cc_emails.remove(cc[0])
            subject = data.get("subject", None)
            title = data.get("title", None)
            module = data.get("module", None)
            mail_content = data.get("message", None)
            user_link = data.get("user_link", None)
            content_table = data.get('content_table', None)
            warnings = data.get('warnings', None)
            body = render_to_string("email_layout.html", locals(), request)
            result = sendmail_with_sendgrid(from_email, to_emails, subject, body, cc_emails)
            return result
        except Exception as e:
            print(str(e))
            return False
