INSERT INTO users (email, password_hash) VALUES ('demo@example.com', 'nopass')
ON DUPLICATE KEY UPDATE email = VALUES(email);
INSERT INTO categories (user_id, name) VALUES (1,'Food'), (1,'Transport'), (1,'Bills'), (1,'Shopping');
INSERT INTO expenses (user_id, category_id, amount, method, note, spent_at) VALUES
 (1,1,120,'Cash','Lunch','2025-09-01'),
 (1,2,45,'QR','BTS','2025-09-02'),
 (1,3,890,'Card','Internet','2025-09-05');
