import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaLock, FaUser } from 'react-icons/fa';
import { adminLogin } from '../../utils/api.js';
import { useToast } from '../../contexts/ToastContext';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await adminLogin(formData.username, formData.password);
      localStorage.setItem('cms_token', data.token);
      localStorage.setItem('cms_user', JSON.stringify(data.user));
      toast.success('Login successful! Welcome back.');
      navigate('/cms/dashboard');
    } catch (error) {
      const errorMsg = error.message || 'Network error. Please check if the server is running.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center px-4">
      <div className="bg-surface rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">CMS Dashboard</h1>
          <p className="text-white/70">Sign in to manage your content</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white mb-2 font-medium">Username or Email</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-primary/80 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent"
                placeholder="Enter username or email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-white mb-2 font-medium">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-primary/80 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-accent to-accent2 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-white/70 text-sm">
            Don't have an account?{' '}
            <Link to="/cms/register" className="text-accent hover:text-accent2 font-medium">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

