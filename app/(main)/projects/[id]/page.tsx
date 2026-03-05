'use client';

import { useState, use } from 'react';
import { useProjects } from '@/lib/context/ProjectContext';
import { useRouter } from 'next/navigation';
import TaskCard from '@/components/TaskCard';
import TaskDetailModal from '@/components/TaskDetailModal';
import EditProjectModal from '@/components/EditProjectModal';
import TimelineEditor from '@/components/TimelineEditor';
import { ArrowLeft, MoreVertical, Download, Share2, Trash2, CheckCircle, Info, AlertTriangle, Edit2, Copy, LayoutGrid, Calendar as CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Task } from '@/lib/types';

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { projects, deleteProject, duplicateProject, markProjectComplete, updateProject, updateTask, deleteTask, duplicateTask } = useProjects();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showEditProject, setShowEditProject] = useState(false);
  const [viewMode, setViewMode] = useState<'phases' | 'timeline'>('phases');

  const project = projects.find(p => p.id === id);

  if (!project) {
    notFound();
  }

  const totalTasks = project.phases.reduce((sum, phase) => sum + phase.tasks.length, 0);
  const completedTasks = project.phases.reduce(
    (sum, phase) => sum + phase.tasks.filter(t => t.status === 'done').length,
    0
  );

  const handleDelete = () => {
    deleteProject(project.id);
    router.push('/projects');
  };

  const handleComplete = () => {
    markProjectComplete(project.id);
    setShowCompleteConfirm(false);
  };

  const handleStatusChange = (newStatus: 'planning' | 'active' | 'on-hold' | 'completed') => {
    updateProject(project.id, { status: newStatus });
  };

  const handleDuplicate = () => {
    duplicateProject(project.id);
    setShowMenu(false);
    router.push('/projects');
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/projects"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
          title="Back to projects"
        >
          <ArrowLeft className="h-4 w-4 text-gray-600" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
            <select
              value={project.status}
              onChange={(e) => handleStatusChange(e.target.value as any)}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                project.status === 'active'
                  ? 'border-green-300 bg-green-100 text-green-700'
                  : project.status === 'completed'
                  ? 'border-blue-300 bg-blue-100 text-blue-700'
                  : project.status === 'on-hold'
                  ? 'border-yellow-300 bg-yellow-100 text-yellow-700'
                  : 'border-gray-300 bg-gray-100 text-gray-700'
              }`}
            >
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <p className="mt-1 text-sm text-gray-600">{project.description}</p>
        </div>

        <button
          onClick={() => setShowHelp(!showHelp)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
          title="Show help"
        >
          <Info className="h-4 w-4 text-gray-600" />
        </button>

        <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50" title="Share project">
          <Share2 className="h-4 w-4 text-gray-600" />
        </button>

        <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50" title="Export project">
          <Download className="h-4 w-4 text-gray-600" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
            title="More options"
          >
            <MoreVertical className="h-4 w-4 text-gray-600" />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-12 z-20 w-56 rounded-lg border border-gray-200 bg-white shadow-lg">
                <button
                  onClick={() => {
                    setShowEditProject(true);
                    setShowMenu(false);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-gray-50"
                >
                  <Edit2 className="h-4 w-4 text-gray-600" />
                  <span>Edit Project</span>
                </button>
                <button
                  onClick={handleDuplicate}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-gray-50"
                >
                  <Copy className="h-4 w-4 text-gray-600" />
                  <span>Duplicate Project</span>
                </button>
                <button
                  onClick={() => {
                    setShowCompleteConfirm(true);
                    setShowMenu(false);
                  }}
                  className="flex w-full items-center gap-3 border-t border-gray-200 px-4 py-3 text-left text-sm hover:bg-gray-50"
                >
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Mark as Complete</span>
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(true);
                    setShowMenu(false);
                  }}
                  className="flex w-full items-center gap-3 border-t border-gray-200 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Project</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Help Section */}
      {showHelp && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h3 className="mb-2 flex items-center gap-2 font-semibold text-blue-900">
            <Info className="h-5 w-5" />
            Project Management Tips
          </h3>
          <div className="space-y-1 text-sm text-blue-800">
            <p>• Switch between <strong>Phases View</strong> and <strong>Timeline View</strong> using the tabs above</p>
            <p>• In Timeline View: drag tasks horizontally to change start week, edit duration inline</p>
            <p>• Click on any task card to view full details, edit, duplicate, or delete it</p>
            <p>• Task modal shows project context (methodology, timeline) for better planning</p>
            <p>• Change task status directly from the task detail modal</p>
            <p>• Change project status using the dropdown next to the title</p>
            <p>• Use ⋮ menu to edit, duplicate, or delete the entire project</p>
          </div>
        </div>
      )}

      {/* View Mode Toggle */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex rounded-lg border border-gray-200 bg-white p-1">
          <button
            onClick={() => setViewMode('phases')}
            className={`flex items-center gap-2 rounded px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === 'phases'
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            Phases View
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`flex items-center gap-2 rounded px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === 'timeline'
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <CalendarIcon className="h-4 w-4" />
            Timeline View
          </button>
        </div>
      </div>

      {/* Project Stats */}
      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm font-medium text-gray-600">Methodology</p>
          <p className="mt-2 text-lg font-semibold text-gray-900">{project.methodology}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm font-medium text-gray-600">Timeline</p>
          <p className="mt-2 text-lg font-semibold text-gray-900">{project.timeline}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm font-medium text-gray-600">Estimated Hours</p>
          <p className="mt-2 text-lg font-semibold text-gray-900">{project.estimatedHours}h</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm font-medium text-gray-600">Progress</p>
          <p className="mt-2 text-lg font-semibold text-gray-900">
            {completedTasks}/{totalTasks} tasks ({Math.round((completedTasks / totalTasks) * 100)}%)
          </p>
        </div>
      </div>

      {/* Additional Info */}
      {(project.designBrief || project.stakeholders || project.priority) && (
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Project Details</h2>
          {project.designBrief && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700">Design Brief</p>
              <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">{project.designBrief}</p>
            </div>
          )}
          <div className="grid gap-4 md:grid-cols-3">
            {project.priority && (
              <div>
                <p className="text-sm font-medium text-gray-700">Priority</p>
                <p className="mt-1">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      project.priority === 'High'
                        ? 'bg-red-100 text-red-700'
                        : project.priority === 'Medium'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {project.priority}
                  </span>
                </p>
              </div>
            )}
            {project.stakeholders && project.stakeholders.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700">Stakeholders</p>
                <p className="mt-1 text-sm text-gray-600">{project.stakeholders.join(', ')}</p>
              </div>
            )}
            {project.productArea && (
              <div>
                <p className="text-sm font-medium text-gray-700">Product Area</p>
                <p className="mt-1 text-sm text-gray-600">{project.productArea}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Timeline View */}
      {viewMode === 'timeline' ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <TimelineEditor
            phases={project.phases}
            projectStartDate={project.startDate}
            onUpdateTask={updateTask}
          />
        </div>
      ) : (
        /* Phases View */
        <div className="space-y-8">
          {project.phases.map((phase) => (
          <div key={phase.id} className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${phase.color.split(' ')[0]}`} />
                  <h2 className="text-xl font-semibold text-gray-900">{phase.name}</h2>
                </div>
                <p className="mt-1 text-sm text-gray-600">{phase.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600">{phase.tasks.length} tasks</p>
                <p className="text-xs text-gray-500">
                  {phase.tasks.filter(t => t.status === 'done').length} completed
                </p>
              </div>
            </div>

            {phase.tasks.length === 0 ? (
              <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                <p className="text-sm text-gray-600">No tasks in this phase yet</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {phase.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => setSelectedTask(task)}
                  />
                ))}
              </div>
            )}
          </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Delete Project?</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            <p className="mb-6 text-sm text-gray-600">
              Are you sure you want to delete "{project.title}"? All tasks and data will be permanently removed.
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
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={updateTask}
          onDelete={deleteTask}
          onDuplicate={duplicateTask}
          projectTitle={project.title}
          projectMethodology={project.methodology}
          projectTimeline={project.timeline}
        />
      )}

      {/* Edit Project Modal */}
      <EditProjectModal
        project={project}
        isOpen={showEditProject}
        onClose={() => setShowEditProject(false)}
        onSave={updateProject}
      />

      {/* Complete Confirmation Modal */}
      {showCompleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowCompleteConfirm(false)} />
          <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Mark Project Complete?</h3>
                <p className="text-sm text-gray-600">All tasks will be marked as done</p>
              </div>
            </div>
            <p className="mb-6 text-sm text-gray-600">
              This will mark "{project.title}" as completed and set all {totalTasks} tasks to "done" status.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCompleteConfirm(false)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleComplete}
                className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                Mark Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
