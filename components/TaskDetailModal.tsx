'use client';

import { useState } from 'react';
import { Task, Priority, TaskStatus } from '@/lib/types';
import { X, Edit2, Trash2, Copy, Clock, AlertCircle, CheckCircle2, Circle, Calendar, Link as LinkIcon } from 'lucide-react';

interface TaskDetailModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
  onDuplicate: (taskId: string) => void;
  projectTitle?: string;
  projectMethodology?: string;
  projectTimeline?: string;
}

const statusIcons = {
  'todo': Circle,
  'in-progress': AlertCircle,
  'done': CheckCircle2,
};

const statusColors = {
  'todo': 'text-gray-400 bg-gray-50',
  'in-progress': 'text-yellow-600 bg-yellow-50',
  'done': 'text-green-600 bg-green-50',
};

const statusLabels = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'done': 'Done',
};

const priorityColors = {
  High: 'border-red-300 bg-red-100 text-red-700',
  Medium: 'border-orange-300 bg-orange-100 text-orange-700',
  Low: 'border-blue-300 bg-blue-100 text-blue-700',
};

export default function TaskDetailModal({
  task,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  onDuplicate,
  projectTitle,
  projectMethodology,
  projectTimeline,
}: TaskDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdate(task.id, editedTask);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTask(task);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(task.id);
    onClose();
  };

  const handleDuplicate = () => {
    onDuplicate(task.id);
    onClose();
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    onUpdate(task.id, { status: newStatus });
  };

  const StatusIcon = statusIcons[task.status];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />

        <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <StatusIcon className={`h-6 w-6 ${statusColors[task.status].split(' ')[0]}`} />
                <h2 className="text-2xl font-bold text-gray-900">Task Details</h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {!isEditing ? (
              <div className="space-y-6">
                {/* Project Context */}
                {(projectTitle || projectMethodology || projectTimeline) && (
                  <div className="rounded-lg bg-purple-50 border border-purple-200 p-4">
                    <h4 className="text-sm font-semibold text-purple-900 mb-2">Project Context</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      {projectTitle && (
                        <div>
                          <p className="text-purple-700 font-medium">Project</p>
                          <p className="text-purple-900">{projectTitle}</p>
                        </div>
                      )}
                      {projectMethodology && (
                        <div>
                          <p className="text-purple-700 font-medium">Methodology</p>
                          <p className="text-purple-900">{projectMethodology}</p>
                        </div>
                      )}
                      {projectTimeline && (
                        <div>
                          <p className="text-purple-700 font-medium">Timeline</p>
                          <p className="text-purple-900">{projectTimeline}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Title and Status */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{task.title}</h3>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Status:</label>
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${statusColors[task.status]}`}
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{task.description}</p>
                </div>

                {/* Jira Description */}
                {task.jiraDescription && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Technical Details</label>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{task.jiraDescription}</p>
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <span
                      className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${
                        priorityColors[task.priority]
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phase</label>
                    <p className="text-sm text-gray-900">{task.phase}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Hours</label>
                    <div className="flex items-center gap-1 text-sm text-gray-900">
                      <Clock className="h-4 w-4" />
                      {task.estimatedHours}h
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <div className="flex items-center gap-1 text-sm text-gray-900">
                      <Calendar className="h-4 w-4" />
                      {task.duration} {task.duration === 1 ? 'week' : 'weeks'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Week</label>
                    <p className="text-sm text-gray-900">Week {task.startWeek + 1}</p>
                  </div>
                </div>

                {/* Stakeholders */}
                {task.stakeholders && task.stakeholders.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stakeholders</label>
                    <div className="flex flex-wrap gap-2">
                      {task.stakeholders.map((stakeholder, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700"
                        >
                          {stakeholder}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Links */}
                {task.links && task.links.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Related Links</label>
                    <div className="space-y-1">
                      {task.links.map((link, index) => (
                        <a
                          key={index}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 hover:underline"
                        >
                          <LinkIcon className="h-4 w-4" />
                          {link}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-purple-600 bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit Task
                  </button>
                  <button
                    onClick={handleDuplicate}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Copy className="h-4 w-4" />
                    Duplicate
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              /* Edit Form */
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
                  <input
                    type="text"
                    value={editedTask.title}
                    onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={editedTask.description}
                    onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Technical Details</label>
                  <textarea
                    value={editedTask.jiraDescription}
                    onChange={(e) => setEditedTask({ ...editedTask, jiraDescription: e.target.value })}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      value={editedTask.priority}
                      onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value as Priority })}
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
                      value={editedTask.status}
                      onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value as TaskStatus })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Hours</label>
                    <input
                      type="number"
                      value={editedTask.estimatedHours}
                      onChange={(e) => setEditedTask({ ...editedTask, estimatedHours: parseInt(e.target.value) })}
                      min="1"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (weeks)</label>
                    <input
                      type="number"
                      value={editedTask.duration}
                      onChange={(e) => setEditedTask({ ...editedTask, duration: parseInt(e.target.value) })}
                      min="1"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleCancel}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Delete Task?</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            <p className="mb-6 text-sm text-gray-600">
              Are you sure you want to delete "{task.title}"?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
