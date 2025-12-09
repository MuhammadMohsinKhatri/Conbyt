-- Migration script to add missing columns to blog_posts table
-- Run this SQL directly on your production database

-- Add author_name column if it doesn't exist
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS author_name VARCHAR(100) AFTER category;

-- Add author_avatar column if it doesn't exist
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS author_avatar VARCHAR(500) AFTER author_name;

-- Add read_time column if it doesn't exist (in case it's missing)
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS read_time INT AFTER date;

-- Note: If your MySQL version doesn't support "IF NOT EXISTS" for ALTER TABLE,
-- use this version instead (check if column exists first):

-- Check and add author_name
-- SET @dbname = DATABASE();
-- SET @tablename = 'blog_posts';
-- SET @columnname = 'author_name';
-- SET @preparedStatement = (SELECT IF(
--   (
--     SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
--     WHERE
--       (table_name = @tablename)
--       AND (table_schema = @dbname)
--       AND (column_name = @columnname)
--   ) > 0,
--   "SELECT 'Column already exists.'",
--   CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname, " VARCHAR(100) AFTER category")
-- ));
-- PREPARE alterIfNotExists FROM @preparedStatement;
-- EXECUTE alterIfNotExists;
-- DEALLOCATE PREPARE alterIfNotExists;

