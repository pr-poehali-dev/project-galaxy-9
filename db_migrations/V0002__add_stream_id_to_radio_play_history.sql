ALTER TABLE radio_play_history ADD COLUMN IF NOT EXISTS stream_id VARCHAR(20) NOT NULL DEFAULT '19486';

ALTER TABLE radio_play_history DROP CONSTRAINT IF EXISTS radio_play_history_play_date_play_time_song_id_key;

ALTER TABLE radio_play_history ADD CONSTRAINT radio_play_history_unique UNIQUE (play_date, play_time, song_id, stream_id);
