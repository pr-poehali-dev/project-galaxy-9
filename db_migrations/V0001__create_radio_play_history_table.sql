CREATE TABLE IF NOT EXISTS radio_play_history (
    id SERIAL PRIMARY KEY,
    play_date DATE NOT NULL,
    play_time VARCHAR(8) NOT NULL,
    artist TEXT,
    title TEXT,
    cover TEXT,
    song_id TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (play_date, play_time, song_id)
);

CREATE INDEX IF NOT EXISTS idx_radio_play_history_date ON radio_play_history (play_date);
