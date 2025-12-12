# Migration Command

## ✅ Run This Command

From your project root directory (`C:\Cursor Projects\Conbyt`), run:

```powershell
cd server
npm run migrate-focus-keyword
```

Or in one line (PowerShell):

```powershell
cd server; npm run migrate-focus-keyword
```

Or if you're using Command Prompt (cmd):

```cmd
cd server && npm run migrate-focus-keyword
```

## Alternative: Direct Node Command

If the npm script doesn't work, you can run it directly:

```powershell
cd server
node database/migrate-focus-keyword.js
```

## What It Does

- Connects to your database using credentials from `.env`
- Adds the `focus_keyword` column to the `blog_posts` table
- Verifies the column was added successfully
- Shows success/error messages

## Requirements

- Make sure your `.env` file in the `server/` directory has correct database credentials:
  ```
  DB_HOST=your_host
  DB_USER=your_user
  DB_PASSWORD=your_password
  DB_NAME=your_database
  ```

## Expected Output

```
🔄 Starting migration: Add focus_keyword column to blog_posts...

📋 Adding focus_keyword column to blog_posts...
✅ focus_keyword column added successfully!

✅ Migration completed successfully!

📋 Summary:
   - focus_keyword column added/verified in blog_posts table

🔄 Please restart your server for changes to take effect.
💡 Focus keywords will now be saved when editing blog posts.
```

If the column already exists, you'll see:
```
ℹ️  focus_keyword column already exists - no changes needed
```

