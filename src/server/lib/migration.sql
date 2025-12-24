

CREATE TABLE interactives (
    id SERIAL PRIMARY KEY,
    store_id TEXT NOT NULL,
    image TEXT NOT NULL,
    metadata JSON NOT NULL default '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);