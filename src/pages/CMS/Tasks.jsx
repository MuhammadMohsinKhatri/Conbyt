import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaPlus, FaEdit, FaTrash, FaUser, FaCalendar, FaFlag,
  FaCheckCircle, FaSpinner, FaEye, FaTimes, FaSearch, FaFilter,
  FaList, FaTh, FaDownload, FaFileCsv, FaFileExcel
} from 'react-icons/fa';
import { 
  fetchAdminTasks, createAdminTask, updateAdminTask, deleteAdminTask, 
  fetchAdminUsers, fetchAdminProjects 
} from '../../utils/api.js';
import { filterData, downloadCSV, downloadExcel, createSearchCache } from '../../utils/exportUtils.js';
import { useToast } from '../../contexts/ToastContext';

const Tasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [user, setUser] = useState(null);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    assigned_user_id: '',
    project_id: '',
    due_date_from: '',
    due_date_to: ''
  });
  const navigate = useNavigate();
  const toast = useToast();

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
      
      setAllTasks(tasksData);
      setTasks(tasksData);
      setUsers(usersData);
      setProjects(projectsData);
      setError('');
    } catch (error) {
      if (error.message.includes('401') || error.message.includes('Token')) {
        localStorage.removeItem('cms_token');
        localStorage.removeItem('cms_user');
        toast.error('Session expired. Please log in again.');
        navigate('/cms/login');
        return;
      }
      const errorMsg = error.message || 'Failed to fetch data';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Create search index cache for better performance
  const searchCache = useMemo(() => {
    if (allTasks.length === 0) return null;
    return createSearchCache(allTasks, ['title', 'description', 'project_title']);
  }, [allTasks]);

  // Filter tasks based on search and filters
  const filteredTasks = useMemo(() => {
    let filtered = [...allTasks];

    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(task => {
        const title = (task.title || '').toLowerCase();
        const description = (task.description || '').toLowerCase();
        const projectTitle = (task.project_title || '').toLowerCase();
        return title.includes(searchLower) || 
               description.includes(searchLower) || 
               projectTitle.includes(searchLower);
      });
    }

    // Apply filters
    if (filters.status) {
      filtered = filtered.filter(task => task.status === filters.status);
    }
    if (filters.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }
    if (filters.assigned_user_id) {
      if (filters.assigned_user_id === 'unassigned') {
        filtered = filtered.filter(task => 
          !task.assigned_users || task.assigned_users.length === 0
        );
      } else {
        filtered = filtered.filter(task => 
          (task.assigned_users || []).some(u => u.id === parseInt(filters.assigned_user_id))
        );
      }
    }
    if (filters.project_id) {
      filtered = filtered.filter(task => task.project_id === parseInt(filters.project_id));
    }
    if (filters.due_date_from) {
      filtered = filtered.filter(task => {
        if (!task.due_date) return false;
        return new Date(task.due_date) >= new Date(filters.due_date_from);
      });
    }
    if (filters.due_date_to) {
      filtered = filtered.filter(task => {
        if (!task.due_date) return false;
        return new Date(task.due_date) <= new Date(filters.due_date_to);
      });
    }

    return filtered;
  }, [allTasks, searchTerm, filters]);

  // Update displayed tasks when filters change
  useEffect(() => {
    setTasks(filteredTasks);
  }, [filteredTasks]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      status: '',
      priority: '',
      assigned_user_id: '',
      project_id: '',
      due_date_from: '',
      due_date_to: ''
    });
  };

  const handleExportCSV = () => {
    try {
      const headers = [
        { label: 'ID', key: 'id' },
        { label: 'Title', key: 'title' },
        { label: 'Description', key: 'description' },
        { label: 'Status', key: 'status' },
        { label: 'Priority', key: 'priority' },
        { label: 'Project', key: 'project_title' },
        { label: 'Due Date', key: 'due_date' },
        { label: 'Created By', key: 'created_by.username' },
        { label: 'Assigned Users', key: 'assigned_users' }
      ];
      
      const exportData = filteredTasks.map(task => ({
        ...task,
        'created_by.username': task.created_by?.username || '',
        'assigned_users': (task.assigned_users || []).map(u => u.username).join(', ')
      }));
      
      downloadCSV(exportData, headers, `tasks_${new Date().toISOString().split('T')[0]}.csv`);
      toast.success('Tasks exported to CSV successfully');
    } catch (error) {
      toast.error('Failed to export CSV: ' + (error.message || 'Unknown error'));
    }
  };

  const handleExportExcel = () => {
    try {
      const headers = [
        { label: 'ID', key: 'id' },
        { label: 'Title', key: 'title' },
        { label: 'Description', key: 'description' },
        { label: 'Status', key: 'status' },
        { label: 'Priority', key: 'priority' },
        { label: 'Project', key: 'project_title' },
        { label: 'Due Date', key: 'due_date' },
        { label: 'Created By', key: 'created_by.username' },
        { label: 'Assigned Users', key: 'assigned_users' }
      ];
      
      const exportData = filteredTasks.map(task => ({
        ...task,
        'created_by.username': task.created_by?.username || '',
        'assigned_users': (task.assigned_users || []).map(u => u.username).join(', ')
      }));
      
      downloadExcel(exportData, headers, `tasks_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success('Tasks exported to Excel successfully');
    } catch (error) {
      toast.error('Failed to export Excel: ' + (error.message || 'Unknown error'));
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
      toast.success('Task deleted successfully');
      await fetchData();
    } catch (error) {
      const errorMsg = error.message || 'Failed to delete task';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('cms_token');
      await updateAdminTask(taskId, { status: newStatus }, token);
      toast.success('Task status updated successfully');
      await fetchData();
    } catch (error) {
      const errorMsg = error.message || 'Failed to update task status';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const canManageAll = user?.role === 'admin' || user?.role === 'task_manager';
  const canCreate = canManageAll || user?.role === 'task_creator';
  const canUpdate = canManageAll || user?.role === 'task_creator';

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const getAssignedUserNames = (task) => {
    if (!task.assigned_users || task.assigned_users.length === 0) return 'Unassigned';
    return task.assigned_users.map(u => u.username).join(', ');
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
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-surface rounded-lg border border-white/10 p-1">
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-2 rounded transition ${
                  viewMode === 'kanban' 
                    ? 'bg-accent text-white' 
                    : 'text-white/70 hover:text-white'
                }`}
                title="Kanban View"
              >
                <FaTh />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition ${
                  viewMode === 'list' 
                    ? 'bg-accent text-white' 
                    : 'text-white/70 hover:text-white'
                }`}
                title="List View"
              >
                <FaList />
              </button>
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
        </div>

        {/* Search and Filters */}
        <div className="bg-surface rounded-lg border border-white/10 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                <input
                  type="text"
                  placeholder="Search tasks by title, description, or project..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                showFilters || Object.values(filters).some(f => f)
                  ? 'bg-accent/20 text-accent border border-accent'
                  : 'bg-secondary/50 text-white/70 hover:bg-secondary border border-white/10'
              }`}
            >
              <FaFilter />
              Filters
              {(Object.values(filters).some(f => f) || searchTerm) && (
                <span className="bg-accent text-white text-xs px-2 py-0.5 rounded-full">
                  {Object.values(filters).filter(f => f).length + (searchTerm ? 1 : 0)}
                </span>
              )}
            </button>

            {/* Export Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-300 transition"
                title="Export to CSV"
              >
                <FaFileCsv />
              </button>
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-300 transition"
                title="Export to Excel"
              >
                <FaFileExcel />
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-4 py-2 bg-secondary/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent"
                >
                  <option value="">All Statuses</option>
                  {statuses.map(status => (
                    <option key={status.id} value={status.id}>{status.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Priority</label>
                <select
                  value={filters.priority}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                  className="w-full px-4 py-2 bg-secondary/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent"
                >
                  <option value="">All Priorities</option>
                  {priorities.map(priority => (
                    <option key={priority.id} value={priority.id}>{priority.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Assigned To</label>
                <select
                  value={filters.assigned_user_id}
                  onChange={(e) => handleFilterChange('assigned_user_id', e.target.value)}
                  className="w-full px-4 py-2 bg-secondary/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent"
                >
                  <option value="">All Users</option>
                  <option value="unassigned">Unassigned</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.username} ({u.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Project</label>
                <select
                  value={filters.project_id}
                  onChange={(e) => handleFilterChange('project_id', e.target.value)}
                  className="w-full px-4 py-2 bg-secondary/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent"
                >
                  <option value="">All Projects</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Due Date From</label>
                <input
                  type="date"
                  value={filters.due_date_from}
                  onChange={(e) => handleFilterChange('due_date_from', e.target.value)}
                  className="w-full px-4 py-2 bg-secondary/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Due Date To</label>
                <input
                  type="date"
                  value={filters.due_date_to}
                  onChange={(e) => handleFilterChange('due_date_to', e.target.value)}
                  className="w-full px-4 py-2 bg-secondary/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent"
                />
              </div>

              {(searchTerm || Object.values(filters).some(f => f)) && (
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-500/30 transition"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Results Count */}
          <div className="mt-4 text-white/50 text-sm">
            Showing {filteredTasks.length} of {allTasks.length} tasks
          </div>
        </div>


        {/* View Mode Toggle */}
        {viewMode === 'kanban' ? (
          /* Kanban Board */
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
        ) : (
          /* List View */
          <div className="bg-surface rounded-lg border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/30 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-white/70 font-medium text-sm">Title</th>
                    <th className="px-6 py-4 text-left text-white/70 font-medium text-sm">Status</th>
                    <th className="px-6 py-4 text-left text-white/70 font-medium text-sm">Priority</th>
                    <th className="px-6 py-4 text-left text-white/70 font-medium text-sm">Project</th>
                    <th className="px-6 py-4 text-left text-white/70 font-medium text-sm">Assigned To</th>
                    <th className="px-6 py-4 text-left text-white/70 font-medium text-sm">Due Date</th>
                    <th className="px-6 py-4 text-left text-white/70 font-medium text-sm">Created By</th>
                    <th className="px-6 py-4 text-left text-white/70 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-8 text-center text-white/50">
                        No tasks found
                      </td>
                    </tr>
                  ) : (
                    tasks.map((task) => {
                      const canEdit = canManageAll || task.created_by?.id === user?.id;
                      const assignedUsers = task.assigned_users || [];
                      
                      return (
                        <tr key={task.id} className="border-b border-white/5 hover:bg-secondary/10">
                          <td className="px-6 py-4">
                            <div>
                              <h3 className="text-white font-medium">{task.title}</h3>
                              {task.description && (
                                <p className="text-white/60 text-xs mt-1 line-clamp-1">
                                  {task.description}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                              task.status === 'done' ? 'bg-green-500/20 text-green-300' :
                              task.status === 'in_progress' ? 'bg-blue-500/20 text-blue-300' :
                              task.status === 'review' ? 'bg-yellow-500/20 text-yellow-300' :
                              'bg-gray-500/20 text-gray-300'
                            }`}>
                              {statuses.find(s => s.id === task.status)?.label || task.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`${getPriorityColor(task.priority)} text-white text-xs px-2 py-1 rounded`}>
                              {task.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-white/70 text-sm">
                            {task.project_title || '-'}
                          </td>
                          <td className="px-6 py-4">
                            {assignedUsers.length > 0 ? (
                              <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                  {assignedUsers.slice(0, 3).map((u) => (
                                    <div
                                      key={u.id}
                                      className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-white text-xs border-2 border-surface"
                                      title={u.username}
                                    >
                                      {u.username.charAt(0).toUpperCase()}
                                    </div>
                                  ))}
                                  {assignedUsers.length > 3 && (
                                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-white/70 text-xs border-2 border-surface">
                                      +{assignedUsers.length - 3}
                                    </div>
                                  )}
                                </div>
                                <span className="text-white/60 text-xs ml-2">
                                  {assignedUsers.length} user{assignedUsers.length !== 1 ? 's' : ''}
                                </span>
                              </div>
                            ) : (
                              <span className="text-white/40 text-sm">Unassigned</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {task.due_date ? (
                              <div className={`text-sm ${
                                isOverdue(task.due_date) && task.status !== 'done'
                                  ? 'text-red-400'
                                  : 'text-white/70'
                              }`}>
                                {formatDate(task.due_date)}
                                {isOverdue(task.due_date) && task.status !== 'done' && (
                                  <span className="text-red-400 ml-1 text-xs">(Overdue)</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-white/40 text-sm">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-white/70 text-sm">
                            {task.created_by?.username || '-'}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditTask(task)}
                                className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded transition"
                                title="Edit Task"
                              >
                                <FaEdit />
                              </button>
                              {canEdit && (
                                <button
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition"
                                  title="Delete Task"
                                >
                                  <FaTrash />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
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
                toast.success('Task updated successfully');
              } else {
                await createAdminTask(taskData, token);
                toast.success('Task created successfully');
              }
              await fetchData();
              setShowModal(false);
              setEditingTask(null);
              setError('');
            } catch (error) {
              const errorMsg = error.message || 'Failed to save task';
              setError(errorMsg);
              toast.error(errorMsg);
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

