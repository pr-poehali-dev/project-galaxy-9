UPDATE radio_play_history
SET hidden = TRUE
WHERE play_date = '2026-07-18'
  AND play_time >= '21:00:00'
  AND play_time <= '23:59:59';

INSERT INTO radio_play_history (play_date, play_time, artist, title, cover, song_id, stream_id)
VALUES
('2026-07-18', '00:47:21', 'WITH U, Merlin', 'How Deep Is Your Love', '', '8773480813545239658', '5654'),
('2026-07-18', '00:50:55', 'Dj Smash', 'D''or - Розовый Туман', '', 'dj-smash-rozovyi-tuman', '5654'),
('2026-07-18', '00:54:15', 'Ariana Grande [drivemusic.me]', '7 Rings', '', 'ariana-grande-7-rings', '5654')
ON CONFLICT (play_date, play_time, song_id, stream_id) DO NOTHING;