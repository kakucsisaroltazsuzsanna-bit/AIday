import { NewProjectFormData, GeneratedPhase, Methodology, Priority } from './types';

const phaseColors = [
  'bg-blue-100 border-blue-300 text-blue-700',
  'bg-purple-100 border-purple-300 text-purple-700',
  'bg-green-100 border-green-300 text-green-700',
  'bg-orange-100 border-orange-300 text-orange-700',
  'bg-pink-100 border-pink-300 text-pink-700',
  'bg-indigo-100 border-indigo-300 text-indigo-700',
  'bg-cyan-100 border-cyan-300 text-cyan-700',
];

const methodologyPhases: Record<Methodology, { name: string; description: string }[]> = {
  'Design Thinking': [
    { name: 'Empathize', description: 'Research user needs and understand their pain points' },
    { name: 'Define', description: 'Synthesize research and define the core problem' },
    { name: 'Ideate', description: 'Generate creative solutions through brainstorming' },
    { name: 'Prototype', description: 'Build tangible representations of ideas' },
    { name: 'Test', description: 'Validate solutions with real users' },
  ],
  'Double Diamond': [
    { name: 'Discover', description: 'Research and understand the problem space' },
    { name: 'Define', description: 'Synthesize insights and define opportunities' },
    { name: 'Develop', description: 'Ideate and prototype potential solutions' },
    { name: 'Deliver', description: 'Test, refine, and deliver the solution' },
  ],
  'Lean UX': [
    { name: 'Think', description: 'Define assumptions and hypotheses' },
    { name: 'Make', description: 'Build minimum viable product' },
    { name: 'Check', description: 'Test and gather feedback' },
  ],
  'Design Sprint': [
    { name: 'Map', description: 'Map out the problem and pick a target' },
    { name: 'Sketch', description: 'Sketch competing solutions on paper' },
    { name: 'Decide', description: 'Make decisions and turn ideas into a testable hypothesis' },
    { name: 'Prototype', description: 'Build a realistic prototype' },
    { name: 'Test', description: 'Get feedback from real users' },
  ],
  'Agile UX': [
    { name: 'Research', description: 'Continuous user research and discovery' },
    { name: 'Design', description: 'Iterative design in sprints' },
    { name: 'Build', description: 'Collaborate with development' },
    { name: 'Measure', description: 'Track metrics and gather feedback' },
  ],
};

const taskTemplates = {
  research: [
    'User Interviews',
    'Competitive Analysis',
    'User Surveys',
    'Analytics Review',
    'Stakeholder Interviews',
    'Heuristic Evaluation',
  ],
  define: [
    'User Personas',
    'Journey Mapping',
    'Problem Statement',
    'Define Success Metrics',
    'Opportunity Assessment',
  ],
  ideate: [
    'Ideation Workshop',
    'Sketching Sessions',
    'Concept Development',
    'Design Principles',
  ],
  design: [
    'Information Architecture',
    'User Flows',
    'Wireframes',
    'High-Fidelity Mockups',
    'Design System Components',
    'Interaction Design',
  ],
  prototype: [
    'Interactive Prototype',
    'Clickable Prototype',
    'Prototype Testing',
  ],
  test: [
    'Usability Testing',
    'A/B Testing',
    'Design QA',
    'Feedback Sessions',
  ],
  deliver: [
    'Design Documentation',
    'Developer Handoff',
    'Design System Updates',
    'Final Review',
  ],
};

function generateTasksForPhase(phaseName: string, experienceLevel: string): any[] {
  const phaseKey = phaseName.toLowerCase();
  let templates: string[] = [];

  // Map phase names to task templates
  if (phaseKey.includes('empathize') || phaseKey.includes('discover') || phaseKey.includes('research')) {
    templates = taskTemplates.research;
  } else if (phaseKey.includes('define') || phaseKey.includes('map')) {
    templates = taskTemplates.define;
  } else if (phaseKey.includes('ideate') || phaseKey.includes('sketch')) {
    templates = taskTemplates.ideate;
  } else if (phaseKey.includes('develop') || phaseKey.includes('design') || phaseKey.includes('make')) {
    templates = [...taskTemplates.design, ...taskTemplates.prototype];
  } else if (phaseKey.includes('prototype')) {
    templates = taskTemplates.prototype;
  } else if (phaseKey.includes('test') || phaseKey.includes('check') || phaseKey.includes('measure')) {
    templates = taskTemplates.test;
  } else if (phaseKey.includes('deliver') || phaseKey.includes('build')) {
    templates = taskTemplates.deliver;
  } else {
    templates = taskTemplates.design;
  }

  // Adjust number of tasks based on experience level
  const taskCount = experienceLevel === 'Junior' ? 2 : experienceLevel === 'Senior' ? 4 : 3;
  const selectedTasks = templates.slice(0, taskCount);

  // Generate hour estimates based on experience
  const hourMultiplier = experienceLevel === 'Junior' ? 1.5 : experienceLevel === 'Senior' ? 0.8 : 1;

  return selectedTasks.map((taskName, index) => ({
    id: `task-${Date.now()}-${index}`,
    title: taskName,
    description: `Complete ${taskName.toLowerCase()} as part of the ${phaseName} phase. Deliverables include documentation and insights that inform the next phase.`,
    estimatedHours: Math.round((8 + Math.random() * 16) * hourMultiplier),
    priority: index === 0 ? 'High' : index === 1 ? 'Medium' : 'Low' as Priority,
    stakeholders: index === 0 ? ['Product Manager', 'Design Lead'] : undefined,
  }));
}

export function generateProjectPlan(formData: NewProjectFormData): GeneratedPhase[] {
  // Choose methodology
  let methodology: Methodology;
  if (formData.methodology === 'Let AI choose') {
    // Simple heuristic based on timeline
    const durationDays = Math.ceil(
      (formData.targetDeadline.getTime() - formData.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (durationDays <= 7) {
      methodology = 'Design Sprint';
    } else if (durationDays <= 21) {
      methodology = 'Lean UX';
    } else if (durationDays <= 45) {
      methodology = 'Double Diamond';
    } else {
      methodology = 'Design Thinking';
    }
  } else {
    methodology = formData.methodology as Methodology;
  }

  // Get phases for the chosen methodology
  const phases = methodologyPhases[methodology];

  // Generate tasks for each phase
  return phases.map((phase, index) => ({
    id: `phase-${Date.now()}-${index}`,
    name: phase.name,
    description: phase.description,
    color: phaseColors[index % phaseColors.length],
    tasks: generateTasksForPhase(phase.name, formData.experienceLevel),
  }));
}

export function estimateProjectDuration(phases: GeneratedPhase[], weeklyCapacity: number): number {
  const totalHours = phases.reduce(
    (sum, phase) => sum + phase.tasks.reduce((s, task) => s + task.estimatedHours, 0),
    0
  );
  const weeks = Math.ceil(totalHours / weeklyCapacity);
  return weeks;
}

export function getMethodologyRecommendation(formData: Partial<NewProjectFormData>): {
  methodology: Methodology;
  reason: string;
} {
  if (!formData.startDate || !formData.targetDeadline) {
    return { methodology: 'Double Diamond', reason: 'Balanced approach for most projects' };
  }

  const durationDays = Math.ceil(
    (formData.targetDeadline.getTime() - formData.startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const durationWeeks = Math.ceil(durationDays / 7);

  if (durationWeeks <= 1) {
    return {
      methodology: 'Design Sprint',
      reason: 'Perfect for rapid prototyping and validation in a short timeframe',
    };
  } else if (durationWeeks <= 3) {
    return {
      methodology: 'Lean UX',
      reason: 'Ideal for quick iterations and MVP delivery',
    };
  } else if (durationWeeks <= 8) {
    return {
      methodology: 'Double Diamond',
      reason: 'Balanced approach with clear divergent and convergent phases',
    };
  } else if (durationWeeks <= 12) {
    return {
      methodology: 'Design Thinking',
      reason: 'Comprehensive human-centered design process for complex problems',
    };
  } else {
    return {
      methodology: 'Agile UX',
      reason: 'Continuous design integrated with agile development cycles',
    };
  }
}
