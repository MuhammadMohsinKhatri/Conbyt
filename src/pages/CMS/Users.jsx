import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEdit, FaShieldAlt, FaUserCheck, FaUserPlus, FaKey, FaTrash } from 'react-icons/fa';
import { fetchAllAdminUsers, updateAdminUserRole, updateUserPermissions } from '../../utils/api.js';
import { useToast } from '../../contexts/ToastContext';
import PermissionManager from '../../components/CMS/PermissionManager';

const SECTIONS = {
  tasks: { label: 'Tasks', icon: '📋' },
  projects: { label: 'Projects', icon: '📁' },
  clients: { label: 'Clients', icon: '👥' },
  portfolios: { label: 'Portfolios', icon: '🎨' },
  blogs: { label: 'Blogs', icon: '📝' },
  payments: { label: 'Payments', icon: '💰' },
  milestones: { label: 'Milestones', icon: '🎯' },
  users: { label: 'Users', icon: '👤' }
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [managingPermissions, setManagingPermissions] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const token = localStorage.getItem('cms_token');
    const userData = localStorage.getItem('cms_user');
    
    if (!token) {
      navigate('/cms/login');
      return;
    }
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Only admins can access this page
        if (parsedUser.role !== 'admin') {
          navigate('/cms/dashboard');
          return;
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('cms_token');
      const usersData = await fetchAllAdminUsers(token);
      setUsers(usersData);
    } catch (error) {
      if (error.message.includes('401') || error.message.includes('Token')) {
        localStorage.removeItem('cms_token');
        localStorage.removeItem('cms_user');
        toast.error('Session expired. Please log in again.');
        navigate('/cms/login');
        return;
      }
      const errorMsg = 'Failed to fetch users';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('cms_token');
      await updateAdminUserRole(userId, newRole, token);
      toast.success('User role updated successfully');
      await fetchUsers();
      setEditingUser(null);
      setError('');
    } catch (error) {
      const errorMsg = error.message || 'Failed to update user role';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handlePermissionsSave = async (permissions) => {
    try {
      const token = localStorage.getItem('cms_token');
      await updateUserPermissions(managingPermissions.id, permissions, token);
      toast.success('Permissions updated successfully');
      await fetchUsers();
      setManagingPermissions(null);
      setError('');
    } catch (error) {
      const errorMsg = error.message || 'Failed to update permissions';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: { color: 'bg-red-500/20 text-red-300 border-red-500/30', icon: FaShieldAlt, label: 'Admin' },
      task_manager: { color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: FaUserCheck, label: 'Task Manager' },
      task_creator: { color: 'bg-green-500/20 text-green-300 border-green-500/30', icon: FaUserPlus, label: 'Task Creator' }
    };
    
    const badge = badges[role] || badges.task_creator;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg border text-sm ${badge.color}`}>
        <Icon className="text-xs" />
        {badge.label}
      </span>
    );
  };

  const formatPermissions = (userPermissions) => {
    if (!userPermissions || Object.keys(userPermissions).length === 0) {
      return <span className="text-white/40 text-sm">No custom permissions</span>;
    }

    const sections = Object.keys(userPermissions);
    if (sections.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2">
        {sections.map(sectionId => {
          const section = SECTIONS[sectionId];
          const perms = userPermissions[sectionId] || [];
          const hasAll = perms.length === 4; // view, create, edit, delete
          
          return (
            <div
              key={sectionId}
              className="bg-secondary/30 border border-white/10 rounded px-2 py-1 text-xs"
              title={`${section?.label || sectionId}: ${hasAll ? 'All' : perms.join(', ')}`}
            >
              <span className="mr-1">{section?.icon || '📌'}</span>
              <span className="text-white/70">{section?.label || sectionId}</span>
              <span className="text-white/50 ml-1">
                ({hasAll ? 'All' : perms.length})
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-primary p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-white/70">Manage user roles and section-based permissions</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Users List */}
        <div className="bg-surface rounded-lg border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/30 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-white/70 font-medium text-sm">User</th>
                  <th className="px-6 py-4 text-left text-white/70 font-medium text-sm">Email</th>
                  <th className="px-6 py-4 text-left text-white/70 font-medium text-sm">Role</th>
                  <th className="px-6 py-4 text-left text-white/70 font-medium text-sm">Section Permissions</th>
                  <th className="px-6 py-4 text-left text-white/70 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-white/5 hover:bg-secondary/10">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-semibold">
                          {u.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-medium">{u.username}</p>
                          {u.id === user?.id && (
                            <p className="text-white/50 text-xs">(You)</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white/70">{u.email}</td>
                    <td className="px-6 py-4">
                      {editingUser?.id === u.id ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={editingUser.role}
                            onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                            className="bg-secondary/50 border border-white/10 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:border-accent"
                          >
                            <option value="admin">Admin</option>
                            <option value="task_manager">Task Manager</option>
                            <option value="task_creator">Task Creator</option>
                          </select>
                          <button
                            onClick={() => handleRoleChange(u.id, editingUser.role)}
                            className="px-3 py-1 bg-accent hover:bg-accent2 rounded-lg text-white text-sm transition"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingUser(null)}
                            className="px-3 py-1 bg-secondary/50 hover:bg-secondary rounded-lg text-white text-sm transition"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {getRoleBadge(u.role || 'task_creator')}
                          {u.role !== 'admin' && (
                            <button
                              onClick={() => setEditingUser({ id: u.id, role: u.role || 'task_creator' })}
                              className="text-white/50 hover:text-white transition"
                              title="Edit Role"
                            >
                              <FaEdit className="text-xs" />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {formatPermissions(u.permissions)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setManagingPermissions(u)}
                          className="flex items-center gap-2 px-3 py-1 bg-accent/20 hover:bg-accent/30 border border-accent/30 rounded-lg text-white text-sm transition"
                          title="Manage Permissions"
                        >
                          <FaKey className="text-xs" />
                          Permissions
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface rounded-lg border border-white/10 p-4">
            <div className="flex items-center gap-2 mb-2">
              <FaShieldAlt className="text-red-400" />
              <h3 className="text-white font-semibold">Admin</h3>
            </div>
            <p className="text-white/60 text-sm">
              Full access to all features, user management, and system settings. Can manage all permissions.
            </p>
          </div>
          
          <div className="bg-surface rounded-lg border border-white/10 p-4">
            <div className="flex items-center gap-2 mb-2">
              <FaKey className="text-blue-400" />
              <h3 className="text-white font-semibold">Section Permissions</h3>
            </div>
            <p className="text-white/60 text-sm">
              Grant specific access to sections (Tasks, Projects, Blogs, etc.) with granular permissions (View, Create, Edit, Delete).
            </p>
          </div>
          
          <div className="bg-surface rounded-lg border border-white/10 p-4">
            <div className="flex items-center gap-2 mb-2">
              <FaUserCheck className="text-green-400" />
              <h3 className="text-white font-semibold">Flexible Access</h3>
            </div>
            <p className="text-white/60 text-sm">
              Mix and match sections and permissions. Users can have access to one or multiple sections with different permission levels.
            </p>
          </div>
        </div>
      </div>

      {/* Permission Manager Modal */}
      {managingPermissions && (
        <PermissionManager
          user={managingPermissions}
          currentUserRole={user?.role}
          onSave={handlePermissionsSave}
          onCancel={() => setManagingPermissions(null)}
        />
      )}
    </div>
  );
};

export default Users;
