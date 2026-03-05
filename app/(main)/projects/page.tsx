'use client';

import { useState } from 'react';
import { useProjects } from '@/lib/context/ProjectContext';
import ProjectCard from '@/components/ProjectCard';
import NewProjectModal from '@/components/NewProjectModal';
import ImportProjectModal from '@/components/ImportProjectModal';
import { Plus, LayoutGrid, List, Calendar, Download, Info } from 'lucide-react';
import { NewProjectFormData, GeneratedPhase, Project } from '@/lib/types';
import { differenceInWeeks } from 'date-fns';

export default function ProjectsPage() {
  const { projects, addProject, duplicateProject, deleteProject } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [prefilledData, setPrefilledData] = useState<Partial<NewProjectFormData> | undefined>();

  const handleSaveProject = (formData: NewProjectFormData, generatedPlan: GeneratedPhase[]) => {
    const totalHours = generatedPlan.reduce(
      (sum, phase) => sum + phase.tasks.reduce((s, task) => s + task.estimatedHours, 0),
      0
    );

    const durationWeeks = differenceInWeeks(formData.targetDeadline, formData.startDate);

    const projectId = `proj-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const newProject: Project = {
      id: projectId,
      title: formData.title,
      description: formData.description,
      designBrief: formData.designBrief,
      priority: formData.priority,
      methodology: formData.methodology === 'Let AI choose'
        ? 'Double Diamond'
        : formData.methodology,
      timeline: `${durationWeeks} weeks`,
      teamSize: formData.teamSize,
      experienceLevel: formData.experienceLevel,
      weeklyAvailability: formData.weeklyCapacity,
      status: 'planning',
      progress: 0,
      startDate: formData.startDate,
      endDate: formData.targetDeadline,
      estimatedHours: totalHours,
      stakeholders: formData.stakeholders,
      productArea: formData.productArea,
      phases: generatedPlan.map((phase) => ({
        ...phase,
        tasks: phase.tasks.map((task) => ({
          ...task,
          projectId: projectId,
          phase: phase.name,
          status: 'todo' as const,
          startWeek: 0,
          duration: 1,
          jiraDescription: `**${task.title}**\n\n${task.description}\n\n**Priority:** ${task.priority}\n**Estimated Hours:** ${task.estimatedHours}h`,
          links: [],
        })),
      })),
    };

    addProject(newProject);
    setIsModalOpen(false);
  };

  const handleImport = (importedData: Partial<NewProjectFormData>) => {
    setPrefilledData(importedData);
    setIsImportModalOpen(false);
    setIsModalOpen(true);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="mt-1 text-gray-600">Manage all your design projects</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Info className="h-4 w-4" />
            {showHelp ? 'Hide Help' : 'Need Help?'}
          </button>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-purple-600 bg-white px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50"
          >
            <Download className="h-4 w-4" />
            Import Project
          </button>
          <button
            onClick={() => {
              setPrefilledData(undefined);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
          >
            <Plus className="h-4 w-4" />
            New Project
          </button>
        </div>
      </div>

      {/* Help Section */}
      {showHelp && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-6">
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-blue-900">
            <Info className="h-5 w-5" />
            Quick Start Guide
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>
              <strong>Create New Project:</strong> Click "+ New Project" to start from scratch with AI-powered generation
            </p>
            <p>
              <strong>Import Project:</strong> Click "Import Project" to bring in data from Jira, Confluence, or CSV
            </p>
            <p>
              <strong>View Details:</strong> Click any project card to see tasks, phases, and manage the project
            </p>
            <p>
              <strong>Use AI Assistant:</strong> Click the purple button (bottom-right) and say "Create a new project for [description]"
            </p>
          </div>
        </div>
      )}

      {/* View Controls */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex rounded-lg border border-gray-200 bg-white p-1">
          <button className="rounded px-3 py-1.5 text-sm font-medium bg-purple-100 text-purple-700">
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button className="rounded px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100">
            <List className="h-4 w-4" />
          </button>
          <button className="rounded px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100">
            <Calendar className="h-4 w-4" />
          </button>
        </div>

        <select className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700">
          <option>All Projects</option>
          <option>Active</option>
          <option>Planning</option>
          <option>Completed</option>
          <option>On Hold</option>
        </select>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-24">
          <LayoutGrid className="h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">No projects yet</h3>
          <p className="mt-2 text-sm text-gray-600">Get started by creating your first project</p>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
            >
              <Plus className="h-4 w-4" />
              Create Project
            </button>
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Download className="h-4 w-4" />
              Import Project
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDuplicate={duplicateProject}
              onDelete={deleteProject}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <NewProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setPrefilledData(undefined);
        }}
        onSave={handleSaveProject}
        prefilledData={prefilledData}
      />

      <ImportProjectModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
      />
    </div>
  );
}
