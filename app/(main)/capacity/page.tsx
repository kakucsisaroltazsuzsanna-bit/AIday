'use client';

import { useProjects } from '@/lib/context/ProjectContext';
import { format } from 'date-fns';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function CapacityPage() {
  const { weeklyCapacity } = useProjects();

  const chartData = weeklyCapacity.map(week => ({
    week: format(week.weekStart, 'MMM d'),
    available: week.availableHours,
    allocated: week.allocatedHours,
  }));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Capacity Planner</h1>
        <p className="mt-1 text-gray-600">Manage your weekly workload across projects</p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-600">This Week</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {weeklyCapacity[0].allocatedHours}h
          </p>
          <p className="text-xs text-gray-500">of {weeklyCapacity[0].availableHours}h</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-600">Overbooked Hours</p>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {Math.max(0, weeklyCapacity[0].allocatedHours - weeklyCapacity[0].availableHours)}h
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-600">Available Next Week</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {weeklyCapacity[1].availableHours - weeklyCapacity[1].allocatedHours}h
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-600">Utilization</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {Math.round((weeklyCapacity[0].allocatedHours / weeklyCapacity[0].availableHours) * 100)}%
          </p>
        </div>
      </div>

      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Weekly Capacity Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="week" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip />
            <Legend />
            <Bar dataKey="available" fill="#e5e7eb" name="Available Hours" />
            <Bar dataKey="allocated" fill="#9333ea" name="Allocated Hours" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-6">
        {weeklyCapacity.map((week, index) => {
          const isOverbooked = week.allocatedHours > week.availableHours;
          const utilizationPercent = (week.allocatedHours / week.availableHours) * 100;

          return (
            <div key={index} className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Week of {format(week.weekStart, 'MMMM d, yyyy')}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {week.allocatedHours}h allocated of {week.availableHours}h available
                  </p>
                </div>
                {isOverbooked && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700">
                    <AlertTriangle className="h-4 w-4" />
                    Overbooked by {week.allocatedHours - week.availableHours}h
                  </div>
                )}
              </div>

              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-gray-600">Utilization</span>
                  <span className="font-medium text-gray-900">
                    {Math.round(utilizationPercent)}%
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={`h-full ${isOverbooked ? 'bg-red-500' : 'bg-purple-600'}`}
                    style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                {week.projects.map((project, pIndex) => (
                  <div key={pIndex} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full ${project.color}`} />
                      <span className="text-sm font-medium text-gray-900">
                        {project.projectTitle}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {project.hours}h
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl border border-purple-200 bg-purple-50 p-6">
        <div className="flex items-start gap-3">
          <TrendingUp className="h-5 w-5 text-purple-600" />
          <div>
            <h3 className="font-semibold text-gray-900">AI Recommendation</h3>
            <p className="mt-2 text-sm text-gray-700">
              You're overbooked by 2 hours next week. I recommend moving the "Dashboard
              Wireframes" task from Week 2 to Week 3. This would balance your workload and
              free up 4 hours.
            </p>
            <button className="mt-4 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">
              Apply Suggestion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
