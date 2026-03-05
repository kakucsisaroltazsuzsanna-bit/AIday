'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import AIAssistant from '@/components/AIAssistant';
import NewProjectModal from '@/components/NewProjectModal';
import OnboardingModal from '@/components/OnboardingModal';
import { ProjectProvider, useProjects } from '@/lib/context/ProjectContext';
import { DesignerProfileProvider, useDesignerProfile } from '@/lib/context/DesignerProfileContext';
import { NewProjectFormData, GeneratedPhase, Project, DesignerProfile } from '@/lib/types';
import { differenceInWeeks } from 'date-fns';

function MainLayoutContent({ children }: { children: React.ReactNode }) {
  const { addProject } = useProjects();
  const { profile, updateProfile, isOnboardingComplete } = useDesignerProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [prefilledData, setPrefilledData] = useState<Partial<NewProjectFormData> | undefined>();

  // Show onboarding if not completed
  useEffect(() => {
    if (!isOnboardingComplete) {
      const timer = setTimeout(() => setShowOnboarding(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isOnboardingComplete]);

  const handleOnboardingComplete = (newProfile: DesignerProfile) => {
    updateProfile(newProfile);
    setShowOnboarding(false);
  };

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

  return (
    <>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
        <AIAssistant onOpenProjectModal={handleOpenProjectModal} />
      </div>
      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
      />
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
    <DesignerProfileProvider>
      <ProjectProvider>
        <MainLayoutContent>{children}</MainLayoutContent>
      </ProjectProvider>
    </DesignerProfileProvider>
  );
}
