CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_number INT NOT NULL,
    items TEXT NOT NULL,
    completed TINYINT(1) DEFAULT 0,
    order_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);