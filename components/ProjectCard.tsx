'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Clock, Users, TrendingUp, MoreVertical, Copy, Trash2, Edit2 } from 'lucide-react';
import { Project } from '@/lib/types';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';

interface ProjectCardProps {
  project: Project;
  onDuplicate?: (projectId: string) => void;
  onDelete?: (projectId: string) => void;
}

const statusColors = {
  'planning': 'bg-gray-100 text-gray-700 border-gray-300',
  'active': 'bg-green-100 text-green-700 border-green-300',
  'completed': 'bg-blue-100 text-blue-700 border-blue-300',
  'on-hold': 'bg-yellow-100 text-yellow-700 border-yellow-300',
};

export default function ProjectCard({ project, onDuplicate, onDelete }: ProjectCardProps) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const totalTasks = project.phases.reduce((sum, phase) => sum + phase.tasks.length, 0);
  const completedTasks = project.phases.reduce(
    (sum, phase) => sum + phase.tasks.filter(t => t.status === 'done').length,
    0
  );

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDuplicate) {
      onDuplicate(project.id);
    }
    setShowMenu(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete && confirm(`Are you sure you want to delete "${project.title}"?`)) {
      onDelete(project.id);
    }
    setShowMenu(false);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/projects/${project.id}`);
    setShowMenu(false);
  };

  const handleCardClick = () => {
    router.push(`/projects/${project.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-purple-300 hover:shadow-lg"
    >
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-700">
              {project.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-gray-600">
              {project.description}
            </p>
          </div>
          <div className="relative ml-4">
            <button
              onClick={handleMenuClick}
              className="text-gray-400 hover:text-gray-600"
            >
              <MoreVertical className="h-5 w-5" />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowMenu(false);
                }} />
                <div className="absolute right-0 top-8 z-20 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
                  <button
                    onClick={handleViewDetails}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-gray-50"
                  >
                    <Edit2 className="h-4 w-4 text-gray-600" />
                    <span>View Details</span>
                  </button>
                  {onDuplicate && (
                    <button
                      onClick={handleDuplicate}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-gray-50"
                    >
                      <Copy className="h-4 w-4 text-gray-600" />
                      <span>Duplicate</span>
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={handleDelete}
                      className="flex w-full items-center gap-3 border-t border-gray-200 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <span className={clsx(
            'rounded-full border px-3 py-1 text-xs font-medium',
            statusColors[project.status]
          )}>
            {project.status}
          </span>
          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
            {project.methodology}
          </span>
        </div>

        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium text-gray-900">{project.progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{project.timeline}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{project.teamSize}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-purple-700">
            <TrendingUp className="h-4 w-4" />
            <span className="font-medium">{completedTasks}/{totalTasks} tasks</span>
          </div>
        </div>
    </div>
  );
}
