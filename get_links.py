import base64
import email
import json
import re

from collections import namedtuple
from datetime import datetime

from apiclient import errors
from gmail_api import get_credentials
from googleapiclient.discovery import build

CATEGORY_TO_REGEX = {
    'youtube': 'youtube.com|youtu.be',
    'twitter': 'twitter.com',
    'news': 'nytimes.com|nyti.me|npr.org|washingtonpost.com|theatlantic.com',
    'facebook': 'facebook.com',
    'images': 'imgur.com|photos.app.goo.gl|.jpg|.png|.gifv|.gif',
    'reddit': 'reddit.com',
}

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

def _get_message(service, msg_id):
    """For chats, the message snippet contains the entire message.
    No need to decode the raw message.

    Args:
        service: Authorized Gmail API service instance.
        msg_id: The ID of the Message required.

    Returns:
        string: text of the message
    """
    try:
        message = service.users().messages().get(userId='me', id=msg_id).execute()
        return message
    except errors.HttpError as error:
        print(f"an error occurred: {error}")

def get_links(message_text):
    urls = re.findall(
        "http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+",
        message_text
    )
    return urls

def get_email_addresses(text):
    """
    Message recipients come in as "First Last <firstlast@email.com>"
    Returns email string "firstlast@email.com"
    """
    regex = re.compile('<(.*?)>')
    recipients = regex.findall(text)

    return recipients

def add_urls_to_data(data, message):
    """
    Given a GMail Message, add any links found in the text to data object
    Returns data - json object of links organized by category
    """
    message_id = message['id']
    for message_header in message['payload']['headers']:
        if message_header['name'] == 'From':
            message_from = message_header['value']
            break

    urls = get_links(message['snippet'])
    for url in urls:
        print(f"{message['id']}: {url}")
        found_category = None
        for category, regex in CATEGORY_TO_REGEX.items():
            if len(re.findall(regex, url)):
                found_category = category
                break

        if not found_category:
            found_category = 'other'

        if found_category not in data:
            data[found_category] = {}

        data[found_category][message_id] = {
            'url': url,
            'timestamp': message['internalDate'],
            'from': get_email_addresses(message_from)[0]
        }

    return data

if __name__ == "__main__":
    creds = get_credentials()
    service = build('gmail', 'v1', credentials=creds)

    with open("links.json", "r") as jsonFile:
        data = json.load(jsonFile)

    # TODO: ask for emails via command line and put into `q`
    # TODO: set after date in query based on last time script was run
    q = """
        label:chats
        https://
        after:2019/01/5
    """
    messageIds = get_message_ids(service, q)
    for msg_id in messageIds:
        message = _get_message(service, msg_id)
        data = add_urls_to_data(data, message)

    now = datetime.now()
    data["last_updated"] = now.strftime("%s")

    with open("links.json", "w") as jsonFile:
        json.dump(data, jsonFile)
