CREATE TABLE knowledge (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT,
    level_id INT,
    name VARCHAR(255),
    weight INT,
    FOREIGN KEY(role_id) REFERENCES role(id)
);
