import base64
import email
import json
import re
import time

from collections import namedtuple
from datetime import datetime

from apiclient import errors
from gmail_api import get_credentials
from googleapiclient.discovery import build


def get_message_ids(service, query):
    try:
        response = service.users().messages().list(userId='me', q=query).execute()
        messages = response.get('messages', [])

        while 'nextPageToken' in response:
            page_token = response['nextPageToken']
            response = service.users().messages().list(userId='me',
                                                      q=query,
                                                      pageToken=page_token).execute()
            messages.extend(response.get('messages', []))

    except errors.HttpError as error:
        print(f"An error occurred: {error}")
    
    return [msg['id'] for msg in messages]

def discard_message(service, msg_id):
    """
    Returns True if only one recipient and no CCs.
    Exclude messages that involve others.
    """
    message = service.users().messages().get(userId='me',
                                             id=msg_id,
                                             format='metadata').execute()
    to_field = ""
    cc_field = ""
    payload = message.get('payload')
    for header in payload.get('headers', []):
        if header['name'] == 'To':
            to_field = header['value']
        if header['name'] == 'Cc':
            cc_field = header['value']
    
    if not to_field:
        # chats won't have a 'To' field
        print(f"No recipients found for message {msg_id}")
        return False

    # Recipients come in form "First Name <email@email.com>" when encoded.
    # Get email info from inside brackets to determine how many recipients
    recipient_text = to_field + cc_field
    regex = re.compile('<(.*?)>')
    recipients = regex.findall(recipient_text)

    return len(recipients) > 1

def get_mime_message(service, msg_id):
  """Get a Message and use it to create a MIME Message.

  Args:
    service: Authorized Gmail API service instance.
    msg_id: The ID of the Message required.

  Returns:
    A MIME Message, consisting of data from Message.
  """
  try:
    message = service.users().messages().get(userId='me', id=msg_id,
                                             format='raw').execute()

    print(f"Message snippet: {message['snippet']}")

    msg_bytes = base64.urlsafe_b64decode(message['raw'].encode('ASCII'))
    mime_msg = email.message_from_bytes(msg_bytes)

    return mime_msg

  except errors.HttpError as error:
    print(f"an error occurred: {error}")

if __name__ == "__main__":
    creds = get_credentials()
    service = build('gmail', 'v1', credentials=creds)

    # TODO: ask for emails via command line and put into `q`
    q = """
        https://
        after:2019/11/15
    """
    messageIds = get_message_ids(service, q)
    for msg_id in messageIds:
        if discard_message(service, msg_id):
            print(f"discarding message {msg_id}")
            continue

        mime_msg = get_mime_message(service, msg_id)
        print('-------------------')
        print(f"message_body: {mime_msg.as_string()}")
