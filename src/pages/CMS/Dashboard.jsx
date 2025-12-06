import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaSignOutAlt, FaUsers, FaProjectDiagram, FaTasks, 
  FaDollarSign, FaFolderOpen, FaFileAlt, FaEnvelope,
  FaChartLine, FaPlus
} from 'react-icons/fa';
import { fetchAdminBlogs, fetchAdminClients, fetchAdminProjects, fetchAdminPayments } from '../../utils/api.js';

const Dashboard = () => {
  const [stats, setStats] = useState({
    blogs: 0,
    clients: 0,
    projects: 0,
    payments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('cms_token');
    if (!token) {
      navigate('/cms/login');
      return;
    }
    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('cms_token');
      const [blogs, clients, projects, payments] = await Promise.all([
        fetchAdminBlogs(token).catch(() => []),
        fetchAdminClients(token).catch(() => []),
        fetchAdminProjects(token).catch(() => []),
        fetchAdminPayments(token).catch(() => [])
      ]);
      
      setStats({
        blogs: blogs.length || 0,
        clients: clients.length || 0,
        projects: projects.length || 0,
        payments: payments.length || 0
      });
    } catch (error) {
      if (error.message.includes('401') || error.message.includes('Token')) {
        localStorage.removeItem('cms_token');
        localStorage.removeItem('cms_user');
        navigate('/cms/login');
        return;
      }
      setError('Failed to fetch statistics');
    } finally {
      setLoading(false);
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

  const menuItems = [
    { icon: FaUsers, title: 'Clients', path: '/cms/clients', color: 'from-blue-500 to-blue-600', description: 'Manage all clients' },
    { icon: FaProjectDiagram, title: 'Projects', path: '/cms/projects', color: 'from-purple-500 to-purple-600', description: 'Manage projects & descriptions' },
    { icon: FaTasks, title: 'Milestones', path: '/cms/milestones', color: 'from-green-500 to-green-600', description: 'Track project milestones' },
    { icon: FaDollarSign, title: 'Payments', path: '/cms/payments', color: 'from-yellow-500 to-yellow-600', description: 'Manage payments & invoices' },
    { icon: FaFolderOpen, title: 'Portfolios', path: '/cms/portfolios', color: 'from-pink-500 to-pink-600', description: 'Manage portfolio items' },
    { icon: FaFileAlt, title: 'Blogs', path: '/cms/blogs', color: 'from-indigo-500 to-indigo-600', description: 'Manage blog posts' },
    { icon: FaEnvelope, title: 'Contact', path: '/cms/contact', color: 'from-teal-500 to-teal-600', description: 'View contact submissions' },
  ];

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <header className="bg-surface border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FaChartLine className="text-accent text-2xl" />
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-500/30 transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-surface rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Total Clients</p>
                <p className="text-3xl font-bold text-white">{stats.clients}</p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <FaUsers className="text-blue-400 text-2xl" />
              </div>
            </div>
          </div>
          <div className="bg-surface rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Active Projects</p>
                <p className="text-3xl font-bold text-white">{stats.projects}</p>
              </div>
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <FaProjectDiagram className="text-purple-400 text-2xl" />
              </div>
            </div>
          </div>
          <div className="bg-surface rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Blog Posts</p>
                <p className="text-3xl font-bold text-white">{stats.blogs}</p>
              </div>
              <div className="bg-indigo-500/20 p-3 rounded-lg">
                <FaFileAlt className="text-indigo-400 text-2xl" />
              </div>
            </div>
          </div>
          <div className="bg-surface rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Payments</p>
                <p className="text-3xl font-bold text-white">{stats.payments}</p>
              </div>
              <div className="bg-yellow-500/20 p-3 rounded-lg">
                <FaDollarSign className="text-yellow-400 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Management Sections */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Management Sections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={index}
                  to={item.path}
                  className="bg-surface rounded-xl p-6 border border-white/10 hover:border-accent/50 transition-all group"
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="text-white text-xl" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white/70 text-sm">{item.description}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-surface rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/cms/clients/new"
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-500/30 transition"
            >
              <FaPlus /> New Client
            </Link>
            <Link
              to="/cms/projects/new"
              className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-500/30 transition"
            >
              <FaPlus /> New Project
            </Link>
            <Link
              to="/cms/blogs/new"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-lg text-indigo-300 hover:bg-indigo-500/30 transition"
            >
              <FaPlus /> New Blog Post
            </Link>
            <Link
              to="/cms/portfolios/new"
              className="flex items-center gap-2 px-4 py-2 bg-pink-500/20 border border-pink-500/30 rounded-lg text-pink-300 hover:bg-pink-500/30 transition"
            >
              <FaPlus /> New Portfolio
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

