import json
import re

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
            response = (
                service.users()
                .messages()
                .list(userId='me', q=query, pageToken=page_token)
                .execute()
            )
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
        r"http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+",
        message_text,
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
            data[found_category] = []

        category = data[found_category]
        category.append(
            {
                'from': get_email_addresses(message_from)[0],
                'message_id': message_id,
                'timestamp': message['internalDate'],
                'url': url,
            }
        )
        data[found_category] = category

    return data


def run():
    creds = get_credentials()
    service = build('gmail', 'v1', credentials=creds)

    email = input("Enter email of person you'd like to find sent links with:\n> ")
    filename = input("new filename? Blank will create or append to all_links.json:\n> ")
    filename = filename or "links"
    start_date = None

    try:
        with open(f"src/data/{filename}.json", "r") as jsonFile:
            data = json.load(jsonFile)
    except (FileNotFoundError, json.decoder.JSONDecodeError):
        print(f"\nLinks with {email} have not been found yet. Starting fresh!\n")
        data = {}

    if data.get("last_updated"):
        readable = datetime.fromtimestamp(int(data["last_updated"])).strftime("%Y/%m/%d")
        print(
            f"\nLinks were last updated on {readable} - start from here? If no, you will be prompted to enter start date."
        )
        start_answer = input("yes/no\n> ")
        if start_answer in ["yes", "Yes", "y", "Y"]:
            start_date = readable

    if not data.get("last_updated") or not start_date:
        start_date = input(
            "Start date? Omitting this value starts search at beginning of time. YYYY/MM/DD.\n> "
        )
    start_date = f"after:{start_date}" if start_date else ""

    end_date = input(
        "End date? Skipping this will search up to most recent messages. YYYY/MM/DD.\n> "
    )
    end_date = f"before:{end_date}" if end_date else ""

    q = f"{email} label:chats (https:// || http://) {start_date} {end_date}"
    print(f"Here's what your gmail search looks like:\n'{q}'\n")

    messageIds = get_message_ids(service, q)
    for msg_id in messageIds:
        message = _get_message(service, msg_id)
        data = add_urls_to_data(data, message)

    now = datetime.now()
    data["last_updated"] = now.strftime("%s")

    with open(f"src/data/{filename}.json", "w+") as jsonFile:
        json.dump(data, jsonFile)


if __name__ == "__main__":
    run()
