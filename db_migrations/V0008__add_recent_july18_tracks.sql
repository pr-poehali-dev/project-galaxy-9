INSERT INTO radio_play_history (play_date, play_time, artist, title, cover, song_id, stream_id)
VALUES
('2026-07-18', '01:10:38', 'Винтаж', 'Родные Люди', '', 'vintazh-rodnye-lyudi-20260718-011038', '5654'),
('2026-07-18', '01:14:26', 'Holy Molly', 'Talk To You Later', '', 'holy-molly-talk-to-you-later-20260718-011426', '5654'),
('2026-07-18', '01:17:21', 'Onerepublic', 'Give Me Something', '', 'onerepublic-give-me-something-20260718-011721', '5654')
ON CONFLICT (play_date, play_time, song_id, stream_id) DO NOTHING;