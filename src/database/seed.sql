INSERT INTO users (full_name, email, password_hash, role)
VALUES
(
  'System Admin',
  'admin@pixelforge.com',
  '$2b$10$KIXx5YcM5cXqH0hQXvYt7eQ9uJZ6qgL6zT3ZtE9yZQzqF8aZcLk2C',
  'ADMIN'
),
(
  'Project Lead',
  'lead@pixelforge.com',
  '$2b$10$KIXx5YcM5cXqH0hQXvYt7eQ9uJZ6qgL6zT3ZtE9yZQzqF8aZcLk2C',
  'PROJECT_LEAD'
),
(
  'Developer One',
  'dev@pixelforge.com',
  '$2b$10$KIXx5YcM5cXqH0hQXvYt7eQ9uJZ6qgL6zT3ZtE9yZQzqF8aZcLk2C',
  'DEVELOPER'
);
