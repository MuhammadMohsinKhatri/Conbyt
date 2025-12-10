import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaSignOutAlt, FaDollarSign, FaArrowLeft, FaSearch, FaDownload, FaFileCsv, FaFileExcel, FaFilter } from 'react-icons/fa';
import { fetchAdminPayments, fetchAdminProjects, fetchAdminMilestones, deleteAdminPayment, createAdminPayment, updateAdminPayment } from '../../utils/api.js';
import { filterData, downloadCSV, downloadExcel, createSearchCache } from '../../utils/exportUtils.js';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [allPayments, setAllPayments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    payment_method: '',
    project_id: ''
  });
  const [showFilters, setShowFilters] = useState(false);
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
      setAllPayments(paymentsData);
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

  // Create search index cache for better performance
  const searchCache = useMemo(() => {
    if (allPayments.length === 0) return null;
    return createSearchCache(allPayments, ['project_title', 'milestone_title', 'invoice_number', 'notes', 'payment_method']);
  }, [allPayments]);

  // Filter payments based on search and filters using FlexSearch
  const filteredPayments = useMemo(() => {
    return filterData(
      allPayments,
      searchTerm,
      ['project_title', 'milestone_title', 'invoice_number', 'notes', 'payment_method'],
      filters,
      searchCache
    );
  }, [allPayments, searchTerm, filters, searchCache]);

  // Update displayed payments when filters change
  useEffect(() => {
    setPayments(filteredPayments);
  }, [filteredPayments]);

  const handleExportCSV = () => {
    const headers = [
      { label: 'ID', key: 'id' },
      { label: 'Project', key: 'project_title' },
      { label: 'Milestone', key: 'milestone_title' },
      { label: 'Amount', key: 'amount' },
      { label: 'Payment Date', key: 'payment_date' },
      { label: 'Payment Method', key: 'payment_method' },
      { label: 'Status', key: 'status' },
      { label: 'Invoice Number', key: 'invoice_number' }
    ];
    downloadCSV(filteredPayments, headers, `payments_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportExcel = () => {
    const headers = [
      { label: 'ID', key: 'id' },
      { label: 'Project', key: 'project_title' },
      { label: 'Milestone', key: 'milestone_title' },
      { label: 'Amount', key: 'amount' },
      { label: 'Payment Date', key: 'payment_date' },
      { label: 'Payment Method', key: 'payment_method' },
      { label: 'Status', key: 'status' },
      { label: 'Invoice Number', key: 'invoice_number' }
    ];
    downloadExcel(filteredPayments, headers, `payments_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({ status: '', payment_method: '', project_id: '' });
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
    setError('');
    
    try {
      const token = localStorage.getItem('cms_token');
      if (!token) {
        setError('Authentication required. Please log in again.');
        navigate('/cms/login');
        return;
      }

      if (!formData.project_id || !formData.project_id.trim()) {
        setError('Project is required');
        return;
      }

      if (!formData.amount || !formData.amount.trim() || parseFloat(formData.amount) <= 0) {
        setError('Amount is required and must be greater than 0');
        return;
      }

      const submitData = {
        ...formData,
        project_id: parseInt(formData.project_id),
        milestone_id: formData.milestone_id ? parseInt(formData.milestone_id) : null,
        amount: parseFloat(formData.amount)
      };
      
      if (editingPayment && editingPayment.id) {
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
      console.error('Error saving payment:', error);
      setError(error.message || 'Failed to save payment. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('cms_token');
    localStorage.removeItem('cms_user');
    navigate('/cms/login');
  };

  const totalAmount = filteredPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  const pendingAmount = filteredPayments
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
            <p className="text-3xl font-bold text-white">{filteredPayments.length}</p>
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

        {/* Search and Filter Section */}
        <div className="bg-surface rounded-xl border border-white/10 p-4 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
              <input
                type="text"
                placeholder="Search by project, milestone, invoice number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-secondary border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent"
              />
            </div>

            {/* Filter Toggle and Export Buttons */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  showFilters || Object.values(filters).some(f => f) || searchTerm
                    ? 'bg-accent/20 border border-accent/30 text-accent'
                    : 'bg-secondary/50 border border-white/20 text-white/70 hover:bg-white/5'
                }`}
              >
                <FaFilter /> Filters
              </button>
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 bg-secondary/50 border border-white/20 rounded-lg text-white/70 hover:bg-white/5 transition">
                  <FaDownload /> Export
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-surface border border-white/10 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <button
                    onClick={handleExportCSV}
                    className="w-full flex items-center gap-2 px-4 py-2 text-left text-white/70 hover:bg-white/5 rounded-t-lg transition"
                  >
                    <FaFileCsv className="text-green-400" /> Export as CSV
                  </button>
                  <button
                    onClick={handleExportExcel}
                    className="w-full flex items-center gap-2 px-4 py-2 text-left text-white/70 hover:bg-white/5 rounded-b-lg transition"
                  >
                    <FaFileExcel className="text-green-400" /> Export as Excel
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-4 py-2 bg-secondary border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Payment Method</label>
                <select
                  value={filters.payment_method}
                  onChange={(e) => handleFilterChange('payment_method', e.target.value)}
                  className="w-full px-4 py-2 bg-secondary border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                >
                  <option value="">All Methods</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="check">Check</option>
                  <option value="cash">Cash</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Project</label>
                <select
                  value={filters.project_id}
                  onChange={(e) => handleFilterChange('project_id', e.target.value)}
                  className="w-full px-4 py-2 bg-secondary border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                >
                  <option value="">All Projects</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </div>
              {(searchTerm || Object.values(filters).some(f => f)) && (
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-500/30 transition"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Results Count */}
          <div className="mt-4 text-white/50 text-sm">
            Showing {filteredPayments.length} of {allPayments.length} payments
          </div>
        </div>

        <div className="bg-surface rounded-xl overflow-hidden border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-white font-semibold text-sm sm:text-base">Project</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-white font-semibold text-sm sm:text-base">Milestone</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-white font-semibold text-sm sm:text-base">Amount</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-white font-semibold text-sm sm:text-base">Payment Date</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-white font-semibold text-sm sm:text-base">Status</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-white font-semibold text-sm sm:text-base">Invoice</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-white font-semibold text-sm sm:text-base">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-white/70">
                      {searchTerm || Object.values(filters).some(f => f) 
                        ? 'No payments match your search criteria.' 
                        : 'No payments found. Create your first payment!'}
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => (
                    <tr key={payment.id} className="border-t border-white/10 hover:bg-secondary/20 transition">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-white font-medium text-sm sm:text-base">
                        {payment.project_title || '-'}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-white/70 text-sm sm:text-base">
                        {payment.milestone_title || '-'}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-white font-semibold text-sm sm:text-base">
                        ${parseFloat(payment.amount || 0).toLocaleString()}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-white/70 text-sm sm:text-base">
                        {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
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
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-white/70 text-sm sm:text-base">
                        {payment.invoice_number || '-'}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="flex justify-end gap-1 sm:gap-2">
                          <button
                            onClick={() => handleEdit(payment)}
                            className="p-1.5 sm:p-2 bg-accent/20 border border-accent/30 rounded-lg text-accent hover:bg-accent/30 transition"
                            title="Edit"
                          >
                            <FaEdit className="text-sm sm:text-base" />
                          </button>
                          <button
                            onClick={() => handleDelete(payment.id)}
                            className="p-1.5 sm:p-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-500/30 transition"
                            title="Delete"
                          >
                            <FaTrash className="text-sm sm:text-base" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl border border-white/10 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingPayment ? 'Edit Payment' : 'New Payment'}
            </h2>
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}
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

