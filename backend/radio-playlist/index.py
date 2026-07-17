import json
import os
import urllib.request
from datetime import datetime, timedelta, timezone

import psycopg2

MSK = timezone(timedelta(hours=3))

STREAM_ID = "5654"
STATUS_URL = f"https://myradio24.org/users/{STREAM_ID}/status.json"


def handler(event: dict, context) -> dict:
    """Получает текущий трек радиостанции Wave FM с MyRadio24, сохраняет историю
    сыгранных треков в БД и отдаёт на фронтенд последние 50 сыгранных треков."""
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
    fresh_tracks = []
    seen = set()
    for item in raw_songs:
        song = item.get('song', '')
        if not song or song.strip().lower().startswith('wave fm'):
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

        fresh_tracks.append({
            'time': item.get('time', ''),
            'artist': artist.strip(),
            'title': title.strip(),
            'cover': cover,
            'song_id': item.get('songid', '')
        })

    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    today = datetime.now(MSK).date()
    playlist = []

    try:
        dsn = os.environ['DATABASE_URL']
        conn = psycopg2.connect(dsn)
        conn.autocommit = True
        cur = conn.cursor()

        for t in fresh_tracks:
            cur.execute(
                f"""
                INSERT INTO "{schema}".radio_play_history (play_date, play_time, artist, title, cover, song_id, stream_id)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (play_date, play_time, song_id, stream_id) DO NOTHING
                """,
                (today, t['time'], t['artist'], t['title'], t['cover'], t['song_id'], STREAM_ID)
            )

        cur.execute(
            f"""
            SELECT play_date, play_time, artist, title, cover
            FROM "{schema}".radio_play_history
            WHERE stream_id = %s
              AND hidden = FALSE
            ORDER BY play_date DESC, play_time DESC
            LIMIT 50
            """,
            (STREAM_ID,)
        )
        rows = cur.fetchall()
        playlist = [
            {'date': str(r[0]), 'time': r[1], 'artist': r[2], 'title': r[3], 'cover': r[4]}
            for r in rows
        ]
        playlist.reverse()
        cur.close()
        conn.close()
    except Exception:
        playlist = fresh_tracks

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