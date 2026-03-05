'use client';

import { useProjects } from '@/lib/context/ProjectContext';
import { format, addWeeks, startOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function TimelinePage() {
  const { projects } = useProjects();
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weeks = Array.from({ length: 8 }, (_, i) => addWeeks(weekStart, i));

  const allTasks = projects.flatMap(p =>
    p.phases.flatMap(phase =>
      phase.tasks.map(task => ({
        ...task,
        projectTitle: p.title,
        phaseColor: phase.color,
      }))
    )
  );

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Timeline</h1>
          <p className="mt-1 text-gray-600">Cross-project Gantt view</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50">
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </button>
          <span className="px-4 text-sm font-medium text-gray-700">
            {format(weeks[0], 'MMM yyyy')}
          </span>
          <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50">
            <ChevronRight className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <div className="min-w-[1200px] p-6">
          <div className="mb-4 grid grid-cols-[250px_1fr] gap-4">
            <div className="font-medium text-gray-900">Project / Task</div>
            <div className="grid grid-cols-8 gap-2">
              {weeks.map((week, index) => (
                <div key={index} className="border-l border-gray-200 pl-2 text-xs font-medium text-gray-600">
                  Week {index + 1}
                  <br />
                  <span className="text-gray-400">{format(week, 'MMM d')}</span>
                </div>
              ))}
            </div>
          </div>

          {projects.map(project => {
            const projectTasks = allTasks.filter(t => t.projectId === project.id);
            return (
              <div key={project.id} className="mb-8">
                <div className="mb-3 font-semibold text-gray-900">{project.title}</div>
                <div className="space-y-2">
                  {projectTasks.map(task => (
                    <div key={task.id} className="grid grid-cols-[250px_1fr] gap-4">
                      <div className="flex items-center text-sm text-gray-700">
                        <div className={`mr-2 h-2 w-2 rounded-full ${task.phaseColor.split(' ')[0]}`} />
                        {task.title}
                      </div>
                      <div className="grid grid-cols-8 gap-2">
                        <div
                          className={`relative h-8 rounded ${task.phaseColor} flex items-center px-2`}
                          style={{
                            gridColumn: `${task.startWeek + 1} / span ${task.duration}`,
                          }}
                        >
                          <span className="truncate text-xs font-medium">
                            {task.estimatedHours}h
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
