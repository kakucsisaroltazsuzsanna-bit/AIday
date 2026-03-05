'use client';

import { useProjects } from '@/lib/context/ProjectContext';
import TaskCard from '@/components/TaskCard';
import { Filter } from 'lucide-react';

export default function TasksPage() {
  const { projects } = useProjects();
  const allTasks = projects.flatMap(p => p.phases.flatMap(phase => phase.tasks));
  const todoTasks = allTasks.filter(t => t.status === 'todo');
  const inProgressTasks = allTasks.filter(t => t.status === 'in-progress');
  const doneTasks = allTasks.filter(t => t.status === 'done');

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Tasks</h1>
          <p className="mt-1 text-gray-600">Manage tasks across all projects</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-600">To Do</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{todoTasks.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-600">In Progress</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{inProgressTasks.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-600">Done</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{doneTasks.length}</p>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">To Do ({todoTasks.length})</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {todoTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">In Progress ({inProgressTasks.length})</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {inProgressTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Done ({doneTasks.length})</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {doneTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
