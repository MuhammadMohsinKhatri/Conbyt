import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  FaUsers, FaProjectDiagram, FaTasks, 
  FaDollarSign, FaFolderOpen, FaFileAlt, FaEnvelope,
  FaPlus, FaSignOutAlt, FaUserCircle, FaChartLine, FaHome
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
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('cms_token');
    const userData = localStorage.getItem('cms_user');
    if (!token) {
      navigate('/cms/login');
      return;
    }
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
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
    { icon: FaUsers, title: 'Clients', path: '/cms/clients', color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
    { icon: FaProjectDiagram, title: 'Projects', path: '/cms/projects', color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
    { icon: FaTasks, title: 'Milestones', path: '/cms/milestones', color: 'text-green-400', bgColor: 'bg-green-500/20' },
    { icon: FaDollarSign, title: 'Payments', path: '/cms/payments', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' },
    { icon: FaFolderOpen, title: 'Portfolios', path: '/cms/portfolios', color: 'text-pink-400', bgColor: 'bg-pink-500/20' },
    { icon: FaFileAlt, title: 'Blogs', path: '/cms/blogs', color: 'text-indigo-400', bgColor: 'bg-indigo-500/20' },
    { icon: FaEnvelope, title: 'Contact', path: '/cms/contact', color: 'text-teal-400', bgColor: 'bg-teal-500/20' },
  ];

  const totalItems = stats.clients + stats.projects + stats.blogs + stats.payments;
  const maxStat = Math.max(stats.clients, stats.projects, stats.blogs, stats.payments) || 1;

  return (
    <div className="min-h-screen bg-primary flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-surface border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-accent to-accent2 flex items-center justify-center">
              <FaChartLine className="text-white text-xl" />
            </div>
            <h1 className="text-xl font-bold text-white">CMS</h1>
          </div>
          <p className="text-white/50 text-sm">Admin Dashboard</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/cms/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              location.pathname === '/cms/dashboard'
                ? 'bg-accent/20 text-accent border-l-4 border-accent'
                : 'text-white/70 hover:bg-white/5 hover:text-white'
            }`}
          >
            <FaHome className="text-lg" />
            <span className="font-medium">Dashboard</span>
          </Link>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-accent/20 text-accent border-l-4 border-accent'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="text-lg" />
                <span className="font-medium">{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-surface border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Dashboard</h2>
            <p className="text-white/50 text-sm">Welcome back, {user?.username || user?.email || 'Admin'}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-secondary/50 rounded-lg">
              <FaUserCircle className="text-white/70 text-xl" />
              <div className="text-right">
                <p className="text-white text-sm font-medium">{user?.username || 'Admin'}</p>
                <p className="text-white/50 text-xs">{user?.email || 'admin@conbyt.com'}</p>
              </div>
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
        <main className="flex-1 p-6 overflow-y-auto">
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-surface rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className={`${menuItems[0].bgColor} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                  <FaUsers className={`${menuItems[0].color} text-2xl`} />
                </div>
                <div className="text-right">
                  <p className="text-white/70 text-sm">Total Clients</p>
                  <p className="text-3xl font-bold text-white">{stats.clients}</p>
                </div>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${(stats.clients / maxStat) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-surface rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className={`${menuItems[1].bgColor} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                  <FaProjectDiagram className={`${menuItems[1].color} text-2xl`} />
                </div>
                <div className="text-right">
                  <p className="text-white/70 text-sm">Active Projects</p>
                  <p className="text-3xl font-bold text-white">{stats.projects}</p>
                </div>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all"
                  style={{ width: `${(stats.projects / maxStat) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-surface rounded-xl p-6 border border-white/10 hover:border-indigo-500/50 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className={`${menuItems[5].bgColor} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                  <FaFileAlt className={`${menuItems[5].color} text-2xl`} />
                </div>
                <div className="text-right">
                  <p className="text-white/70 text-sm">Blog Posts</p>
                  <p className="text-3xl font-bold text-white">{stats.blogs}</p>
                </div>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-indigo-500 h-2 rounded-full transition-all"
                  style={{ width: `${(stats.blogs / maxStat) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-surface rounded-xl p-6 border border-white/10 hover:border-yellow-500/50 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className={`${menuItems[3].bgColor} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                  <FaDollarSign className={`${menuItems[3].color} text-2xl`} />
                </div>
                <div className="text-right">
                  <p className="text-white/70 text-sm">Payments</p>
                  <p className="text-3xl font-bold text-white">{stats.payments}</p>
                </div>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all"
                  style={{ width: `${(stats.payments / maxStat) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Charts and Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Distribution Chart */}
            <div className="bg-surface rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6">Content Distribution</h3>
              <div className="space-y-4">
                {[
                  { label: 'Clients', value: stats.clients, color: 'bg-blue-500', percentage: totalItems ? (stats.clients / totalItems * 100) : 0 },
                  { label: 'Projects', value: stats.projects, color: 'bg-purple-500', percentage: totalItems ? (stats.projects / totalItems * 100) : 0 },
                  { label: 'Blogs', value: stats.blogs, color: 'bg-indigo-500', percentage: totalItems ? (stats.blogs / totalItems * 100) : 0 },
                  { label: 'Payments', value: stats.payments, color: 'bg-yellow-500', percentage: totalItems ? (stats.payments / totalItems * 100) : 0 },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-2">
                      <span className="text-white/70 text-sm">{item.label}</span>
                      <span className="text-white font-medium">{item.value} ({item.percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-3">
                      <div 
                        className={`${item.color} h-3 rounded-full transition-all`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-surface rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/cms/clients/new"
                  className="flex flex-col items-center justify-center p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-500/30 transition group"
                >
                  <FaPlus className="text-2xl mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">New Client</span>
                </Link>
                <Link
                  to="/cms/projects/new"
                  className="flex flex-col items-center justify-center p-4 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-500/30 transition group"
                >
                  <FaPlus className="text-2xl mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">New Project</span>
                </Link>
                <Link
                  to="/cms/blogs/new"
                  className="flex flex-col items-center justify-center p-4 bg-indigo-500/20 border border-indigo-500/30 rounded-lg text-indigo-300 hover:bg-indigo-500/30 transition group"
                >
                  <FaPlus className="text-2xl mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">New Blog</span>
                </Link>
                <Link
                  to="/cms/portfolios/new"
                  className="flex flex-col items-center justify-center p-4 bg-pink-500/20 border border-pink-500/30 rounded-lg text-pink-300 hover:bg-pink-500/30 transition group"
                >
                  <FaPlus className="text-2xl mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">New Portfolio</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="bg-surface rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-secondary/30 rounded-lg">
                <p className="text-white/50 text-sm mb-1">Total Items</p>
                <p className="text-2xl font-bold text-white">{totalItems}</p>
              </div>
              <div className="text-center p-4 bg-secondary/30 rounded-lg">
                <p className="text-white/50 text-sm mb-1">Active Content</p>
                <p className="text-2xl font-bold text-white">{stats.projects + stats.blogs}</p>
              </div>
              <div className="text-center p-4 bg-secondary/30 rounded-lg">
                <p className="text-white/50 text-sm mb-1">Clients</p>
                <p className="text-2xl font-bold text-white">{stats.clients}</p>
              </div>
              <div className="text-center p-4 bg-secondary/30 rounded-lg">
                <p className="text-white/50 text-sm mb-1">Transactions</p>
                <p className="text-2xl font-bold text-white">{stats.payments}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

