import express from 'express';
import pool from '../../config/database.js';
import { authenticateAdmin, canManageAllTasks, canCreateTasks, canUpdateOwnTasks } from '../../middleware/auth.js';

const router = express.Router();

// Get all tasks (with role-based filtering)
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role || 'task_creator';
    
    let query = `
      SELECT 
        t.*,
        t.created_by as created_by_id,
        creator.username as created_by_username,
        creator.email as created_by_email,
        p.title as project_title,
        GROUP_CONCAT(
          DISTINCT CONCAT(assignee.id, ':', assignee.username, ':', assignee.email)
          SEPARATOR '||'
        ) as assigned_users
      FROM tasks t
      LEFT JOIN admin_users creator ON t.created_by = creator.id
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN task_assignments ta ON t.id = ta.task_id
      LEFT JOIN admin_users assignee ON ta.user_id = assignee.id
    `;
    
    const conditions = [];
    const params = [];
    
    // Role-based filtering
    if (userRole === 'task_creator') {
      // Task creators can only see tasks they created or are assigned to
      query += ` WHERE (t.created_by = ? OR EXISTS (
        SELECT 1 FROM task_assignments ta2 WHERE ta2.task_id = t.id AND ta2.user_id = ?
      ))`;
      params.push(userId, userId);
    } else {
      // Admin and task_manager can see all tasks
      query += ` WHERE 1=1`;
    }
    
    query += ` GROUP BY t.id ORDER BY t.order_index ASC, t.created_at DESC`;
    
    const [tasks] = await pool.execute(query, params);
    
    // Parse assigned users
    const tasksWithAssignments = tasks.map(task => {
      const assignedUsers = task.assigned_users ? task.assigned_users.split('||').map(userStr => {
        const [id, username, email] = userStr.split(':');
        return { id: parseInt(id), username, email };
      }) : [];
      
      return {
        ...task,
        assigned_users: assignedUsers,
        created_by: {
          id: task.created_by_id,
          username: task.created_by_username,
          email: task.created_by_email
        }
      };
    });
    
    res.json(tasksWithAssignments);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Get single task
router.get('/:id', authenticateAdmin, async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role || 'task_creator';
    
    const [tasks] = await pool.execute(
      `SELECT 
        t.*,
        t.created_by as created_by_id,
        creator.username as created_by_username,
        creator.email as created_by_email,
        p.title as project_title
      FROM tasks t
      LEFT JOIN admin_users creator ON t.created_by = creator.id
      LEFT JOIN projects p ON t.project_id = p.id
      WHERE t.id = ?`,
      [taskId]
    );
    
    if (tasks.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const task = tasks[0];
    
    // Check permissions
    if (userRole === 'task_creator' && task.created_by_id !== userId) {
      // Check if user is assigned to this task
      const [assignments] = await pool.execute(
        'SELECT * FROM task_assignments WHERE task_id = ? AND user_id = ?',
        [taskId, userId]
      );
      
      if (assignments.length === 0) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }
    
    // Get assigned users
    const [assignments] = await pool.execute(
      `SELECT 
        ta.*,
        u.id as user_id,
        u.username,
        u.email
      FROM task_assignments ta
      JOIN admin_users u ON ta.user_id = u.id
      WHERE ta.task_id = ?`,
      [taskId]
    );
    
    res.json({
      ...task,
      assigned_users: assignments.map(a => ({
        id: a.user_id,
        username: a.username,
        email: a.email
      })),
      created_by: {
        id: task.created_by_id,
        username: task.created_by_username,
        email: task.created_by_email
      }
    });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// Create task
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    if (!canCreateTasks(req.user)) {
      return res.status(403).json({ error: 'Insufficient permissions to create tasks' });
    }
    
    const { title, description, status, priority, project_id, due_date, assigned_user_ids } = req.body;
    const userId = req.user.id;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    // Get max order_index for the status
    const [maxOrder] = await pool.execute(
      'SELECT COALESCE(MAX(order_index), 0) as max_order FROM tasks WHERE status = ?',
      [status || 'todo']
    );
    const orderIndex = (maxOrder[0]?.max_order || 0) + 1;
    
    const [result] = await pool.execute(
      `INSERT INTO tasks (title, description, status, priority, project_id, created_by, due_date, order_index)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description || null,
        status || 'todo',
        priority || 'medium',
        project_id || null,
        userId,
        due_date || null,
        orderIndex
      ]
    );
    
    const taskId = result.insertId;
    
    // Assign users if provided
    if (assigned_user_ids && Array.isArray(assigned_user_ids) && assigned_user_ids.length > 0) {
      for (const assignedUserId of assigned_user_ids) {
        await pool.execute(
          'INSERT INTO task_assignments (task_id, user_id) VALUES (?, ?)',
          [taskId, assignedUserId]
        );
      }
    }
    
    // Fetch the created task with all details
    const [tasks] = await pool.execute(
      `SELECT 
        t.*,
        t.created_by as created_by_id,
        creator.username as created_by_username,
        creator.email as created_by_email,
        p.title as project_title
      FROM tasks t
      LEFT JOIN admin_users creator ON t.created_by = creator.id
      LEFT JOIN projects p ON t.project_id = p.id
      WHERE t.id = ?`,
      [taskId]
    );
    
    const [assignments] = await pool.execute(
      `SELECT 
        ta.*,
        u.id as user_id,
        u.username,
        u.email
      FROM task_assignments ta
      JOIN admin_users u ON ta.user_id = u.id
      WHERE ta.task_id = ?`,
      [taskId]
    );
    
    res.status(201).json({
      ...tasks[0],
      assigned_users: assignments.map(a => ({
        id: a.user_id,
        username: a.username,
        email: a.email
      })),
      created_by: {
        id: tasks[0].created_by_id,
        username: tasks[0].created_by_username,
        email: tasks[0].created_by_email
      }
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update task
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role || 'task_creator';
    
    // Check if task exists and get creator
    const [tasks] = await pool.execute(
      'SELECT * FROM tasks WHERE id = ?',
      [taskId]
    );
    
    if (tasks.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const task = tasks[0];
    
    // Check permissions
    if (userRole === 'task_creator') {
      // Task creators can only update their own tasks or tasks they're assigned to
      if (task.created_by !== userId) {
        const [assignments] = await pool.execute(
          'SELECT * FROM task_assignments WHERE task_id = ? AND user_id = ?',
          [taskId, userId]
        );
        
        if (assignments.length === 0) {
          return res.status(403).json({ error: 'You can only update your own tasks or tasks assigned to you' });
        }
      }
    }
    
    if (!canUpdateOwnTasks(req.user)) {
      return res.status(403).json({ error: 'Insufficient permissions to update tasks' });
    }
    
    const { title, description, status, priority, project_id, due_date, assigned_user_ids, order_index } = req.body;
    
    // Build update query dynamically
    const updates = [];
    const params = [];
    
    if (title !== undefined) {
      updates.push('title = ?');
      params.push(title);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
      
      // If status changed, update completed_at
      if (status === 'done') {
        updates.push('completed_at = NOW()');
      } else {
        updates.push('completed_at = NULL');
      }
    }
    if (priority !== undefined) {
      updates.push('priority = ?');
      params.push(priority);
    }
    if (project_id !== undefined) {
      updates.push('project_id = ?');
      params.push(project_id);
    }
    if (due_date !== undefined) {
      updates.push('due_date = ?');
      params.push(due_date);
    }
    if (order_index !== undefined) {
      updates.push('order_index = ?');
      params.push(order_index);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    params.push(taskId);
    await pool.execute(
      `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`,
      params
    );
    
    // Update assignments if provided
    if (assigned_user_ids !== undefined) {
      // Delete existing assignments
      await pool.execute('DELETE FROM task_assignments WHERE task_id = ?', [taskId]);
      
      // Add new assignments
      if (Array.isArray(assigned_user_ids) && assigned_user_ids.length > 0) {
        for (const assignedUserId of assigned_user_ids) {
          await pool.execute(
            'INSERT INTO task_assignments (task_id, user_id) VALUES (?, ?)',
            [taskId, assignedUserId]
          );
        }
      }
    }
    
    // Fetch updated task
    const [updatedTasks] = await pool.execute(
      `SELECT 
        t.*,
        t.created_by as created_by_id,
        creator.username as created_by_username,
        creator.email as created_by_email,
        p.title as project_title
      FROM tasks t
      LEFT JOIN admin_users creator ON t.created_by = creator.id
      LEFT JOIN projects p ON t.project_id = p.id
      WHERE t.id = ?`,
      [taskId]
    );
    
    const [assignments] = await pool.execute(
      `SELECT 
        ta.*,
        u.id as user_id,
        u.username,
        u.email
      FROM task_assignments ta
      JOIN admin_users u ON ta.user_id = u.id
      WHERE ta.task_id = ?`,
      [taskId]
    );
    
    res.json({
      ...updatedTasks[0],
      assigned_users: assignments.map(a => ({
        id: a.user_id,
        username: a.username,
        email: a.email
      })),
      created_by: {
        id: updatedTasks[0].created_by_id,
        username: updatedTasks[0].created_by_username,
        email: updatedTasks[0].created_by_email
      }
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete task
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role || 'task_creator';
    
    // Check if task exists
    const [tasks] = await pool.execute(
      'SELECT * FROM tasks WHERE id = ?',
      [taskId]
    );
    
    if (tasks.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const task = tasks[0];
    
    // Only admin and task_manager can delete tasks, or task creators can delete their own
    if (userRole === 'task_creator' && task.created_by !== userId) {
      return res.status(403).json({ error: 'You can only delete your own tasks' });
    }
    
    if (!canManageAllTasks(req.user) && task.created_by !== userId) {
      return res.status(403).json({ error: 'Insufficient permissions to delete this task' });
    }
    
    await pool.execute('DELETE FROM tasks WHERE id = ?', [taskId]);
    
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Get all users for assignment dropdown
router.get('/users/list', authenticateAdmin, async (req, res) => {
  try {
    // Check if role column exists, if not select without it
    let users;
    try {
      [users] = await pool.execute(
        'SELECT id, username, email, role FROM admin_users ORDER BY username ASC'
      );
    } catch (error) {
      if (error.code === 'ER_BAD_FIELD_ERROR' || error.errno === 1054) {
        // Role column doesn't exist, select without it
        [users] = await pool.execute(
          'SELECT id, username, email FROM admin_users ORDER BY username ASC'
        );
        // Add default role
        users = users.map(u => ({ ...u, role: 'task_creator' }));
      } else {
        throw error;
      }
    }
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;

