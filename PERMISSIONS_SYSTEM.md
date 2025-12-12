# Section-Based Permission System

## Overview

The CMS now includes a comprehensive section-based permission system that allows admins to grant granular access to different sections of the CMS with specific permissions (View, Create, Edit, Delete).

## Features

### 1. **Section-Based Access Control**
   - **Tasks**: Task Management
   - **Projects**: Project Management
   - **Clients**: Client Management
   - **Portfolios**: Portfolio Management
   - **Blogs**: Blog Management
   - **Payments**: Payment Management
   - **Milestones**: Milestone Management
   - **Users**: User Management (Admin Only)

### 2. **Granular Permissions**
   Each section can have one or more of the following permissions:
   - **View**: Can view/list items
   - **Create**: Can create new items
   - **Edit**: Can modify existing items
   - **Delete**: Can delete items
   - **All**: All of the above (can be selected with one click)

### 3. **Flexible Assignment**
   - Users can have access to one or multiple sections
   - Each section can have different permission levels
   - Permissions are independent per section
   - Example: User can have "View + Create" for Tasks, but "All" for Blogs

## Database Schema

### New Table: `user_permissions`
```sql
CREATE TABLE user_permissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  section VARCHAR(50) NOT NULL,
  permissions JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_section (user_id, section)
);
```

## API Endpoints

### Get All Users with Permissions
```
GET /api/admin/users
```
Returns all users with their permissions included.

### Update User Permissions
```
PUT /api/admin/users/:id/permissions
Body: {
  permissions: {
    "tasks": ["view", "create", "edit"],
    "blogs": ["view", "create", "edit", "delete"],
    "projects": ["view"]
  }
}
```

### Delete Section Permissions
```
DELETE /api/admin/users/:id/permissions/:section
```

## Usage

### For Admins

1. **Access User Management**
   - Navigate to `/cms/users`
   - Only admins can access this page

2. **Manage Permissions**
   - Click the "Permissions" button next to any user (except admins)
   - Select one or more sections
   - Choose permissions for each section:
     - Click individual permissions (View, Create, Edit, Delete)
     - Or click "Select All" to grant all permissions for a section
   - Click "Save Permissions"

3. **Edit User Role**
   - Click the edit icon next to a user's role
   - Select a new role (Admin, Task Manager, Task Creator)
   - Save changes

### Permission Examples

**Example 1: Content Editor**
- Sections: Blogs, Portfolios
- Permissions:
  - Blogs: View, Create, Edit
  - Portfolios: View, Create, Edit, Delete

**Example 2: Task Manager**
- Sections: Tasks, Projects, Milestones
- Permissions:
  - Tasks: All
  - Projects: View, Create, Edit
  - Milestones: View, Create

**Example 3: Read-Only User**
- Sections: Tasks, Projects, Clients
- Permissions:
  - All sections: View only

## Important Notes

1. **Admin Users**: Admins automatically have full access to all sections. No custom permissions are needed or can be set for admin users.

2. **User Management Section**: Only admins can grant access to the "Users" section. This ensures only trusted users can manage other users.

3. **Role vs Permissions**: 
   - **Role** (Admin, Task Manager, Task Creator) is a legacy system that provides basic access
   - **Permissions** provide granular, section-based control
   - Both systems can coexist, but permissions take precedence for non-admin users

4. **Migration**: If you have an existing database, run the migration script:
   ```sql
   -- Run: server/database/migrations/add_user_permissions.sql
   ```

## Frontend Components

### PermissionManager Component
Located at: `src/components/CMS/PermissionManager.jsx`

A modal component that provides:
- Visual section selection
- Permission toggles for each section
- "Select All" functionality
- Admin-only section protection

### Users Page
Located at: `src/pages/CMS/Users.jsx`

Updated to show:
- User list with permissions summary
- Permission management buttons
- Role editing
- Visual permission badges

## Security Considerations

1. **Admin-Only Access**: Only users with `role = 'admin'` can:
   - Access the user management page
   - Modify permissions
   - Grant access to the "Users" section

2. **Permission Validation**: Backend validates all permission changes and ensures only admins can modify permissions.

3. **Cascade Deletion**: When a user is deleted, all their permissions are automatically removed.

## Future Enhancements

Potential improvements:
- Permission templates/presets
- Bulk permission assignment
- Permission inheritance
- Time-based permissions
- Audit log for permission changes

