INSERT INTO radio_play_history (play_date, play_time, artist, title, cover, song_id, stream_id)
VALUES
('2026-07-18', '00:01:38', 'Ed Sheeran [drivemusic.me]', 'Shape Of You', '', '6083520256769491976', '5654'),
('2026-07-18', '00:05:44', 'Amirchik [drivemusic.me]', 'Эта Любовь', '', '16147856841400264324', '5654'),
('2026-07-18', '00:08:18', 'Ваня Дмитриенко', 'Шелк', '', '306779640361526213', '5654'),
('2026-07-18', '00:11:04', 'IOWA feat. Ёлка [drivemusic.me', 'Яблоко', '', '2073345040360105638', '5654'),
('2026-07-18', '00:14:18', 'Harry Styles [drivemusic.me]', 'As It Was', '', '12842293521980727922', '5654')
ON CONFLICT (play_date, play_time, song_id, stream_id) DO NOTHING;