import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaSignOutAlt, FaDollarSign, FaArrowLeft } from 'react-icons/fa';
import { fetchAdminPayments, fetchAdminProjects, fetchAdminMilestones, deleteAdminPayment, createAdminPayment, updateAdminPayment } from '../../utils/api.js';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [formData, setFormData] = useState({
    project_id: '',
    milestone_id: '',
    amount: '',
    payment_date: '',
    payment_method: '',
    status: 'pending',
    invoice_number: '',
    notes: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('cms_token');
    if (!token) {
      navigate('/cms/login');
      return;
    }
    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (formData.project_id) {
      fetchMilestonesForProject();
    } else {
      setMilestones([]);
    }
  }, [formData.project_id]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('cms_token');
      const [paymentsData, projectsData] = await Promise.all([
        fetchAdminPayments(token),
        fetchAdminProjects(token)
      ]);
      setPayments(paymentsData);
      setProjects(projectsData);
    } catch (error) {
      if (error.message.includes('401') || error.message.includes('Token')) {
        localStorage.removeItem('cms_token');
        localStorage.removeItem('cms_user');
        navigate('/cms/login');
        return;
      }
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const fetchMilestonesForProject = async () => {
    if (!formData.project_id) return;
    try {
      const token = localStorage.getItem('cms_token');
      const { fetchAdminMilestones } = await import('../../utils/api.js');
      const data = await fetchAdminMilestones(formData.project_id, token);
      setMilestones(data);
    } catch (error) {
      console.error('Failed to fetch milestones:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this payment?')) {
      return;
    }

    try {
      const token = localStorage.getItem('cms_token');
      await deleteAdminPayment(id, token);
      setPayments(payments.filter(payment => payment.id !== id));
    } catch (error) {
      alert('Error deleting payment: ' + error.message);
    }
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setFormData({
      project_id: payment.project_id?.toString() || '',
      milestone_id: payment.milestone_id?.toString() || '',
      amount: payment.amount?.toString() || '',
      payment_date: payment.payment_date || '',
      payment_method: payment.payment_method || '',
      status: payment.status || 'pending',
      invoice_number: payment.invoice_number || '',
      notes: payment.notes || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('cms_token');
      const submitData = {
        ...formData,
        project_id: parseInt(formData.project_id),
        milestone_id: formData.milestone_id ? parseInt(formData.milestone_id) : null,
        amount: parseFloat(formData.amount)
      };
      
      if (editingPayment) {
        await updateAdminPayment(editingPayment.id, submitData, token);
      } else {
        await createAdminPayment(submitData, token);
      }
      
      setShowModal(false);
      setEditingPayment(null);
      setFormData({
        project_id: '',
        milestone_id: '',
        amount: '',
        payment_date: '',
        payment_method: '',
        status: 'pending',
        invoice_number: '',
        notes: ''
      });
      fetchData();
    } catch (error) {
      alert('Error saving payment: ' + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('cms_token');
    localStorage.removeItem('cms_user');
    navigate('/cms/login');
  };

  const totalAmount = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  const pendingAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      <header className="bg-surface border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              to="/cms/dashboard"
              className="p-2 hover:bg-secondary/50 rounded-lg transition"
            >
              <FaArrowLeft className="text-white" />
            </Link>
            <div className="flex items-center gap-3">
              <FaDollarSign className="text-accent text-2xl" />
              <h1 className="text-2xl font-bold text-white">Payments Management</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditingPayment(null);
                setFormData({
                  project_id: '',
                  milestone_id: '',
                  amount: '',
                  payment_date: '',
                  payment_method: '',
                  status: 'pending',
                  invoice_number: '',
                  notes: ''
                });
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent to-accent2 text-white font-bold rounded-lg hover:opacity-90 transition"
            >
              <FaPlus /> New Payment
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-500/30 transition"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-surface rounded-xl p-6 border border-white/10">
            <p className="text-white/70 text-sm mb-1">Total Payments</p>
            <p className="text-3xl font-bold text-white">{payments.length}</p>
          </div>
          <div className="bg-surface rounded-xl p-6 border border-white/10">
            <p className="text-white/70 text-sm mb-1">Completed Amount</p>
            <p className="text-3xl font-bold text-green-400">${totalAmount.toLocaleString()}</p>
          </div>
          <div className="bg-surface rounded-xl p-6 border border-white/10">
            <p className="text-white/70 text-sm mb-1">Pending Amount</p>
            <p className="text-3xl font-bold text-yellow-400">${pendingAmount.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-surface rounded-xl overflow-hidden border border-white/10">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="px-6 py-4 text-left text-white font-semibold">Project</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Milestone</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Amount</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Payment Date</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Invoice</th>
                <th className="px-6 py-4 text-right text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-white/70">
                    No payments found. Create your first payment!
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="border-t border-white/10 hover:bg-secondary/20 transition">
                    <td className="px-6 py-4 text-white font-medium">
                      {payment.project_title || '-'}
                    </td>
                    <td className="px-6 py-4 text-white/70">
                      {payment.milestone_title || '-'}
                    </td>
                    <td className="px-6 py-4 text-white font-semibold">
                      ${parseFloat(payment.amount || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-white/70">
                      {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        payment.status === 'completed'
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                          : payment.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                          : payment.status === 'failed'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/70">
                      {payment.invoice_number || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(payment)}
                          className="p-2 bg-accent/20 border border-accent/30 rounded-lg text-accent hover:bg-accent/30 transition"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(payment.id)}
                          className="p-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-500/30 transition"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl border border-white/10 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingPayment ? 'Edit Payment' : 'New Payment'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/70 mb-2">Project *</label>
                <select
                  value={formData.project_id}
                  onChange={(e) => setFormData({ ...formData, project_id: e.target.value, milestone_id: '' })}
                  className="w-full px-4 py-2 bg-secondary border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                  required
                >
                  <option value="">Select a project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.title} {project.client_name ? `- ${project.client_name}` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-white/70 mb-2">Milestone (Optional)</label>
                <select
                  value={formData.milestone_id}
                  onChange={(e) => setFormData({ ...formData, milestone_id: e.target.value })}
                  className="w-full px-4 py-2 bg-secondary border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                  disabled={!formData.project_id || milestones.length === 0}
                >
                  <option value="">No milestone</option>
                  {milestones.map(milestone => (
                    <option key={milestone.id} value={milestone.id}>
                      {milestone.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 mb-2">Amount *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-2 bg-secondary border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-2">Payment Date</label>
                  <input
                    type="date"
                    value={formData.payment_date}
                    onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                    className="w-full px-4 py-2 bg-secondary border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 mb-2">Payment Method</label>
                  <select
                    value={formData.payment_method}
                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                    className="w-full px-4 py-2 bg-secondary border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                  >
                    <option value="">Select method</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="check">Check</option>
                    <option value="cash">Cash</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/70 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 bg-secondary border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-white/70 mb-2">Invoice Number</label>
                <input
                  type="text"
                  value={formData.invoice_number}
                  onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                  className="w-full px-4 py-2 bg-secondary border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-white/70 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 bg-secondary border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                  rows="3"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-accent to-accent2 text-white font-bold rounded-lg hover:opacity-90 transition"
                >
                  {editingPayment ? 'Update Payment' : 'Create Payment'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingPayment(null);
                  }}
                  className="px-6 py-3 bg-secondary border border-white/20 text-white rounded-lg hover:bg-secondary/80 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;

