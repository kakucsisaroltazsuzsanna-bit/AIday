'use client';

import { useProjects } from '@/lib/context/ProjectContext';
import ProjectCard from '@/components/ProjectCard';
import { TrendingUp, Clock, AlertTriangle, Sparkles } from 'lucide-react';
import { format, addDays } from 'date-fns';

export default function DashboardPage() {
  const { projects, weeklyCapacity } = useProjects();

  const activeProjects = projects.filter(p => p.status === 'active');
  const totalTasks = projects.reduce((sum, p) =>
    sum + p.phases.reduce((s, phase) => s + phase.tasks.length, 0), 0
  );
  const completedTasks = projects.reduce((sum, p) =>
    sum + p.phases.reduce((s, phase) => s + phase.tasks.filter(t => t.status === 'done').length, 0), 0
  );

  const currentWeek = weeklyCapacity[0];
  const isOverbooked = currentWeek.allocatedHours > currentWeek.availableHours;

  const upcomingMilestones = [
    { project: 'E-commerce Mobile App', milestone: 'User Persona Completion', date: addDays(new Date(), 3) },
    { project: 'Dashboard Analytics', milestone: 'Prototype Testing', date: addDays(new Date(), 5) },
    { project: 'Design System', milestone: 'Design Audit Complete', date: addDays(new Date(), 8) },
  ];

  const aiInsights = [
    'You\'re overbooked by 2 hours next week. Consider moving Dashboard Wireframes to Week 3.',
    'E-commerce project is on track. Great job completing user research ahead of schedule!',
    'Design System project starts next week. Have you scheduled the kickoff meeting?',
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-600">Welcome back! Here's your project overview.</p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{activeProjects.length}</p>
            </div>
            <div className="rounded-full bg-purple-100 p-3">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tasks Completed</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{completedTasks}/{totalTasks}</p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{currentWeek.allocatedHours}h</p>
              <p className="text-xs text-gray-500">of {currentWeek.availableHours}h</p>
            </div>
            <div className={`rounded-full p-3 ${isOverbooked ? 'bg-red-100' : 'bg-blue-100'}`}>
              <Clock className={`h-6 w-6 ${isOverbooked ? 'text-red-600' : 'text-blue-600'}`} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overbooked</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {Math.max(0, currentWeek.allocatedHours - currentWeek.availableHours)}h
              </p>
            </div>
            <div className="rounded-full bg-orange-100 p-3">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Active Projects</h2>
          </div>
          <div className="space-y-4">
            {activeProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 p-6">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">AI Insights</h3>
            </div>
            <div className="space-y-3">
              {aiInsights.map((insight, index) => (
                <div key={index} className="rounded-lg bg-white p-3 text-sm text-gray-700">
                  {insight}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="mb-4 font-semibold text-gray-900">Upcoming Milestones</h3>
            <div className="space-y-3">
              {upcomingMilestones.map((milestone, index) => (
                <div key={index} className="border-l-2 border-purple-500 pl-3">
                  <p className="text-sm font-medium text-gray-900">{milestone.milestone}</p>
                  <p className="text-xs text-gray-600">{milestone.project}</p>
                  <p className="text-xs text-gray-500">{format(milestone.date, 'MMM d, yyyy')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
