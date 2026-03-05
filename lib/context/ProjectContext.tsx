'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Project, Task, WeeklyCapacity } from '../types';
import { projects as initialProjects, weeklyCapacity as initialCapacity } from '../mockData';
import { addWeeks } from 'date-fns';

interface ProjectContextType {
  projects: Project[];
  weeklyCapacity: WeeklyCapacity[];
  addProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  duplicateProject: (projectId: string) => void;
  markProjectComplete: (projectId: string) => void;
  addTask: (projectId: string, phaseId: string, task: Omit<Task, 'id' | 'projectId'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  duplicateTask: (taskId: string) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  rebalanceWorkload: (fromWeek: number, toWeek: number, taskId: string) => void;
  adjustProjectTimeline: (projectId: string, newEndWeek: number) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [weeklyCapacity, setWeeklyCapacity] = useState<WeeklyCapacity[]>(initialCapacity);

  const addProject = (project: Project) => {
    setProjects(prev => [...prev, project]);
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  const duplicateProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const newId = `project-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const duplicatedProject: Project = {
      ...project,
      id: newId,
      title: `${project.title} (Copy)`,
      status: 'planning',
      progress: 0,
      phases: project.phases.map((phase, phaseIndex) => ({
        ...phase,
        id: `phase-${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${phaseIndex}`,
        tasks: phase.tasks.map((task, taskIndex) => ({
          ...task,
          id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${taskIndex}`,
          projectId: newId,
          status: 'todo' as const,
        })),
      })),
    };

    setProjects(prev => [...prev, duplicatedProject]);
  };

  const markProjectComplete = (projectId: string) => {
    setProjects(prev => prev.map(project => {
      if (project.id !== projectId) return project;

      // Mark all tasks as done
      const updatedPhases = project.phases.map(phase => ({
        ...phase,
        tasks: phase.tasks.map(task => ({ ...task, status: 'done' as const }))
      }));

      return {
        ...project,
        status: 'completed',
        progress: 100,
        phases: updatedPhases,
      };
    }));
  };

  const addTask = (projectId: string, phaseId: string, task: Omit<Task, 'id' | 'projectId'>) => {
    setProjects(prev => prev.map(project => {
      if (project.id !== projectId) return project;

      return {
        ...project,
        phases: project.phases.map(phase => {
          if (phase.id !== phaseId) return phase;

          const newTask: Task = {
            ...task,
            id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            projectId,
          };

          return {
            ...phase,
            tasks: [...phase.tasks, newTask],
          };
        }),
        estimatedHours: project.estimatedHours + task.estimatedHours,
      };
    }));

    // Update capacity
    const project = projects.find(p => p.id === projectId);
    if (project && task.startWeek < weeklyCapacity.length) {
      setWeeklyCapacity(prev => prev.map((week, index) => {
        if (index === task.startWeek) {
          const existingProject = week.projects.find(p => p.projectId === projectId);
          if (existingProject) {
            return {
              ...week,
              allocatedHours: week.allocatedHours + task.estimatedHours,
              projects: week.projects.map(p =>
                p.projectId === projectId
                  ? { ...p, hours: p.hours + task.estimatedHours }
                  : p
              ),
            };
          } else {
            return {
              ...week,
              allocatedHours: week.allocatedHours + task.estimatedHours,
              projects: [
                ...week.projects,
                {
                  projectId,
                  projectTitle: project.title,
                  hours: task.estimatedHours,
                  color: 'bg-purple-500',
                },
              ],
            };
          }
        }
        return week;
      }));
    }
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setProjects(prev => prev.map(project => ({
      ...project,
      phases: project.phases.map(phase => ({
        ...phase,
        tasks: phase.tasks.map(task =>
          task.id === taskId ? { ...task, ...updates } : task
        ),
      })),
    })));
  };

  const deleteTask = (taskId: string) => {
    setProjects(prev => prev.map(project => ({
      ...project,
      phases: project.phases.map(phase => ({
        ...phase,
        tasks: phase.tasks.filter(task => task.id !== taskId),
      })),
    })));
  };

  const duplicateTask = (taskId: string) => {
    setProjects(prev => prev.map(project => ({
      ...project,
      phases: project.phases.map(phase => {
        const taskToDuplicate = phase.tasks.find(task => task.id === taskId);
        if (!taskToDuplicate) return phase;

        const newTask: Task = {
          ...taskToDuplicate,
          id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          title: `${taskToDuplicate.title} (Copy)`,
          status: 'todo',
        };

        return {
          ...phase,
          tasks: [...phase.tasks, newTask],
        };
      }),
    })));
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(project =>
      project.id === projectId ? { ...project, ...updates } : project
    ));
  };

  const rebalanceWorkload = (fromWeek: number, toWeek: number, taskId: string) => {
    let task: Task | undefined;
    let projectId: string | undefined;

    // Find the task and update its week
    setProjects(prev => prev.map(project => ({
      ...project,
      phases: project.phases.map(phase => ({
        ...phase,
        tasks: phase.tasks.map(t => {
          if (t.id === taskId) {
            task = t;
            projectId = project.id;
            return { ...t, startWeek: toWeek };
          }
          return t;
        }),
      })),
    })));

    // Update capacity allocation
    if (task && projectId && fromWeek < weeklyCapacity.length && toWeek < weeklyCapacity.length) {
      setWeeklyCapacity(prev => prev.map((week, index) => {
        // Remove from old week
        if (index === fromWeek) {
          return {
            ...week,
            allocatedHours: week.allocatedHours - task!.estimatedHours,
            projects: week.projects.map(p =>
              p.projectId === projectId
                ? { ...p, hours: Math.max(0, p.hours - task!.estimatedHours) }
                : p
            ).filter(p => p.hours > 0),
          };
        }
        // Add to new week
        if (index === toWeek) {
          const project = projects.find(p => p.id === projectId);
          const existingProject = week.projects.find(p => p.projectId === projectId);

          if (existingProject) {
            return {
              ...week,
              allocatedHours: week.allocatedHours + task!.estimatedHours,
              projects: week.projects.map(p =>
                p.projectId === projectId
                  ? { ...p, hours: p.hours + task!.estimatedHours }
                  : p
              ),
            };
          } else {
            return {
              ...week,
              allocatedHours: week.allocatedHours + task!.estimatedHours,
              projects: [
                ...week.projects,
                {
                  projectId: projectId!,
                  projectTitle: project?.title || '',
                  hours: task!.estimatedHours,
                  color: 'bg-purple-500',
                },
              ],
            };
          }
        }
        return week;
      }));
    }
  };

  const adjustProjectTimeline = (projectId: string, newEndWeek: number) => {
    setProjects(prev => prev.map(project => {
      if (project.id !== projectId) return project;

      const weekStart = project.startDate;
      const newEndDate = addWeeks(weekStart, newEndWeek);

      return {
        ...project,
        endDate: newEndDate,
        timeline: `${newEndWeek} weeks`,
      };
    }));
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        weeklyCapacity,
        addProject,
        deleteProject,
        duplicateProject,
        markProjectComplete,
        addTask,
        updateTask,
        deleteTask,
        duplicateTask,
        updateProject,
        rebalanceWorkload,
        adjustProjectTimeline,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}
