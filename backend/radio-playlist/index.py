import json
import urllib.request

STATUS_URL = "https://myradio24.org/users/19486/status.json"


def handler(event: dict, context) -> dict:
    """Получает историю треков радиостанции Wave FM с MyRadio24 и отдаёт на фронтенд."""
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    }

    try:
        req = urllib.request.Request(STATUS_URL, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
    except Exception as e:
        return {
            'statusCode': 502,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }

    raw_songs = data.get('songs', [])
    playlist = []
    seen = set()
    for item in raw_songs:
        song = item.get('song', '')
        if not song or song.strip().lower() == 'wave fm':
            continue
        key = (song, item.get('time'))
        if key in seen:
            continue
        seen.add(key)

        if ' - ' in song:
            artist, title = song.split(' - ', 1)
        else:
            artist, title = '', song

        img = item.get('img', '')
        cover = f"https://myradio24.org/{img}" if img and img != 'img/nocover.jpg' else ''

        playlist.append({
            'time': item.get('time', ''),
            'artist': artist.strip(),
            'title': title.strip(),
            'cover': cover
        })

    result = {
        'current': {
            'artist': data.get('artist', ''),
            'title': data.get('songtitle', ''),
            'cover': f"https://myradio24.org/{data.get('imgbig', '')}" if data.get('imgbig') else ''
        },
        'playlist': playlist
    }

    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps(result, ensure_ascii=False)
    }
