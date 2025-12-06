import express from 'express';
import pool from '../../config/database.js';
import { authenticateAdmin } from '../../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateAdmin);

// Get all payments with project information
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT p.*, pr.title as project_title, pr.client_id,
       c.name as client_name, c.company as client_company,
       m.title as milestone_title
       FROM payments p
       LEFT JOIN projects pr ON p.project_id = pr.id
       LEFT JOIN clients c ON pr.client_id = c.id
       LEFT JOIN milestones m ON p.milestone_id = m.id
       ORDER BY p.created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// Get payments for a specific project
router.get('/project/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const [rows] = await pool.execute(
      `SELECT p.*, m.title as milestone_title
       FROM payments p
       LEFT JOIN milestones m ON p.milestone_id = m.id
       WHERE p.project_id = ?
       ORDER BY p.payment_date DESC, p.created_at DESC`,
      [projectId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching project payments:', error);
    res.status(500).json({ error: 'Failed to fetch project payments' });
  }
});

// Get single payment by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      `SELECT p.*, pr.title as project_title, m.title as milestone_title
       FROM payments p
       LEFT JOIN projects pr ON p.project_id = pr.id
       LEFT JOIN milestones m ON p.milestone_id = m.id
       WHERE p.id = ?`,
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
});

// Create new payment
router.post('/', async (req, res) => {
  try {
    const {
      project_id,
      milestone_id,
      amount,
      payment_date,
      payment_method,
      status,
      invoice_number,
      notes
    } = req.body;

    if (!project_id || !amount) {
      return res.status(400).json({ error: 'Project ID and amount are required' });
    }

    const [result] = await pool.execute(
      `INSERT INTO payments (project_id, milestone_id, amount, payment_date, payment_method, status, invoice_number, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        project_id,
        milestone_id || null,
        amount,
        payment_date || null,
        payment_method || null,
        status || 'pending',
        invoice_number || null,
        notes || null
      ]
    );

    res.status(201).json({ 
      success: true, 
      id: result.insertId,
      message: 'Payment created successfully'
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

// Update payment
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      project_id,
      milestone_id,
      amount,
      payment_date,
      payment_method,
      status,
      invoice_number,
      notes
    } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    await pool.execute(
      `UPDATE payments SET
        project_id = ?, milestone_id = ?, amount = ?, payment_date = ?,
        payment_method = ?, status = ?, invoice_number = ?, notes = ?
      WHERE id = ?`,
      [
        project_id,
        milestone_id || null,
        amount,
        payment_date || null,
        payment_method || null,
        status || 'pending',
        invoice_number || null,
        notes || null,
        id
      ]
    );

    res.json({ success: true, message: 'Payment updated successfully' });
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({ error: 'Failed to update payment' });
  }
});

// Delete payment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM payments WHERE id = ?', [id]);
    res.json({ success: true, message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ error: 'Failed to delete payment' });
  }
});

export default router;

