import React, { useState } from 'react';
import { FaCheck, FaTimes, FaEdit, FaTrash, FaEye, FaPlus, FaSave } from 'react-icons/fa';

const SECTIONS = [
  { id: 'tasks', label: 'Task Management', icon: '📋' },
  { id: 'projects', label: 'Projects', icon: '📁' },
  { id: 'clients', label: 'Clients', icon: '👥' },
  { id: 'portfolios', label: 'Portfolios', icon: '🎨' },
  { id: 'blogs', label: 'Blogs', icon: '📝' },
  { id: 'payments', label: 'Payments', icon: '💰' },
  { id: 'milestones', label: 'Milestones', icon: '🎯' },
  { id: 'users', label: 'User Management', icon: '👤', adminOnly: true }
];

const PERMISSIONS = [
  { id: 'view', label: 'View', icon: FaEye },
  { id: 'create', label: 'Create', icon: FaPlus },
  { id: 'edit', label: 'Edit', icon: FaEdit },
  { id: 'delete', label: 'Delete', icon: FaTrash }
];

const PermissionManager = ({ user, onSave, onCancel, currentUserRole }) => {
  // Admins automatically have all permissions, so don't show permission manager for them
  if (user.role === 'admin') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-surface rounded-lg border border-white/10 max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Admin User</h2>
            <button
              onClick={onCancel}
              className="text-white/70 hover:text-white transition"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
          <p className="text-white/70 mb-4">
            Admin users automatically have full access to all sections and permissions. 
            No custom permissions are needed.
          </p>
          <button
            onClick={onCancel}
            className="w-full px-4 py-2 bg-accent hover:bg-accent2 rounded-lg text-white transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const [selectedSections, setSelectedSections] = useState(
    user.permissions ? Object.keys(user.permissions) : []
  );
  const [sectionPermissions, setSectionPermissions] = useState(
    user.permissions || {}
  );

  const handleSectionToggle = (sectionId) => {
    if (sectionId === 'users' && currentUserRole !== 'admin') {
      return; // Only admins can manage user permissions
    }

    if (selectedSections.includes(sectionId)) {
      // Remove section
      setSelectedSections(selectedSections.filter(s => s !== sectionId));
      const newPermissions = { ...sectionPermissions };
      delete newPermissions[sectionId];
      setSectionPermissions(newPermissions);
    } else {
      // Add section with default permissions
      setSelectedSections([...selectedSections, sectionId]);
      setSectionPermissions({
        ...sectionPermissions,
        [sectionId]: ['view'] // Default to view only
      });
    }
  };

  const handlePermissionToggle = (sectionId, permissionId) => {
    const currentPerms = sectionPermissions[sectionId] || [];
    
    if (permissionId === 'all') {
      // Toggle all permissions
      if (currentPerms.length === PERMISSIONS.length) {
        setSectionPermissions({
          ...sectionPermissions,
          [sectionId]: []
        });
      } else {
        setSectionPermissions({
          ...sectionPermissions,
          [sectionId]: PERMISSIONS.map(p => p.id)
        });
      }
    } else {
      // Toggle individual permission
      if (currentPerms.includes(permissionId)) {
        setSectionPermissions({
          ...sectionPermissions,
          [sectionId]: currentPerms.filter(p => p !== permissionId)
        });
      } else {
        setSectionPermissions({
          ...sectionPermissions,
          [sectionId]: [...currentPerms, permissionId]
        });
      }
    }
  };

  const handleSave = () => {
    // Only include selected sections
    const permissionsToSave = {};
    selectedSections.forEach(sectionId => {
      if (sectionPermissions[sectionId] && sectionPermissions[sectionId].length > 0) {
        permissionsToSave[sectionId] = sectionPermissions[sectionId];
      }
    });
    
    onSave(permissionsToSave);
  };

  const hasAllPermissions = (sectionId) => {
    const perms = sectionPermissions[sectionId] || [];
    return PERMISSIONS.every(p => perms.includes(p.id));
  };

  const getSection = (sectionId) => SECTIONS.find(s => s.id === sectionId);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Manage Permissions
              </h2>
              <p className="text-white/70 text-sm">
                {user.username} ({user.email})
              </p>
            </div>
            <button
              onClick={onCancel}
              className="text-white/70 hover:text-white transition"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Section Selection */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-4">Select Sections</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {SECTIONS.map(section => {
                const isSelected = selectedSections.includes(section.id);
                const disabled = section.adminOnly && currentUserRole !== 'admin';
                
                return (
                  <button
                    key={section.id}
                    onClick={() => !disabled && handleSectionToggle(section.id)}
                    disabled={disabled}
                    className={`p-4 rounded-lg border-2 transition text-left ${
                      isSelected
                        ? 'border-accent bg-accent/20 text-white'
                        : 'border-white/10 bg-secondary/30 text-white/70 hover:border-white/20'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="text-2xl mb-2">{section.icon}</div>
                    <div className="text-sm font-medium">{section.label}</div>
                    {section.adminOnly && (
                      <div className="text-xs text-white/50 mt-1">Admin Only</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Permissions for Selected Sections */}
          {selectedSections.length > 0 && (
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-4">Set Permissions</h3>
              <div className="space-y-4">
                {selectedSections.map(sectionId => {
                  const section = getSection(sectionId);
                  const perms = sectionPermissions[sectionId] || [];
                  const allSelected = hasAllPermissions(sectionId);

                  return (
                    <div
                      key={sectionId}
                      className="bg-secondary/20 rounded-lg border border-white/10 p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{section.icon}</span>
                          <h4 className="text-white font-medium">{section.label}</h4>
                        </div>
                        <button
                          onClick={() => handlePermissionToggle(sectionId, 'all')}
                          className={`px-3 py-1 rounded text-sm transition ${
                            allSelected
                              ? 'bg-accent text-white'
                              : 'bg-secondary/50 text-white/70 hover:bg-secondary'
                          }`}
                        >
                          {allSelected ? 'All Selected' : 'Select All'}
                        </button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {PERMISSIONS.map(permission => {
                          const Icon = permission.icon;
                          const isSelected = perms.includes(permission.id);

                          return (
                            <button
                              key={permission.id}
                              onClick={() => handlePermissionToggle(sectionId, permission.id)}
                              className={`flex items-center gap-2 p-3 rounded-lg border transition ${
                                isSelected
                                  ? 'border-accent bg-accent/20 text-white'
                                  : 'border-white/10 bg-secondary/30 text-white/70 hover:border-white/20'
                              }`}
                            >
                              {isSelected ? (
                                <FaCheck className="text-accent" />
                              ) : (
                                <div className="w-4 h-4 border border-white/30 rounded" />
                              )}
                              <Icon className="text-sm" />
                              <span className="text-sm">{permission.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-secondary/50 hover:bg-secondary rounded-lg text-white transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-accent hover:bg-accent2 rounded-lg text-white transition flex items-center gap-2"
            >
              <FaSave />
              Save Permissions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionManager;

