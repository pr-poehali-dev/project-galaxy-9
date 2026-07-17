ALTER TABLE radio_play_history ADD COLUMN IF NOT EXISTS hidden BOOLEAN NOT NULL DEFAULT FALSE;

UPDATE radio_play_history
SET hidden = TRUE
WHERE play_date = '2026-07-17'
  AND play_time >= '21:20:00'
  AND play_time <= '23:58:00';