CREATE TABLE IF NOT EXISTS habit_dates (
    date_id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    percentage INTEGER, 
    date_added TIMESTAMP DEFAULT now() NOT NULL
);

ALTER TABLE IF EXISTS habit_dates
  ADD COLUMN
    habit_id INTEGER REFERENCES habits(habit_id)
    ON DELETE SET NULL;
