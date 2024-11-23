#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import base64
import logging
from django.conf import settings

from sendgrid import SendGridAPIClient
from python_http_client.exceptions import HTTPError
from sendgrid.helpers.mail import Mail, Attachment, FileContent,\
    FileName, FileType, Disposition, ContentId, Personalization,\
    Email

GAE_APP_ID = os.getenv("GOOGLE_CLOUD_PROJECT", None)


def reconstruct_subject(subject):
    try:
        if not GAE_APP_ID or "-dev" in GAE_APP_ID:
            return "[DEV] " + subject
        elif "-acp" in GAE_APP_ID:
            return "[ACP] " + subject
        else:
            return subject
    except Exception:
        return subject


def sendmail_with_sendgrid(
        from_email, to_emails, subject, body,
        cc_emails=None, file_content=None, file_type=None,
        file_name=None, disposition='attachment',
        content_id='Content-Disposition'):
    if isinstance(to_emails, str):
        to_emails = str(to_emails).split(",")
    if isinstance(to_emails, tuple):
        to_emails = list(to_emails)
    to_emails = [str(email).lower().strip() for email in to_emails if email.strip()]
    to_emails = list(set(to_emails))
    cc_emails = [str(email).lower().strip() for email in cc_emails if email.strip()]
    cc_emails = list(set(cc_emails))
    [cc_emails.remove(cc) for cc in cc_emails if cc in to_emails]
    subject = reconstruct_subject(subject)
    message = Mail(
        from_email=from_email,
        subject=subject,
        html_content=body)
    p = Personalization()
    [p.add_to(Email(email)) for email in to_emails]
    if cc_emails:
        [p.add_cc(Email(email)) for email in cc_emails if email not in to_emails]
    message.add_personalization(p)

    if file_content is not None:
        encoded = base64.b64decode(file_content)
        attachment = Attachment()
        attachment.file_content = FileContent(encoded)
        attachment.file_type = FileType(file_type)
        attachment.file_name = FileName(file_name)
        attachment.disposition = Disposition(disposition)
        attachment.content_id = ContentId(content_id)
        message.attachment = attachment
    logging.info("from: {} / to: {} / subject: {}".format(message.from_email, to_emails, subject))
    sendgrid_client = SendGridAPIClient(settings.SENDGRID_API_KEY)
    try:
        response = sendgrid_client.send(message)
        logging.info("Email send with status: {}, message:{}".
                     format(response.status_code, response.body))
        return True
    except HTTPError as e:
        error_message = "Error when sending a mail {0}".format(e.to_dict)
        return False
