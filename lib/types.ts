export type Methodology = 'Design Thinking' | 'Double Diamond' | 'Lean UX' | 'Design Sprint' | 'Agile UX';
export type Priority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type ProjectStatus = 'planning' | 'active' | 'completed' | 'on-hold';
export type ExperienceLevel = 'Junior' | 'Mid-level' | 'Senior';
export type DesignSpecialty = 'UI Design' | 'UX Research' | 'Product Design' | 'Visual Design' | 'Interaction Design' | 'Design Systems' | 'Service Design';
export type ToolProficiency = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface Task {
  id: string;
  title: string;
  description: string;
  phase: string;
  estimatedHours: number;
  priority: Priority;
  status: TaskStatus;
  startWeek: number;
  duration: number;
  links?: string[];
  jiraDescription: string;
  projectId: string;
  stakeholders?: string[];
}

export interface Phase {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
  color: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  methodology: Methodology;
  timeline: string;
  teamSize: number;
  experienceLevel: string;
  weeklyAvailability: number;
  status: ProjectStatus;
  progress: number;
  startDate: Date;
  endDate: Date;
  phases: Phase[];
  estimatedHours: number;
  priority?: Priority;
  designBrief?: string;
  stakeholders?: string[];
  productArea?: string;
}

export interface WeeklyCapacity {
  weekStart: Date;
  availableHours: number;
  allocatedHours: number;
  projects: {
    projectId: string;
    projectTitle: string;
    hours: number;
    color: string;
  }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface NewProjectFormData {
  // Step 1: Basic Info
  title: string;
  description: string;
  designBrief: string;
  priority: Priority;
  startDate: Date;
  targetDeadline: Date;
  stakeholders?: string[];
  productArea?: string;

  // Step 2: Settings
  methodology: Methodology | 'Let AI choose';
  experienceLevel: ExperienceLevel;
  teamSize: number;
  weeklyCapacity: number;
}

export interface GeneratedTask {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  priority: Priority;
  stakeholders?: string[];
}

export interface GeneratedPhase {
  id: string;
  name: string;
  description: string;
  tasks: GeneratedTask[];
  color: string;
}

export interface DesignerProfile {
  id: string;
  name: string;
  email: string;
  experienceLevel: ExperienceLevel;
  yearsOfExperience: number;
  specialties: DesignSpecialty[];
  skills: {
    name: string;
    proficiency: ToolProficiency;
  }[];
  weeklyAvailability: number;
  preferredMethodologies: Methodology[];
  bio?: string;
  avatar?: string;
  completedOnboarding: boolean;
}
