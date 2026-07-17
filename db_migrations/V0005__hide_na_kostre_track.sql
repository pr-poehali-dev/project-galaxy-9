UPDATE radio_play_history
SET hidden = TRUE
WHERE title = 'На костре'
  AND play_date = CURRENT_DATE;