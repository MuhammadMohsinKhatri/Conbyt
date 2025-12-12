-- Migration: Add focus_keyword column to blog_posts table
-- Run this if you already have an existing database
-- 
-- IMPORTANT: Run this SQL in phpMyAdmin or MySQL command line, NOT with Python!
--
-- Instructions:
-- 1. Open phpMyAdmin in your Hostinger control panel
-- 2. Select your database: u808116186_conbyt_db
-- 3. Click the "SQL" tab
-- 4. Paste the SQL below and click "Go"

ALTER TABLE blog_posts 
ADD COLUMN focus_keyword VARCHAR(255) NULL AFTER meta_keywords;

-- If you get an error that the column already exists, that's okay - it means it's already added!

