'use client';

import { useState } from 'react';
import { Project, Priority, Methodology, ProjectStatus } from '@/lib/types';
import { X, Save } from 'lucide-react';

interface EditProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectId: string, updates: Partial<Project>) => void;
}

export default function EditProjectModal({
  project,
  isOpen,
  onClose,
  onSave,
}: EditProjectModalProps) {
  const [editedProject, setEditedProject] = useState({
    title: project.title,
    description: project.description,
    designBrief: project.designBrief || '',
    priority: project.priority || 'Medium',
    methodology: project.methodology,
    status: project.status,
    teamSize: project.teamSize,
    weeklyAvailability: project.weeklyAvailability,
    experienceLevel: project.experienceLevel,
    stakeholders: project.stakeholders?.join(', ') || '',
    productArea: project.productArea || '',
  });

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(project.id, {
      title: editedProject.title,
      description: editedProject.description,
      designBrief: editedProject.designBrief,
      priority: editedProject.priority as Priority,
      methodology: editedProject.methodology,
      status: editedProject.status,
      teamSize: editedProject.teamSize,
      weeklyAvailability: editedProject.weeklyAvailability,
      experienceLevel: editedProject.experienceLevel,
      stakeholders: editedProject.stakeholders
        ? editedProject.stakeholders.split(',').map(s => s.trim()).filter(Boolean)
        : undefined,
      productArea: editedProject.productArea || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />

        <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Project</h2>
              <p className="text-sm text-gray-600">Update project information and settings</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                <input
                  type="text"
                  value={editedProject.title}
                  onChange={(e) => setEditedProject({ ...editedProject, title: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={editedProject.description}
                  onChange={(e) => setEditedProject({ ...editedProject, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Design Brief</label>
                <textarea
                  value={editedProject.designBrief}
                  onChange={(e) => setEditedProject({ ...editedProject, designBrief: e.target.value })}
                  rows={5}
                  placeholder="Detailed project requirements, goals, and context..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={editedProject.priority}
                    onChange={(e) => setEditedProject({ ...editedProject, priority: e.target.value as Priority })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={editedProject.status}
                    onChange={(e) => setEditedProject({ ...editedProject, status: e.target.value as ProjectStatus })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  >
                    <option value="planning">Planning</option>
                    <option value="active">Active</option>
                    <option value="on-hold">On Hold</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Area</label>
                  <input
                    type="text"
                    value={editedProject.productArea}
                    onChange={(e) => setEditedProject({ ...editedProject, productArea: e.target.value })}
                    placeholder="e.g., Mobile, Web, Platform"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stakeholders</label>
                  <input
                    type="text"
                    value={editedProject.stakeholders}
                    onChange={(e) => setEditedProject({ ...editedProject, stakeholders: e.target.value })}
                    placeholder="Comma-separated names"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Project Settings */}
            <div className="space-y-4 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900">Project Settings</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Methodology</label>
                <select
                  value={editedProject.methodology}
                  onChange={(e) => setEditedProject({ ...editedProject, methodology: e.target.value as Methodology })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                >
                  <option value="Design Thinking">Design Thinking</option>
                  <option value="Double Diamond">Double Diamond</option>
                  <option value="Lean UX">Lean UX</option>
                  <option value="Design Sprint">Design Sprint</option>
                  <option value="Agile UX">Agile UX</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Team Size</label>
                  <input
                    type="number"
                    value={editedProject.teamSize}
                    onChange={(e) => setEditedProject({ ...editedProject, teamSize: parseInt(e.target.value) })}
                    min="1"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weekly Hours</label>
                  <input
                    type="number"
                    value={editedProject.weeklyAvailability}
                    onChange={(e) => setEditedProject({ ...editedProject, weeklyAvailability: parseInt(e.target.value) })}
                    min="1"
                    max="40"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                  <select
                    value={editedProject.experienceLevel}
                    onChange={(e) => setEditedProject({ ...editedProject, experienceLevel: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  >
                    <option value="Junior">Junior</option>
                    <option value="Mid-level">Mid-level</option>
                    <option value="Senior">Senior</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
