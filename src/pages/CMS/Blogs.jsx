import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSignOutAlt, FaFileAlt, FaArrowLeft, FaSearch, FaDownload, FaFileCsv, FaFileExcel, FaFilter } from 'react-icons/fa';
import { fetchAdminBlogs, deleteAdminBlog } from '../../utils/api.js';
import { filterData, downloadCSV, downloadExcel, createSearchCache } from '../../utils/exportUtils.js';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [allBlogs, setAllBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    published: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('cms_token');
    if (!token) {
      navigate('/cms/login');
      return;
    }
    fetchBlogs();
  }, [navigate]);

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem('cms_token');
      const data = await fetchAdminBlogs(token);
      setAllBlogs(data);
      setBlogs(data);
    } catch (error) {
      if (error.message.includes('401') || error.message.includes('Token')) {
        localStorage.removeItem('cms_token');
        localStorage.removeItem('cms_user');
        navigate('/cms/login');
        return;
      }
      setError('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  // Create search index cache for better performance
  const searchCache = useMemo(() => {
    if (allBlogs.length === 0) return null;
    return createSearchCache(allBlogs, ['title', 'content', 'category', 'slug']);
  }, [allBlogs]);

  // Filter blogs based on search and filters using FlexSearch
  const filteredBlogs = useMemo(() => {
    // Build filters object including published status
    const allFilters = {
      category: filters.category,
      published: filters.published !== '' ? filters.published : undefined
    };
    
    return filterData(
      allBlogs,
      searchTerm,
      ['title', 'content', 'category', 'slug'],
      allFilters,
      searchCache
    );
  }, [allBlogs, searchTerm, filters, searchCache]);

  // Update displayed blogs when filters change
  useEffect(() => {
    setBlogs(filteredBlogs);
  }, [filteredBlogs]);

  const handleExportCSV = () => {
    const headers = [
      { label: 'ID', key: 'id' },
      { label: 'Title', key: 'title' },
      { label: 'Category', key: 'category' },
      { label: 'Published', key: 'published' },
      { label: 'Featured', key: 'featured' },
      { label: 'Date', key: 'date' },
      { label: 'Slug', key: 'slug' }
    ];
    downloadCSV(filteredBlogs, headers, `blogs_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportExcel = () => {
    const headers = [
      { label: 'ID', key: 'id' },
      { label: 'Title', key: 'title' },
      { label: 'Category', key: 'category' },
      { label: 'Published', key: 'published' },
      { label: 'Featured', key: 'featured' },
      { label: 'Date', key: 'date' },
      { label: 'Slug', key: 'slug' }
    ];
    downloadExcel(filteredBlogs, headers, `blogs_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({ category: '', published: '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    try {
      const token = localStorage.getItem('cms_token');
      await deleteAdminBlog(id, token);
      setBlogs(blogs.filter(blog => blog.id !== id));
    } catch (error) {
      alert('Error deleting blog post: ' + error.message);
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
              <FaFileAlt className="text-accent text-2xl" />
              <h1 className="text-2xl font-bold text-white">Blogs Management</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/cms/blogs/new"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent to-accent2 text-white font-bold rounded-lg hover:opacity-90 transition"
            >
              <FaPlus /> New Blog Post
            </Link>
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
                placeholder="Search by title, content, category..."
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
                <label className="block text-white/70 text-sm mb-2">Published Status</label>
                <select
                  value={filters.published}
                  onChange={(e) => handleFilterChange('published', e.target.value)}
                  className="w-full px-4 py-2 bg-secondary border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent"
                >
                  <option value="">All</option>
                  <option value="true">Published</option>
                  <option value="false">Draft</option>
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
            Showing {filteredBlogs.length} of {allBlogs.length} blog posts
          </div>
        </div>

        <div className="bg-surface rounded-xl overflow-hidden border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-white font-semibold text-sm sm:text-base">Title</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-white font-semibold text-sm sm:text-base">Category</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-white font-semibold text-sm sm:text-base">Status</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-white font-semibold text-sm sm:text-base">Date</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-white font-semibold text-sm sm:text-base">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBlogs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-white/70">
                      {searchTerm || Object.values(filters).some(f => f) 
                        ? 'No blog posts match your search criteria.' 
                        : 'No blog posts found. Create your first blog post!'}
                    </td>
                  </tr>
                ) : (
                  filteredBlogs.map((blog) => (
                    <tr key={blog.id} className="border-t border-white/10 hover:bg-secondary/20 transition">
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="text-white font-medium text-sm sm:text-base">{blog.title}</div>
                        {blog.featured && (
                          <span className="text-xs text-accent">⭐ Featured</span>
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-white/70 text-sm sm:text-base">{blog.category || '-'}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                          blog.published
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        }`}>
                          {blog.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-white/70 text-sm sm:text-base">
                        {new Date(blog.date).toLocaleDateString()}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="flex justify-end gap-1 sm:gap-2">
                          <Link
                            to={`/blog/${blog.slug}`}
                            target="_blank"
                            className="p-1.5 sm:p-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-500/30 transition"
                            title="View"
                          >
                            <FaEye className="text-sm sm:text-base" />
                          </Link>
                          <Link
                            to={`/cms/blogs/edit/${blog.id}`}
                            className="p-1.5 sm:p-2 bg-accent/20 border border-accent/30 rounded-lg text-accent hover:bg-accent/30 transition"
                            title="Edit"
                          >
                            <FaEdit className="text-sm sm:text-base" />
                          </Link>
                          <button
                            onClick={() => handleDelete(blog.id)}
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
    </div>
  );
};

export default Blogs;

