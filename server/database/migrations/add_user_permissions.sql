-- Migration: Add user_permissions table for section-based permissions
-- Run this if you already have an existing database

-- User Permissions Table (Section-based permissions)
CREATE TABLE IF NOT EXISTS user_permissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  section VARCHAR(50) NOT NULL,
  permissions JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_section (user_id, section),
  INDEX idx_user_id (user_id),
  INDEX idx_section (section)
);

