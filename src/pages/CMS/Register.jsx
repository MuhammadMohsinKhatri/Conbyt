import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaLock, FaUser, FaEnvelope, FaShieldAlt } from 'react-icons/fa';
import { adminRegister } from '../../utils/api.js';
import { useToast } from '../../contexts/ToastContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'task_creator'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.username || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await adminRegister(formData.username, formData.email, formData.password, formData.role);
      toast.success('Registration successful! Please log in.');
      navigate('/cms/login');
    } catch (error) {
      const errorMsg = error.message || 'Registration failed. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getRoleDescription = (role) => {
    const descriptions = {
      admin: 'Full access to all features and user management',
      task_manager: 'Can create, update, and manage all tasks',
      task_creator: 'Can create and update only their own tasks'
    };
    return descriptions[role] || descriptions.task_creator;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center px-4">
      <div className="bg-surface rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-white/70">Register for CMS Dashboard access</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white mb-2 font-medium">Username</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-primary/80 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent"
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-white mb-2 font-medium">Email</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-primary/80 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent"
                placeholder="Enter email"
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
                placeholder="Enter password (min. 6 characters)"
                required
                minLength={6}
              />
            </div>
          </div>

          <div>
            <label className="block text-white mb-2 font-medium">Confirm Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-primary/80 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent"
                placeholder="Confirm password"
                required
                minLength={6}
              />
            </div>
          </div>

          <div>
            <label className="block text-white mb-2 font-medium">Role</label>
            <div className="relative">
              <FaShieldAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 z-10" />
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-primary/80 border border-white/20 rounded-lg text-white focus:outline-none focus:border-accent appearance-none"
                required
              >
                <option value="task_creator">Task Creator</option>
                <option value="task_manager">Task Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <p className="text-white/50 text-xs mt-2">{getRoleDescription(formData.role)}</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-accent to-accent2 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-white/70 text-sm">
            Already have an account?{' '}
            <Link to="/cms/login" className="text-accent hover:text-accent2 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

