-- Banco: recipes_db

CREATE TABLE IF NOT EXISTS recipes (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT,
    cook_time_minutes INT,
    difficulty TEXT,
    rating INT CHECK (rating BETWEEN 0 AND 5),
    instructions TEXT
);
