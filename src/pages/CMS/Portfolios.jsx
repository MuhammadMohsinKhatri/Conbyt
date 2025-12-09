import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaSignOutAlt, FaFolderOpen, FaArrowLeft } from 'react-icons/fa';
import ImageUpload from '../../components/CMS/ImageUpload';
import { fetchAdminPortfolios, fetchAdminProjects, deleteAdminPortfolio, createAdminPortfolio, updateAdminPortfolio } from '../../utils/api.js';

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
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  );
};

const Portfolios = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState(null);
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
      setPortfolios(portfoliosData);
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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this portfolio item?')) {
      return;
    }

    try {
      const token = localStorage.getItem('cms_token');
      await deleteAdminPortfolio(id, token);
      setPortfolios(portfolios.filter(portfolio => portfolio.id !== id));
    } catch (error) {
      alert('Error deleting portfolio: ' + error.message);
    }
  };

  const handleEdit = (portfolio) => {
    setEditingPortfolio(portfolio);
    const techStack = typeof portfolio.tech_stack === 'string' 
      ? JSON.parse(portfolio.tech_stack || '[]') 
      : portfolio.tech_stack || [];
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

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('cms_token');
      const submitData = {
        ...formData,
        project_id: formData.project_id ? parseInt(formData.project_id) : null,
        display_order: parseInt(formData.display_order) || 0,
        slug: formData.slug || generateSlug(formData.title)
      };
      
      console.log('Submitting portfolio with data:', submitData);
      console.log('Image URL being saved:', submitData.image_url);
      
      if (editingPortfolio) {
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
      fetchData();
    } catch (error) {
      alert('Error saving portfolio: ' + error.message);
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.length === 0 ? (
            <div className="col-span-full bg-surface rounded-xl p-12 text-center border border-white/10">
              <p className="text-white/70">No portfolio items found. Create your first portfolio item!</p>
            </div>
          ) : (
            portfolios.map((portfolio) => (
              <div key={portfolio.id} className="bg-surface rounded-xl overflow-hidden border border-white/10 hover:border-accent/50 transition">
                <PortfolioImage imageUrl={portfolio.image_url} title={portfolio.title} />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">{portfolio.title}</h3>
                    {portfolio.featured && (
                      <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded">Featured</span>
                    )}
                  </div>
                  <p className="text-white/70 text-sm mb-4 line-clamp-2">
                    {portfolio.description || 'No description'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">{portfolio.category || 'Uncategorized'}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(portfolio)}
                        className="p-2 bg-accent/20 border border-accent/30 rounded-lg text-accent hover:bg-accent/30 transition"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(portfolio.id)}
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
          <div className="bg-surface rounded-xl border border-white/10 p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingPortfolio ? 'Edit Portfolio' : 'New Portfolio'}
            </h2>
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
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-secondary border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                  rows="4"
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

export default Portfolios;

