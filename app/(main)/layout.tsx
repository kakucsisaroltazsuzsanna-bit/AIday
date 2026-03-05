'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import AIAssistant from '@/components/AIAssistant';
import NewProjectModal from '@/components/NewProjectModal';
import { ProjectProvider, useProjects } from '@/lib/context/ProjectContext';
import { NewProjectFormData, GeneratedPhase, Project } from '@/lib/types';
import { differenceInWeeks } from 'date-fns';

function MainLayoutContent({ children }: { children: React.ReactNode }) {
  const { addProject } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prefilledData, setPrefilledData] = useState<Partial<NewProjectFormData> | undefined>();

  const handleOpenProjectModal = (prefilled?: any) => {
    if (prefilled) {
      setPrefilledData({
        title: prefilled.title || '',
        description: prefilled.description || '',
        designBrief: prefilled.description || '',
        priority: 'Medium',
        startDate: new Date(),
        targetDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        methodology: 'Let AI choose',
        experienceLevel: 'Mid-level',
        teamSize: 2,
        weeklyCapacity: 30,
      });
    } else {
      setPrefilledData(undefined);
    }
    setIsModalOpen(true);
  };

  const handleSaveProject = (formData: NewProjectFormData, generatedPlan: GeneratedPhase[]) => {
    const totalHours = generatedPlan.reduce(
      (sum, phase) => sum + phase.tasks.reduce((s, task) => s + task.estimatedHours, 0),
      0
    );

    const durationWeeks = differenceInWeeks(formData.targetDeadline, formData.startDate);

    const newProject: Project = {
      id: `proj-${Date.now()}`,
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
          projectId: `proj-${Date.now()}`,
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

  return (
    <>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
        <AIAssistant onOpenProjectModal={handleOpenProjectModal} />
      </div>
      <NewProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProject}
        prefilledData={prefilledData}
      />
    </>
  );
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProjectProvider>
      <MainLayoutContent>{children}</MainLayoutContent>
    </ProjectProvider>
  );
}
