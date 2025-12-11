# Task Management System Setup Guide

## Overview

A complete project management system has been added to your CMS dashboard, similar to ClickUp boards. The system includes:

- **Kanban-style task board** with status columns (To Do, In Progress, Review, Done)
- **Role-based permissions** with three user roles
- **Task assignment** to multiple users
- **User management** interface for admins

## User Roles

### 1. Admin
- **Full access** to all features
- Can manage all tasks (create, update, delete)
- Can assign tasks to any user
- Can manage user roles and permissions
- Access to user management page

### 2. Task Manager
- Can **create, update, and manage all tasks**
- Can assign tasks to any user
- Can delete any task
- Cannot access user management

### 3. Task Creator
- Can **create tasks**
- Can **update only their own tasks** or tasks assigned to them
- Can delete only their own tasks
- Cannot assign tasks to other users

## Database Setup

### Step 1: Run Migration

Run the migration script to add the necessary tables and columns:

```bash
cd server
node database/migrate-tasks.js
```

This will:
- Add `role` column to `admin_users` table
- Create `tasks` table
- Create `task_assignments` table

### Step 2: Set Initial Admin Role

After migration, set the role for your existing admin user:

```sql
UPDATE admin_users SET role = 'admin' WHERE username = 'your_admin_username';
```

Or via MySQL/phpMyAdmin, update the `role` field to `'admin'` for your main admin account.

## Features

### Task Board (`/cms/tasks`)

- **Kanban View**: Four columns representing task statuses
- **Task Cards**: Display title, description, priority, due date, assigned users, and project
- **Create Task**: Click "Create Task" button (visible to users with create permissions)
- **Edit Task**: Click on any task card to edit
- **Delete Task**: Delete button on task cards (visible to users with delete permissions)
- **Status Updates**: Change task status by editing the task
- **Priority Levels**: Low, Medium, High, Urgent
- **Due Dates**: Visual indicators for overdue tasks
- **User Assignments**: Multiple users can be assigned to a task

### User Management (`/cms/users`)

**Admin Only Access**

- View all users and their roles
- Edit user roles
- See role descriptions and permissions
- Cannot remove the last admin user

## API Endpoints

### Tasks
- `GET /api/admin/tasks` - Get all tasks (filtered by role)
- `GET /api/admin/tasks/:id` - Get single task
- `POST /api/admin/tasks` - Create task
- `PUT /api/admin/tasks/:id` - Update task
- `DELETE /api/admin/tasks/:id` - Delete task
- `GET /api/admin/tasks/users/list` - Get users for assignment

### Users (Admin Only)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get single user
- `PUT /api/admin/users/:id/role` - Update user role

## Task Fields

- **Title** (required)
- **Description** (optional)
- **Status**: todo, in_progress, review, done
- **Priority**: low, medium, high, urgent
- **Project** (optional - links to existing project)
- **Due Date** (optional)
- **Assigned Users** (multiple selection - admin/task_manager only)

## Navigation

The Tasks page is accessible from the CMS Dashboard sidebar. The Users page is only visible to admin users.

## Permissions Summary

| Action | Admin | Task Manager | Task Creator |
|--------|-------|-------------|-------------|
| View all tasks | ✅ | ✅ | Only own/assigned |
| Create tasks | ✅ | ✅ | ✅ |
| Update own tasks | ✅ | ✅ | ✅ |
| Update other tasks | ✅ | ✅ | ❌ |
| Delete own tasks | ✅ | ✅ | ✅ |
| Delete other tasks | ✅ | ✅ | ❌ |
| Assign tasks | ✅ | ✅ | ❌ |
| Manage users | ✅ | ❌ | ❌ |

## Notes

- Tasks are automatically filtered based on user role
- Task creators can only see tasks they created or are assigned to
- Admins and task managers can see all tasks
- The system prevents removing the last admin user
- All task operations respect role-based permissions

## Troubleshooting

### Migration Issues

If the migration fails:
1. Check database connection
2. Ensure you have proper permissions
3. Manually run the SQL from `server/database/schema.sql` (the new tables section)

### Role Not Showing

If user roles aren't working:
1. Ensure migration ran successfully
2. Check that the `role` column exists in `admin_users` table
3. Set a role for your user: `UPDATE admin_users SET role = 'admin' WHERE id = YOUR_ID;`
4. Log out and log back in to refresh the JWT token

### Tasks Not Visible

If tasks aren't showing:
1. Check user role - task creators only see their own tasks
2. Ensure tasks are assigned to the user (if task creator)
3. Check browser console for errors
4. Verify API endpoints are accessible

