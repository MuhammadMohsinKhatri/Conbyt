import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaSignOutAlt, FaFolderOpen, FaArrowLeft, FaTimes, FaSearch, FaFilter } from 'react-icons/fa';
import ImageUpload from '../../components/CMS/ImageUpload';
import RichTextEditor from '../../components/CMS/RichTextEditor';
import { fetchAdminPortfolios, fetchAdminProjects, deleteAdminPortfolio, createAdminPortfolio, updateAdminPortfolio } from '../../utils/api.js';
import { filterData, createSearchCache } from '../../utils/exportUtils.js';
import { useToast } from '../../contexts/ToastContext';

// Helper function to strip HTML tags for preview
const stripHtml = (html) => {
  if (!html) return '';
  if (!html.includes('<')) return html;
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

// Component to handle portfolio image display with error handling
const PortfolioImage = ({ imageUrl, title }) => {
  const [imageError, setImageError] = useState(false);
  
  if (!imageUrl) {
    return (
      <div className="w-full h-48 bg-secondary/50 flex items-center justify-center">
        <span className="text-white/30 text-sm">No image</span>
      </div>
    );
  }
  
  if (imageError) {
    return (
      <div className="w-full h-48 bg-secondary/50 flex items-center justify-center">
        <span className="text-white/50 text-sm">Image not available</span>
      </div>
    );
  }
  
  return (
    <div className="w-full h-48 bg-secondary/50 overflow-hidden">
      {(() => {
        // Resolve relative server paths to absolute so previews work in production
        let resolved = imageUrl;
        try {
          if (imageUrl && (imageUrl.startsWith('/') || imageUrl.startsWith('./'))) {
            resolved = `${window.location.origin}${imageUrl.startsWith('./') ? imageUrl.slice(1) : imageUrl}`;
          }
        } catch (err) {
          resolved = imageUrl;
        }

        return (
          <img
            src={resolved}
            loading="lazy"
            alt={title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        );
      })()}
    </div>
  );
};

const Portfolios = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [allPortfolios, setAllPortfolios] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState(null);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    featured: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  // Normalize tech_stack for selected portfolio to avoid runtime errors
  const normalizedSelectedTechStack = selectedPortfolio
    ? (typeof selectedPortfolio.tech_stack === 'string'
        ? JSON.parse(selectedPortfolio.tech_stack || '[]')
        : selectedPortfolio.tech_stack || [])
    : [];
  const [formData, setFormData] = useState({
    project_id: '',
    title: '',
    description: '',
    image_url: '',
    category: '',
    slug: '',
    featured: false,
    display_order: 0,
    live_url: '',
    github_url: '',
    tech_stack: []
  });
  const [techStackInput, setTechStackInput] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

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
      const [portfoliosData, projectsData] = await Promise.all([
        fetchAdminPortfolios(token),
        fetchAdminProjects(token)
      ]);
      setAllPortfolios(portfoliosData);
      setPortfolios(portfoliosData);
      setProjects(projectsData);
    } catch (error) {
      if (error.message.includes('401') || error.message.includes('Token')) {
        localStorage.removeItem('cms_token');
        localStorage.removeItem('cms_user');
        toast.error('Session expired. Please log in again.');
        navigate('/cms/login');
        return;
      }
      const errorMsg = 'Failed to fetch data';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Create search index cache for better performance
  const searchCache = useMemo(() => {
    if (allPortfolios.length === 0) return null;
    return createSearchCache(allPortfolios, ['title', 'description', 'category', 'slug', 'tech_stack']);
  }, [allPortfolios]);

  // Filter portfolios based on search and filters using FlexSearch
  const filteredPortfolios = useMemo(() => {
    const allFilters = {
      category: filters.category,
      featured: filters.featured !== '' ? filters.featured : undefined
    };
    
    return filterData(
      allPortfolios,
      searchTerm,
      ['title', 'description', 'category', 'slug'],
      allFilters,
      searchCache
    );
  }, [allPortfolios, searchTerm, filters, searchCache]);

  // Update displayed portfolios when filters change
  useEffect(() => {
    setPortfolios(filteredPortfolios);
  }, [filteredPortfolios]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this portfolio item?')) {
      return;
    }

    try {
      const token = localStorage.getItem('cms_token');
      await deleteAdminPortfolio(id, token);
      setAllPortfolios(allPortfolios.filter(portfolio => portfolio.id !== id));
      setPortfolios(portfolios.filter(portfolio => portfolio.id !== id));
      toast.success('Portfolio deleted successfully');
    } catch (error) {
      toast.error('Error deleting portfolio: ' + (error.message || 'Unknown error'));
    }
  };

  const handleEdit = (portfolio) => {
    try {
      setEditingPortfolio(portfolio);
      let techStack = [];
      try {
        techStack = typeof portfolio.tech_stack === 'string' 
          ? JSON.parse(portfolio.tech_stack || '[]') 
          : (portfolio.tech_stack || []);
      } catch (parseError) {
        console.error('Error parsing tech_stack:', parseError);
        techStack = [];
      }
      setFormData({
        project_id: portfolio.project_id?.toString() || '',
        title: portfolio.title || '',
        description: portfolio.description || '',
        image_url: portfolio.image_url || '',
        category: portfolio.category || '',
        slug: portfolio.slug || '',
        featured: portfolio.featured || false,
        display_order: portfolio.display_order || 0,
        live_url: portfolio.live_url || '',
        github_url: portfolio.github_url || '',
        tech_stack: Array.isArray(techStack) ? techStack : []
      });
      setTechStackInput(Array.isArray(techStack) ? techStack.join(', ') : '');
      setShowModal(true);
    } catch (error) {
      console.error('Error in handleEdit:', error);
      setError('Failed to load portfolio for editing: ' + error.message);
    }
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

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
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
        const errorMsg = 'Title is required';
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      const submitData = {
        ...formData,
        project_id: formData.project_id ? parseInt(formData.project_id) : null,
        display_order: parseInt(formData.display_order) || 0,
        slug: formData.slug || generateSlug(formData.title),
        tech_stack: Array.isArray(formData.tech_stack) ? formData.tech_stack : []
      };
      
      console.log('Submitting portfolio with data:', submitData);
      console.log('Editing portfolio:', editingPortfolio);
      
      if (editingPortfolio && editingPortfolio.id) {
        await updateAdminPortfolio(editingPortfolio.id, submitData, token);
      } else {
        await createAdminPortfolio(submitData, token);
      }
      
      setShowModal(false);
      setEditingPortfolio(null);
      setFormData({
        project_id: '',
        title: '',
        description: '',
        image_url: '',
        category: '',
        slug: '',
        featured: false,
        display_order: 0,
        live_url: '',
        github_url: '',
        tech_stack: []
      });
      setTechStackInput('');
      toast.success(editingPortfolio ? 'Portfolio updated successfully' : 'Portfolio created successfully');
      fetchData();
    } catch (error) {
      console.error('Error saving portfolio:', error);
      const errorMsg = error.message || 'Failed to save portfolio. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
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
              <FaFolderOpen className="text-accent text-2xl" />
              <h1 className="text-2xl font-bold text-white">Portfolios Management</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditingPortfolio(null);
                setFormData({
                  project_id: '',
                  title: '',
                  description: '',
                  image_url: '',
                  category: '',
                  slug: '',
                  featured: false,
                  display_order: 0,
                  live_url: '',
                  github_url: '',
                  tech_stack: []
                });
                setTechStackInput('');
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent to-accent2 text-white font-bold rounded-lg hover:opacity-90 transition"
            >
              <FaPlus /> New Portfolio
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
                placeholder="Search by title, description, category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-secondary border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent"
              />
            </div>

            {/* Filter Toggle */}
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
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Category</label>
                <input
                  type="text"
                  placeholder="Filter by category"
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2 bg-secondary border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Featured</label>
                <select
                  value={filters.featured}
                  onChange={(e) => setFilters(prev => ({ ...prev, featured: e.target.value }))}
                  className="w-full px-4 py-2 bg-secondary border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                >
                  <option value="">All</option>
                  <option value="true">Featured Only</option>
                  <option value="false">Not Featured</option>
                </select>
              </div>
              {(searchTerm || Object.values(filters).some(f => f)) && (
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilters({ category: '', featured: '' });
                    }}
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
            Showing {filteredPortfolios.length} of {allPortfolios.length} portfolios
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.length === 0 ? (
            <div className="col-span-full bg-surface rounded-xl p-12 text-center border border-white/10">
              <p className="text-white/70">No portfolio items found. Create your first portfolio item!</p>
            </div>
          ) : (
            portfolios.map((portfolio) => (
              <div
                key={portfolio.id}
                className="bg-surface rounded-xl overflow-hidden border border-white/10 hover:border-accent/50 transition cursor-pointer"
                onClick={() => {
                  setSelectedPortfolio(portfolio);
                  setShowDetailModal(true);
                }}
              >
                <PortfolioImage imageUrl={portfolio.image_url} title={portfolio.title} />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">{portfolio.title}</h3>
                    {portfolio.featured && (
                      <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded">Featured</span>
                    )}
                  </div>
                  <div className="text-white/70 text-sm mb-4 line-clamp-2">
                    {portfolio.description 
                      ? (portfolio.description.includes('<') 
                          ? stripHtml(portfolio.description).substring(0, 100) + '...'
                          : portfolio.description.substring(0, 100) + (portfolio.description.length > 100 ? '...' : ''))
                      : 'No description'}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">{portfolio.category || 'Uncategorized'}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(portfolio);
                        }}
                        className="p-2 bg-accent/20 border border-accent/30 rounded-lg text-accent hover:bg-accent/30 transition"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(portfolio.id);
                        }}
                        className="p-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-500/30 transition"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="relative bg-surface rounded-xl border border-white/10 p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setEditingPortfolio(null);
                setError('');
                setFormData({
                  project_id: '',
                  title: '',
                  description: '',
                  image_url: '',
                  category: '',
                  slug: '',
                  featured: false,
                  display_order: 0,
                  live_url: '',
                  github_url: '',
                  tech_stack: []
                });
                setTechStackInput('');
              }}
              className="absolute top-4 right-4 bg-red-500/10 hover:bg-red-500/20 text-red-300 p-2 rounded-full transition"
              aria-label="Close"
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingPortfolio ? 'Edit Portfolio' : 'New Portfolio'}
            </h2>
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/70 mb-2">Project (Optional)</label>
                <select
                  value={formData.project_id}
                  onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                  className="w-full px-4 py-2 bg-secondary border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                >
                  <option value="">No project link</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-white/70 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    title: e.target.value,
                    slug: formData.slug || generateSlug(e.target.value)
                  })}
                  className="w-full px-4 py-2 bg-secondary border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                  required
                />
              </div>
              <div>
                <label className="block text-white/70 mb-2">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 bg-secondary border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                  placeholder="auto-generated from title"
                />
              </div>
              <div>
                <label className="block text-white/70 mb-2">Description</label>
                <RichTextEditor
                  value={formData.description || ''}
                  onChange={(content) => setFormData({ ...formData, description: content })}
                  placeholder="Enter portfolio description with rich formatting..."
                />
              </div>
              <div>
                <ImageUpload
                  label="Portfolio Image"
                  value={formData.image_url}
                  onChange={(value) => setFormData({ ...formData, image_url: value })}
                  placeholder="Upload portfolio image or paste URL"
                  uploadEndpoint="/api/upload/portfolio-image"
                />
              </div>
              <div>
                <label className="block text-white/70 mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 bg-secondary border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 mb-2">Live URL</label>
                  <input
                    type="url"
                    value={formData.live_url}
                    onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                    className="w-full px-4 py-2 bg-secondary border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-2">GitHub URL</label>
                  <input
                    type="url"
                    value={formData.github_url}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    className="w-full px-4 py-2 bg-secondary border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 mb-2">Display Order</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-secondary border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                  />
                </div>
                <div className="flex items-center pt-8">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-5 h-5 rounded border-white/20 bg-secondary text-accent focus:ring-accent"
                    />
                    <span className="text-white">Featured</span>
                  </label>
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
                  {editingPortfolio ? 'Update Portfolio' : 'Create Portfolio'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingPortfolio(null);
                    setError('');
                    setFormData({
                      project_id: '',
                      title: '',
                      description: '',
                      image_url: '',
                      category: '',
                      slug: '',
                      featured: false,
                      display_order: 0,
                      live_url: '',
                      github_url: '',
                      tech_stack: []
                    });
                    setTechStackInput('');
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
      {/* Detail Modal */}
      {showDetailModal && selectedPortfolio && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="relative bg-surface rounded-xl border border-white/10 p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                setShowDetailModal(false);
                setSelectedPortfolio(null);
              }}
              className="absolute top-4 right-4 bg-red-500/10 hover:bg-red-500/20 text-red-300 p-2 rounded-full transition"
              aria-label="Close"
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-bold text-white mb-4">{selectedPortfolio.title}</h2>
            <div className="mb-4">
              <PortfolioImage imageUrl={selectedPortfolio.image_url} title={selectedPortfolio.title} />
            </div>
            <div 
              className="text-white/80 mb-4 prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: selectedPortfolio.description 
                  ? (selectedPortfolio.description.includes('<') 
                      ? selectedPortfolio.description 
                      : `<p>${selectedPortfolio.description}</p>`)
                  : '<p>No description provided.</p>'
              }}
            />
            <div className="flex flex-wrap gap-2 mb-4">
              {normalizedSelectedTechStack.map((tech, i) => (
                <span key={i} className="px-3 py-1 bg-accent/20 border border-accent/30 rounded-lg text-accent text-sm">
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex gap-4">
              {selectedPortfolio.live_url && (
                <a href={selectedPortfolio.live_url} target="_blank" rel="noreferrer" className="px-4 py-2 bg-accent/20 rounded text-accent">
                  Live
                </a>
              )}
              {selectedPortfolio.github_url && (
                <a href={selectedPortfolio.github_url} target="_blank" rel="noreferrer" className="px-4 py-2 bg-secondary/20 rounded text-white/80">
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolios;

