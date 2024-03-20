import json
import pprint
import urllib.request

from bs4 import BeautifulSoup


def parse_jam_html(jam_tag):
    jam_title_tag = jam_tag.find('div', {'class': 'primary_info'})
    jam_id = jam_title_tag.find('a').attrs['href'].replace('/jam/', '')
    jam_name = jam_title_tag.text

    # Split drops ' joined' and any submissions
    participants_str = jam_tag.find('div', {'class': 'jam_stats'}).text.split(' joined')[0].replace(',', '')
    participants_count = int(participants_str) if participants_str != '' else 0

    return {
        'jamId': jam_id,
        'name': jam_name,
        'participants': participants_count,
        'start': jam_tag.find('span', {'class': 'date_countdown'}).text,
        'duration': jam_tag.find('span', {'class': 'date_duration'}).text,
        'styles': {}
    }


upcoming_jams = []

for page_idx in range(1, 4):

    contents = urllib.request.urlopen('https://itch.io/jams/upcoming?page=' + str(page_idx)).read()
    page = BeautifulSoup(contents, features='lxml')

    jams = page.find_all('div', {'class': 'jam'})
    parsed_jams = [parse_jam_html(jam) for jam in jams]
    upcoming_jams = upcoming_jams + parsed_jams

with open('jams.json', 'w') as f:
    json.dump(upcoming_jams, f, indent=4)

pprint.pprint(upcoming_jams)
