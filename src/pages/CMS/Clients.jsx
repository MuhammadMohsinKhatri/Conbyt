import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaSignOutAlt, FaUsers, FaArrowLeft, FaSearch, FaDownload, FaFileCsv, FaFileExcel, FaFilter } from 'react-icons/fa';
import RichTextEditor from '../../components/CMS/RichTextEditor';
import { fetchAdminClients, deleteAdminClient } from '../../utils/api.js';
import { filterData, downloadCSV, downloadExcel } from '../../utils/exportUtils.js';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [allClients, setAllClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    notes: '',
    status: 'active'
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('cms_token');
    if (!token) {
      navigate('/cms/login');
      return;
    }
    fetchClients();
  }, [navigate]);

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('cms_token');
      const data = await fetchAdminClients(token);
      setAllClients(data);
      setClients(data);
    } catch (error) {
      if (error.message.includes('401') || error.message.includes('Token')) {
        localStorage.removeItem('cms_token');
        localStorage.removeItem('cms_user');
        navigate('/cms/login');
        return;
      }
      setError('Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  };

  // Filter clients based on search and filters
  const filteredClients = useMemo(() => {
    return filterData(
      allClients,
      searchTerm,
      ['name', 'email', 'phone', 'company', 'address', 'notes'],
      filters
    );
  }, [allClients, searchTerm, filters]);

  // Update displayed clients when filters change
  useEffect(() => {
    setClients(filteredClients);
  }, [filteredClients]);

  const handleExportCSV = () => {
    const headers = [
      { label: 'ID', key: 'id' },
      { label: 'Name', key: 'name' },
      { label: 'Email', key: 'email' },
      { label: 'Phone', key: 'phone' },
      { label: 'Company', key: 'company' },
      { label: 'Address', key: 'address' },
      { label: 'Status', key: 'status' },
      { label: 'Notes', key: 'notes' }
    ];
    downloadCSV(filteredClients, headers, `clients_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportExcel = () => {
    const headers = [
      { label: 'ID', key: 'id' },
      { label: 'Name', key: 'name' },
      { label: 'Email', key: 'email' },
      { label: 'Phone', key: 'phone' },
      { label: 'Company', key: 'company' },
      { label: 'Address', key: 'address' },
      { label: 'Status', key: 'status' },
      { label: 'Notes', key: 'notes' }
    ];
    downloadExcel(filteredClients, headers, `clients_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({ status: '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this client?')) {
      return;
    }

    try {
      const token = localStorage.getItem('cms_token');
      await deleteAdminClient(id, token);
      setClients(clients.filter(client => client.id !== id));
    } catch (error) {
      alert('Error deleting client: ' + error.message);
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      company: client.company || '',
      address: client.address || '',
      notes: client.notes || '',
      status: client.status || 'active'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('cms_token');
      const { createAdminClient, updateAdminClient } = await import('../../utils/api.js');
      
      if (editingClient) {
        await updateAdminClient(editingClient.id, formData, token);
      } else {
        await createAdminClient(formData, token);
      }
      
      setShowModal(false);
      setEditingClient(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        address: '',
        notes: '',
        status: 'active'
      });
      fetchClients();
    } catch (error) {
      alert('Error saving client: ' + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('cms_token');
    localStorage.removeItem('cms_user');
    navigate('/cms/login');
  };

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
              <FaUsers className="text-accent text-2xl" />
              <h1 className="text-2xl font-bold text-white">Clients Management</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditingClient(null);
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  company: '',
                  address: '',
                  notes: '',
                  status: 'active'
                });
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent to-accent2 text-white font-bold rounded-lg hover:opacity-90 transition"
            >
              <FaPlus /> New Client
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

        {/* Search and Filter Section */}
        <div className="bg-surface rounded-xl border border-white/10 p-4 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
              <input
                type="text"
                placeholder="Search by name, email, phone, company..."
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
            <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-4 py-2 bg-secondary border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="archived">Archived</option>
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
            Showing {filteredClients.length} of {allClients.length} clients
          </div>
        </div>

        <div className="bg-surface rounded-xl overflow-hidden border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-white font-semibold text-sm sm:text-base">Name</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-white font-semibold text-sm sm:text-base">Company</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-white font-semibold text-sm sm:text-base">Email</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-white font-semibold text-sm sm:text-base">Phone</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-white font-semibold text-sm sm:text-base">Status</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-white font-semibold text-sm sm:text-base">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-white/70">
                      {searchTerm || Object.values(filters).some(f => f) 
                        ? 'No clients match your search criteria.' 
                        : 'No clients found. Create your first client!'}
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((client) => (
                    <tr key={client.id} className="border-t border-white/10 hover:bg-secondary/20 transition">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-white font-medium text-sm sm:text-base">{client.name}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-white/70 text-sm sm:text-base">{client.company || '-'}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-white/70 text-sm sm:text-base">{client.email || '-'}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-white/70 text-sm sm:text-base">{client.phone || '-'}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                          client.status === 'active'
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                            : client.status === 'inactive'
                            ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                            : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                        }`}>
                          {client.status}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="flex justify-end gap-1 sm:gap-2">
                          <button
                            onClick={() => handleEdit(client)}
                            className="p-1.5 sm:p-2 bg-accent/20 border border-accent/30 rounded-lg text-accent hover:bg-accent/30 transition"
                            title="Edit"
                          >
                            <FaEdit className="text-sm sm:text-base" />
                          </button>
                          <button
                            onClick={() => handleDelete(client.id)}
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
              {editingClient ? 'Edit Client' : 'New Client'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/70 mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-secondary border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-secondary border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 bg-secondary border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/70 mb-2">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2 bg-secondary border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-white/70 mb-2">Address</label>
                <RichTextEditor
                  value={formData.address || ''}
                  onChange={(content) => setFormData({ ...formData, address: content })}
                  placeholder="Enter client address with rich formatting..."
                />
              </div>
              <div>
                <label className="block text-white/70 mb-2">Notes</label>
                <RichTextEditor
                  value={formData.notes || ''}
                  onChange={(content) => setFormData({ ...formData, notes: content })}
                  placeholder="Enter client notes with rich formatting..."
                />
              </div>
              <div>
                <label className="block text-white/70 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 bg-secondary border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-accent to-accent2 text-white font-bold rounded-lg hover:opacity-90 transition"
                >
                  {editingClient ? 'Update Client' : 'Create Client'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingClient(null);
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

export default Clients;

