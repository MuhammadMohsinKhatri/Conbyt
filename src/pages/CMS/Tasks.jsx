import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaPlus, FaEdit, FaTrash, FaUser, FaCalendar, FaFlag,
  FaCheckCircle, FaSpinner, FaEye, FaTimes
} from 'react-icons/fa';
import { 
  fetchAdminTasks, createAdminTask, updateAdminTask, deleteAdminTask, 
  fetchAdminUsers, fetchAdminProjects 
} from '../../utils/api.js';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const statuses = [
    { id: 'todo', label: 'To Do', color: 'bg-gray-500' },
    { id: 'in_progress', label: 'In Progress', color: 'bg-blue-500' },
    { id: 'review', label: 'Review', color: 'bg-yellow-500' },
    { id: 'done', label: 'Done', color: 'bg-green-500' }
  ];

  const priorities = [
    { id: 'low', label: 'Low', color: 'bg-gray-400' },
    { id: 'medium', label: 'Medium', color: 'bg-yellow-500' },
    { id: 'high', label: 'High', color: 'bg-orange-500' },
    { id: 'urgent', label: 'Urgent', color: 'bg-red-500' }
  ];

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
    
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('cms_token');
      const [tasksData, usersData, projectsData] = await Promise.all([
        fetchAdminTasks(token).catch(() => []),
        fetchAdminUsers(token).catch(() => []),
        fetchAdminProjects(token).catch(() => [])
      ]);
      
      setTasks(tasksData);
      setUsers(usersData);
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

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('cms_token');
      await deleteAdminTask(taskId, token);
      await fetchData();
    } catch (error) {
      setError(error.message || 'Failed to delete task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('cms_token');
      await updateAdminTask(taskId, { status: newStatus }, token);
      await fetchData();
    } catch (error) {
      setError(error.message || 'Failed to update task status');
    }
  };

  const canManageAll = user?.role === 'admin' || user?.role === 'task_manager';
  const canCreate = canManageAll || user?.role === 'task_creator';
  const canUpdate = canManageAll || user?.role === 'task_creator';

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const getPriorityColor = (priority) => {
    const priorityObj = priorities.find(p => p.id === priority);
    return priorityObj?.color || 'bg-gray-400';
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Task Board</h1>
            <p className="text-white/70">Manage and track your tasks</p>
          </div>
          {canCreate && (
            <button
              onClick={handleCreateTask}
              className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent2 rounded-lg text-white font-medium transition"
            >
              <FaPlus /> Create Task
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statuses.map((status) => {
            const statusTasks = getTasksByStatus(status.id);
            
            return (
              <div key={status.id} className="bg-surface rounded-lg border border-white/10 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
                    <h2 className="text-lg font-semibold text-white">{status.label}</h2>
                    <span className="bg-secondary/50 text-white/70 text-xs px-2 py-1 rounded">
                      {statusTasks.length}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3 min-h-[200px]">
                  {statusTasks.map((task) => {
                    const canEdit = canManageAll || task.created_by?.id === user?.id;
                    const assignedUsers = task.assigned_users || [];
                    
                    return (
                      <div
                        key={task.id}
                        className="bg-secondary/30 rounded-lg p-4 border border-white/5 hover:border-white/20 transition cursor-pointer"
                        onClick={() => handleEditTask(task)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-white font-medium text-sm flex-1">{task.title}</h3>
                          {canEdit && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTask(task.id);
                              }}
                              className="text-red-400 hover:text-red-300 ml-2"
                            >
                              <FaTrash className="text-xs" />
                            </button>
                          )}
                        </div>
                        
                        {task.description && (
                          <p className="text-white/60 text-xs mb-3 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className={`${getPriorityColor(task.priority)} text-white text-xs px-2 py-1 rounded`}>
                            {task.priority}
                          </span>
                          {task.project_title && (
                            <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded">
                              {task.project_title}
                            </span>
                          )}
                        </div>
                        
                        {task.due_date && (
                          <div className={`flex items-center gap-1 text-xs mb-2 ${
                            isOverdue(task.due_date) && task.status !== 'done' 
                              ? 'text-red-400' 
                              : 'text-white/60'
                          }`}>
                            <FaCalendar className="text-xs" />
                            {formatDate(task.due_date)}
                            {isOverdue(task.due_date) && task.status !== 'done' && (
                              <span className="text-red-400 ml-1">(Overdue)</span>
                            )}
                          </div>
                        )}
                        
                        {assignedUsers.length > 0 && (
                          <div className="flex items-center gap-2 mt-2">
                            <FaUser className="text-white/40 text-xs" />
                            <div className="flex -space-x-2">
                              {assignedUsers.slice(0, 3).map((user) => (
                                <div
                                  key={user.id}
                                  className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-white text-xs border-2 border-surface"
                                  title={user.username}
                                >
                                  {user.username.charAt(0).toUpperCase()}
                                </div>
                              ))}
                              {assignedUsers.length > 3 && (
                                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-white/70 text-xs border-2 border-surface">
                                  +{assignedUsers.length - 3}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {statusTasks.length === 0 && (
                    <div className="text-white/30 text-sm text-center py-8">
                      No tasks
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Task Modal */}
      {showModal && (
        <TaskModal
          task={editingTask}
          users={users}
          projects={projects}
          onClose={() => {
            setShowModal(false);
            setEditingTask(null);
          }}
          onSave={async (taskData) => {
            try {
              const token = localStorage.getItem('cms_token');
              if (editingTask) {
                await updateAdminTask(editingTask.id, taskData, token);
              } else {
                await createAdminTask(taskData, token);
              }
              await fetchData();
              setShowModal(false);
              setEditingTask(null);
            } catch (error) {
              setError(error.message || 'Failed to save task');
            }
          }}
          user={user}
          canManageAll={canManageAll}
        />
      )}
    </div>
  );
};

// Task Modal Component
const TaskModal = ({ task, users, projects, onClose, onSave, user, canManageAll }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    project_id: '',
    due_date: '',
    assigned_user_ids: []
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        project_id: task.project_id || '',
        due_date: task.due_date || '',
        assigned_user_ids: (task.assigned_users || []).map(u => u.id)
      });
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      project_id: formData.project_id || null,
      due_date: formData.due_date || null,
      assigned_user_ids: formData.assigned_user_ids
    };
    onSave(submitData);
  };

  const canEdit = canManageAll || task?.created_by?.id === user?.id;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-white/10 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {task ? 'Edit Task' : 'Create Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white"
          >
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-white/70 text-sm mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-secondary/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
              required
            />
          </div>
          
          <div>
            <label className="block text-white/70 text-sm mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-secondary/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
              rows="4"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/70 text-sm mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-secondary/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
                disabled={!canEdit && task}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>
            
            <div>
              <label className="block text-white/70 text-sm mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-secondary/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
                disabled={!canEdit && task}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/70 text-sm mb-2">Project</label>
              <select
                value={formData.project_id}
                onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                className="w-full bg-secondary/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
                disabled={!canEdit && task}
              >
                <option value="">No Project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-white/70 text-sm mb-2">Due Date</label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="w-full bg-secondary/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
                disabled={!canEdit && task}
              />
            </div>
          </div>
          
          {canManageAll && (
            <div>
              <label className="block text-white/70 text-sm mb-2">Assign To</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {users.map((u) => (
                  <label key={u.id} className="flex items-center gap-2 text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.assigned_user_ids.includes(u.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            assigned_user_ids: [...formData.assigned_user_ids, u.id]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            assigned_user_ids: formData.assigned_user_ids.filter(id => id !== u.id)
                          });
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{u.username} ({u.email})</span>
                    {u.role && (
                      <span className="text-xs text-white/50">({u.role})</span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-secondary/50 hover:bg-secondary rounded-lg text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-accent hover:bg-accent2 rounded-lg text-white font-medium transition"
            >
              {task ? 'Update' : 'Create'} Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Tasks;

