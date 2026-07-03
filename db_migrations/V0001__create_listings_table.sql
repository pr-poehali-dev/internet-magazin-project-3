CREATE TABLE IF NOT EXISTS listings (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    image TEXT,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    condition VARCHAR(20) NOT NULL DEFAULT 'Новое',
    seller VARCHAR(255) NOT NULL DEFAULT 'Пользователь',
    in_stock BOOLEAN NOT NULL DEFAULT TRUE,
    views INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);