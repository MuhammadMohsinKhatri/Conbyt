import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaSignOutAlt, FaProjectDiagram, FaArrowLeft, FaSearch, FaDownload, FaFileCsv, FaFileExcel, FaFilter, FaTimes } from 'react-icons/fa';
import RichTextEditor from '../../components/CMS/RichTextEditor';
import { fetchAdminProjects, fetchAdminClients, deleteAdminProject, createAdminProject, updateAdminProject } from '../../utils/api.js';
import { filterData, downloadCSV, downloadExcel, createSearchCache } from '../../utils/exportUtils.js';
import { useToast } from '../../contexts/ToastContext';

// Helper function to strip HTML tags for preview
const stripHtml = (html) => {
  if (!html) return '';
  if (!html.includes('<')) return html;
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    client_id: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [formData, setFormData] = useState({
    client_id: '',
    title: '',
    description: '',
    status: 'planning',
    start_date: '',
    end_date: '',
    budget: '',
    category: '',
    tech_stack: []
  });
  const [techStackInput, setTechStackInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('cms_token');
    if (!token) {
      navigate('/cms/login');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('cms_token');
      const [projectsData, clientsData] = await Promise.all([
        fetchAdminProjects(token),
        fetchAdminClients(token)
      ]);
      setAllProjects(projectsData);
      setProjects(projectsData);
      setClients(clientsData);
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
    if (allProjects.length === 0) return null;
    return createSearchCache(allProjects, ['title', 'description', 'category', 'client_name', 'client_company']);
  }, [allProjects]);

  // Filter projects based on search and filters using FlexSearch
  const filteredProjects = useMemo(() => {
    return filterData(
      allProjects,
      searchTerm,
      ['title', 'description', 'category', 'client_name', 'client_company'],
      filters,
      searchCache
    );
  }, [allProjects, searchTerm, filters, searchCache]);

  // Update displayed projects when filters change
  useEffect(() => {
    setProjects(filteredProjects);
  }, [filteredProjects]);

  const handleExportCSV = () => {
    try {
      const headers = [
        { label: 'ID', key: 'id' },
        { label: 'Title', key: 'title' },
        { label: 'Client', key: 'client_name' },
        { label: 'Status', key: 'status' },
        { label: 'Budget', key: 'budget' },
        { label: 'Category', key: 'category' },
        { label: 'Start Date', key: 'start_date' },
        { label: 'End Date', key: 'end_date' }
      ];
      downloadCSV(filteredProjects, headers, `projects_${new Date().toISOString().split('T')[0]}.csv`);
      toast.success('Projects exported to CSV successfully');
    } catch (error) {
      toast.error('Failed to export CSV: ' + (error.message || 'Unknown error'));
    }
  };

  const handleExportExcel = () => {
    try {
      const headers = [
        { label: 'ID', key: 'id' },
        { label: 'Title', key: 'title' },
        { label: 'Client', key: 'client_name' },
        { label: 'Status', key: 'status' },
        { label: 'Budget', key: 'budget' },
        { label: 'Category', key: 'category' },
        { label: 'Start Date', key: 'start_date' },
        { label: 'End Date', key: 'end_date' }
      ];
      downloadExcel(filteredProjects, headers, `projects_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success('Projects exported to Excel successfully');
    } catch (error) {
      toast.error('Failed to export Excel: ' + (error.message || 'Unknown error'));
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({ status: '', category: '', client_id: '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const token = localStorage.getItem('cms_token');
      await deleteAdminProject(id, token);
      setProjects(projects.filter(project => project.id !== id));
      toast.success('Project deleted successfully');
    } catch (error) {
      toast.error('Error deleting project: ' + (error.message || 'Unknown error'));
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    const techStack = typeof project.tech_stack === 'string' 
      ? JSON.parse(project.tech_stack || '[]') 
      : project.tech_stack || [];
    setFormData({
      client_id: project.client_id || '',
      title: project.title || '',
      description: project.description || '',
      status: project.status || 'planning',
      start_date: project.start_date || '',
      end_date: project.end_date || '',
      budget: project.budget || '',
      category: project.category || '',
      tech_stack: techStack
    });
    setTechStackInput(techStack.join(', '));
    setShowModal(true);
  };

  const handleAddTech = () => {
    if (techStackInput.trim()) {
      const techs = techStackInput.split(',').map(t => t.trim()).filter(t => t);
      setFormData({ ...formData, tech_stack: [...formData.tech_stack, ...techs] });
      setTechStackInput('');
    }
  };

  const handleRemoveTech = (index) => {
    setFormData({
      ...formData,
      tech_stack: formData.tech_stack.filter((_, i) => i !== index)
    });
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

      if (!formData.title || !formData.title.trim()) {
        setError('Title is required');
        return;
      }

      const submitData = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        tech_stack: Array.isArray(formData.tech_stack) ? formData.tech_stack : []
      };
      
      if (editingProject && editingProject.id) {
        await updateAdminProject(editingProject.id, submitData, token);
      } else {
        await createAdminProject(submitData, token);
      }
      
      setShowModal(false);
      setEditingProject(null);
      setFormData({
        client_id: '',
        title: '',
        description: '',
        status: 'planning',
        start_date: '',
        end_date: '',
        budget: '',
        category: '',
        tech_stack: []
      });
      setTechStackInput('');
      fetchData();
    } catch (error) {
      console.error('Error saving project:', error);
      setError(error.message || 'Failed to save project. Please try again.');
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
              <FaProjectDiagram className="text-accent text-2xl" />
              <h1 className="text-2xl font-bold text-white">Projects Management</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditingProject(null);
                setFormData({
                  client_id: '',
                  title: '',
                  description: '',
                  status: 'planning',
                  start_date: '',
                  end_date: '',
                  budget: '',
                  category: '',
                  tech_stack: []
                });
                setTechStackInput('');
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent to-accent2 text-white font-bold rounded-lg hover:opacity-90 transition"
            >
              <FaPlus /> New Project
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
                placeholder="Search by title, description, category, client..."
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
                  <option value="planning">Planning</option>
                  <option value="in_progress">In Progress</option>
                  <option value="on_hold">On Hold</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Category</label>
                <input
                  type="text"
                  placeholder="Filter by category"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-4 py-2 bg-secondary border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Client</label>
                <select
                  value={filters.client_id}
                  onChange={(e) => handleFilterChange('client_id', e.target.value)}
                  className="w-full px-4 py-2 bg-secondary border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                >
                  <option value="">All Clients</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name}
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
            Showing {filteredProjects.length} of {allProjects.length} projects
          </div>
        </div>

        <div className="bg-surface rounded-xl overflow-hidden border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-white font-semibold text-sm sm:text-base">Title</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-white font-semibold text-sm sm:text-base">Client</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-white font-semibold text-sm sm:text-base">Status</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-white font-semibold text-sm sm:text-base">Budget</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-white font-semibold text-sm sm:text-base">Category</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-white font-semibold text-sm sm:text-base">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-white/70">
                      {searchTerm || Object.values(filters).some(f => f) 
                        ? 'No projects match your search criteria.' 
                        : 'No projects found. Create your first project!'}
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((project) => (
                    <tr key={project.id} className="border-t border-white/10 hover:bg-secondary/20 transition">
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="text-white font-medium text-sm sm:text-base">{project.title}</div>
                        {project.description && (
                          <div className="text-white/60 text-xs sm:text-sm mt-1 line-clamp-1">
                            {project.description.includes('<') 
                              ? stripHtml(project.description).substring(0, 50) + '...'
                              : project.description.substring(0, 50) + (project.description.length > 50 ? '...' : '')}
                          </div>
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-white/70 text-sm sm:text-base">
                        {project.client_name || project.client_company || '-'}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                          project.status === 'completed'
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                            : project.status === 'in_progress'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : project.status === 'on_hold'
                            ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                            : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                        }`}>
                          {project.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-white/70 text-sm sm:text-base">
                        {project.budget ? `$${parseFloat(project.budget).toLocaleString()}` : '-'}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-white/70 text-sm sm:text-base">{project.category || '-'}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="flex justify-end gap-1 sm:gap-2">
                          <button
                            onClick={() => handleEdit(project)}
                            className="p-1.5 sm:p-2 bg-accent/20 border border-accent/30 rounded-lg text-accent hover:bg-accent/30 transition"
                            title="Edit"
                          >
                            <FaEdit className="text-sm sm:text-base" />
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
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
          <div className="bg-surface rounded-xl border border-white/10 p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingProject ? 'Edit Project' : 'New Project'}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setEditingProject(null);
                }}
                className="text-white/70 hover:text-white transition p-2 hover:bg-secondary/50 rounded-lg"
                aria-label="Close"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/70 mb-2">Client *</label>
                <select
                  value={formData.client_id}
                  onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                  className="w-full px-4 py-2 bg-secondary border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                  required
                >
                  <option value="">Select a client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name} {client.company ? `(${client.company})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-white/70 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-secondary border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                  required
                />
              </div>
              <div>
                <label className="block text-white/70 mb-2">Description</label>
                <RichTextEditor
                  value={formData.description || ''}
                  onChange={(content) => setFormData({ ...formData, description: content })}
                  placeholder="Enter project description with rich formatting..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 bg-secondary border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                  >
                    <option value="planning">Planning</option>
                    <option value="in_progress">In Progress</option>
                    <option value="on_hold">On Hold</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/70 mb-2">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-secondary border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                    placeholder="e.g., Web Development, Mobile App"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/70 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-4 py-2 bg-secondary border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-2">End Date</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-4 py-2 bg-secondary border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-2">Budget</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-2 bg-secondary border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/70 mb-2">Tech Stack</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={techStackInput}
                    onChange={(e) => setTechStackInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                    className="flex-1 px-4 py-2 bg-secondary border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                    placeholder="React, Node.js, MongoDB (comma separated)"
                  />
                  <button
                    type="button"
                    onClick={handleAddTech}
                    className="px-4 py-2 bg-accent/20 border border-accent/30 rounded-lg text-accent hover:bg-accent/30 transition"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tech_stack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-accent/20 border border-accent/30 rounded-lg text-accent text-sm flex items-center gap-2"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(index)}
                        className="text-accent hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-accent to-accent2 text-white font-bold rounded-lg hover:opacity-90 transition"
                >
                  {editingProject ? 'Update Project' : 'Create Project'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProject(null);
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

export default Projects;

