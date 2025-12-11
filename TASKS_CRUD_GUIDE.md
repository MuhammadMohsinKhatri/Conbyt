# Tasks CRUD Operations & Filters Guide

## Overview

The Tasks page at `/cms/tasks` now includes comprehensive CRUD operations, search functionality, and advanced filtering capabilities.

## CRUD Operations

### Create Task

1. **Click "Create Task"** button (top right)
2. **Fill in the form:**
   - **Title** (required) - Task name
   - **Description** (optional) - Detailed task description
   - **Status** - Select from: To Do, In Progress, Review, Done
   - **Priority** - Select from: Low, Medium, High, Urgent
   - **Project** (optional) - Link to existing project
   - **Due Date** (optional) - Set deadline
   - **Assign To** (Admin/Task Manager only) - Select one or more users

3. **Click "Create Task"** to save

### Read/View Tasks

**Two View Modes Available:**

#### Kanban View (Default)
- **4 columns** representing task statuses
- **Task cards** show:
  - Title and description
  - Priority badge
  - Project tag
  - Due date (with overdue indicator)
  - Assigned users (avatar circles)
  - Delete button (if you have permissions)

#### List View
- **Table format** with sortable columns
- Shows all task details in one view
- Better for bulk operations
- Includes:
  - Title & Description
  - Status badge
  - Priority badge
  - Project name
  - Assigned users (with count)
  - Due date
  - Created by
  - Action buttons (Edit/Delete)

**Switch Views:** Use the view toggle buttons (Kanban/List icons) in the header

### Update Task

**Method 1: Click on Task Card (Kanban View)**
- Click any task card to open edit modal
- Modify fields
- Click "Update Task"

**Method 2: Use Edit Button (List View)**
- Click the blue edit icon in the Actions column
- Modify fields
- Click "Update Task"

**Note:** Task Creators can only edit their own tasks or tasks assigned to them.

### Delete Task

**Method 1: Delete Button on Card (Kanban View)**
- Click the red trash icon on the task card
- Confirm deletion

**Method 2: Delete Button in List View**
- Click the red trash icon in the Actions column
- Confirm deletion

**Note:** 
- Task Creators can only delete their own tasks
- Admins and Task Managers can delete any task

## Search Functionality

### Basic Search
- **Search bar** at the top of the page
- **Searches across:**
  - Task title
  - Task description
  - Project name

### How to Use
1. Type in the search box
2. Results filter in real-time
3. Works in both Kanban and List views
4. Clear search by deleting text

## Filters

### Available Filters

Click the **"Filters"** button to show/hide filter panel:

#### 1. Status Filter
- Filter by task status:
  - To Do
  - In Progress
  - Review
  - Done
- **Default:** All Statuses

#### 2. Priority Filter
- Filter by priority level:
  - Low
  - Medium
  - High
  - Urgent
- **Default:** All Priorities

#### 3. Assigned To Filter
- Filter by assigned user
- Options:
  - All Users
  - Unassigned (tasks with no assignees)
  - Specific user (by username/email)
- **Use Case:** Find all tasks assigned to a specific team member

#### 4. Project Filter
- Filter by linked project
- Shows all available projects
- **Default:** All Projects

#### 5. Due Date Range
- **Due Date From:** Filter tasks with due dates on or after this date
- **Due Date To:** Filter tasks with due dates on or before this date
- **Use Case:** Find tasks due this week, month, or overdue

### Using Multiple Filters

Filters work together (AND logic):
- All selected filters must match
- Example: Status="In Progress" + Priority="High" + Assigned="John" = Shows only high priority in-progress tasks assigned to John

### Clear Filters

- Click **"Clear All Filters"** button
- Resets all filters and search term
- Shows all tasks again

## Export Functionality

### Export to CSV
1. Click the **CSV export button** (green icon)
2. Downloads filtered tasks as CSV file
3. Includes all visible columns
4. File name: `tasks_YYYY-MM-DD.csv`

### Export to Excel
1. Click the **Excel export button** (blue icon)
2. Downloads filtered tasks as Excel file
3. Includes all visible columns
4. File name: `tasks_YYYY-MM-DD.xlsx`

**Note:** Exports only include currently filtered/search results

## Filter Badge Indicator

- **Filter button** shows a badge with count of active filters
- Includes search term in count
- Example: "Filters (3)" means 3 filters + search are active

## Results Count

- Shows below filter panel
- Format: "Showing X of Y tasks"
- Updates in real-time as you filter/search

## Quick Tips

### Find Overdue Tasks
1. Set **Due Date To** = Today's date
2. Set **Status** = "To Do" or "In Progress"
3. Results show overdue tasks

### Find My Tasks
1. Set **Assigned To** = Your username
2. View all tasks assigned to you

### Find High Priority Tasks
1. Set **Priority** = "High" or "Urgent"
2. Focus on critical tasks

### Find Unassigned Tasks
1. Set **Assigned To** = "Unassigned"
2. Find tasks that need assignment

### Combine Search + Filters
- Use search for text matching
- Use filters for structured data
- Example: Search "bug" + Filter Status="In Progress" = Find in-progress bug tasks

## Keyboard Shortcuts

- **Click task card** = Edit task
- **Click delete icon** = Delete task (with confirmation)
- **Type in search** = Real-time filtering

## Permissions

### Admin
- ✅ Full CRUD access
- ✅ Can assign tasks to anyone
- ✅ Can filter by any user
- ✅ Can export all data

### Task Manager
- ✅ Full CRUD access
- ✅ Can assign tasks to anyone
- ✅ Can filter by any user
- ✅ Can export all data

### Task Creator
- ✅ Create tasks
- ✅ Edit own tasks or assigned tasks
- ✅ Delete own tasks
- ✅ Can filter by assigned user (limited view)
- ⚠️ Cannot assign tasks to others
- ⚠️ Cannot see all tasks (only own/assigned)

## Troubleshooting

### Tasks Not Showing
1. Check filters - may be too restrictive
2. Check search term - may be filtering out results
3. Check permissions - Task Creators only see own/assigned tasks
4. Click "Clear All Filters"

### Search Not Working
1. Clear search and try again
2. Check spelling
3. Try partial words
4. Search is case-insensitive

### Filters Not Applying
1. Make sure filter panel is open
2. Select a value (not "All...")
3. Check multiple filters aren't conflicting
4. Clear and re-apply filters

### Export Issues
1. Make sure you have tasks visible
2. Check browser download settings
3. Try CSV if Excel doesn't work

## Best Practices

1. **Use List View** for bulk operations
2. **Use Kanban View** for workflow visualization
3. **Save filters** by bookmarking URL (if implemented)
4. **Export regularly** for backups
5. **Use search** for quick text lookup
6. **Use filters** for structured queries
7. **Combine both** for powerful searches

