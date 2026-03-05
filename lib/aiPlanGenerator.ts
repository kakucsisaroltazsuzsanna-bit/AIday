import { NewProjectFormData, GeneratedPhase, Methodology, Priority, DesignerProfile } from './types';

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

function assessProjectComplexity(formData: NewProjectFormData): 'Low' | 'Medium' | 'High' {
  let complexityScore = 0;

  // Factor 1: Timeline (shorter = more complex due to constraints)
  const durationDays = Math.ceil(
    (formData.targetDeadline.getTime() - formData.startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (durationDays <= 14) complexityScore += 2;
  else if (durationDays <= 45) complexityScore += 1;

  // Factor 2: Priority
  if (formData.priority === 'High') complexityScore += 2;
  else if (formData.priority === 'Medium') complexityScore += 1;

  // Factor 3: Team size (larger teams = more coordination complexity)
  if (formData.teamSize >= 5) complexityScore += 1;

  // Factor 4: Brief length (longer = more requirements)
  if (formData.designBrief.length > 500) complexityScore += 1;
  if (formData.designBrief.length > 1000) complexityScore += 1;

  if (complexityScore >= 5) return 'High';
  if (complexityScore >= 3) return 'Medium';
  return 'Low';
}

function calculateTaskEstimate(
  baseHours: number,
  experienceLevel: string,
  complexity: 'Low' | 'Medium' | 'High',
  designerProfile?: DesignerProfile
): number {
  let multiplier = 1;

  // Experience adjustment
  if (experienceLevel === 'Junior') multiplier *= 1.5;
  else if (experienceLevel === 'Senior') multiplier *= 0.75;

  // Complexity adjustment
  if (complexity === 'High') multiplier *= 1.3;
  else if (complexity === 'Low') multiplier *= 0.8;

  // Designer profile adjustment
  if (designerProfile) {
    // More years = faster
    if (designerProfile.yearsOfExperience >= 10) multiplier *= 0.85;
    else if (designerProfile.yearsOfExperience >= 5) multiplier *= 0.95;
    else if (designerProfile.yearsOfExperience < 2) multiplier *= 1.2;
  }

  return Math.round(baseHours * multiplier);
}

function shouldIncludeTask(
  taskName: string,
  designerProfile?: DesignerProfile,
  complexity?: 'Low' | 'Medium' | 'High'
): boolean {
  // If no profile, include all tasks
  if (!designerProfile) return true;

  // Check if designer has relevant skills for the task
  const taskLower = taskName.toLowerCase();

  // Research tasks - check UX Research specialty
  if (taskLower.includes('research') || taskLower.includes('interview')) {
    const hasResearchSkill = designerProfile.specialties.includes('UX Research') ||
      designerProfile.skills.some(s =>
        s.name.toLowerCase().includes('research') &&
        ['Advanced', 'Expert'].includes(s.proficiency)
      );
    // Include for high complexity even without specialty
    if (complexity === 'High') return true;
    return hasResearchSkill;
  }

  // Design system tasks - check Design Systems specialty
  if (taskLower.includes('design system')) {
    return designerProfile.specialties.includes('Design Systems');
  }

  // Prototyping tasks - check relevant tools
  if (taskLower.includes('prototype')) {
    const hasPrototypingSkill = designerProfile.skills.some(s =>
      ['Figma', 'Framer', 'Prototyping', 'Principle'].includes(s.name) &&
      ['Intermediate', 'Advanced', 'Expert'].includes(s.proficiency)
    );
    return hasPrototypingSkill;
  }

  return true;
}

function generateTasksForPhase(
  phaseName: string,
  experienceLevel: string,
  complexity: 'Low' | 'Medium' | 'High',
  designerProfile?: DesignerProfile
): any[] {
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

  // Filter tasks based on designer profile and complexity
  let availableTasks = templates.filter(task => shouldIncludeTask(task, designerProfile, complexity));

  // If filtering removed too many tasks, add some back
  if (availableTasks.length < 2) {
    availableTasks = templates.slice(0, 3);
  }

  // Adjust number of tasks based on experience level and complexity
  let taskCount = 3;
  if (complexity === 'High') taskCount = 5;
  else if (complexity === 'Low') taskCount = 2;

  if (experienceLevel === 'Junior') taskCount = Math.max(2, taskCount - 1);
  else if (experienceLevel === 'Senior') taskCount = Math.min(6, taskCount + 1);

  const selectedTasks = availableTasks.slice(0, taskCount);

  return selectedTasks.map((taskName, index) => {
    const baseHours = 8 + Math.random() * 16;
    const estimatedHours = calculateTaskEstimate(baseHours, experienceLevel, complexity, designerProfile);

    // Assign priority based on complexity and position
    let priority: Priority = 'Medium';
    if (complexity === 'High' && index <= 1) priority = 'High';
    else if (index === 0) priority = 'High';
    else if (index >= selectedTasks.length - 1) priority = 'Low';

    // Generate unique ID with timestamp, random number, and index
    const uniqueId = `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${index}`;

    return {
      id: uniqueId,
      title: taskName,
      description: `Complete ${taskName.toLowerCase()} as part of the ${phaseName} phase. Deliverables include documentation and insights that inform the next phase.`,
      estimatedHours,
      priority,
      stakeholders: index === 0 ? ['Product Manager', 'Design Lead'] : undefined,
    };
  });
}

export function generateProjectPlan(
  formData: NewProjectFormData,
  designerProfile?: DesignerProfile
): GeneratedPhase[] {
  // Assess project complexity
  const complexity = assessProjectComplexity(formData);

  // Choose methodology
  let methodology: Methodology;
  if (formData.methodology === 'Let AI choose') {
    // Consider designer preferences if available
    if (designerProfile && designerProfile.preferredMethodologies.length > 0) {
      // Pick the first preferred methodology that fits the timeline
      const durationDays = Math.ceil(
        (formData.targetDeadline.getTime() - formData.startDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (durationDays <= 7 && designerProfile.preferredMethodologies.includes('Design Sprint')) {
        methodology = 'Design Sprint';
      } else if (durationDays <= 21 && designerProfile.preferredMethodologies.includes('Lean UX')) {
        methodology = 'Lean UX';
      } else {
        // Use first preference or fall back to recommendation
        methodology = designerProfile.preferredMethodologies[0];
      }
    } else {
      // Simple heuristic based on timeline and complexity
      const durationDays = Math.ceil(
        (formData.targetDeadline.getTime() - formData.startDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (durationDays <= 7) {
        methodology = 'Design Sprint';
      } else if (durationDays <= 21) {
        methodology = 'Lean UX';
      } else if (durationDays <= 45) {
        methodology = complexity === 'High' ? 'Design Thinking' : 'Double Diamond';
      } else {
        methodology = 'Design Thinking';
      }
    }
  } else {
    methodology = formData.methodology as Methodology;
  }

  // Get phases for the chosen methodology
  const phases = methodologyPhases[methodology];

  // Generate tasks for each phase
  return phases.map((phase, index) => {
    // Add small delay to ensure unique timestamps
    const uniqueId = `phase-${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${index}`;

    return {
      id: uniqueId,
      name: phase.name,
      description: phase.description,
      color: phaseColors[index % phaseColors.length],
      tasks: generateTasksForPhase(phase.name, formData.experienceLevel, complexity, designerProfile),
    };
  });
}

export function estimateProjectDuration(phases: GeneratedPhase[], weeklyCapacity: number): number {
  const totalHours = phases.reduce(
    (sum, phase) => sum + phase.tasks.reduce((s, task) => s + task.estimatedHours, 0),
    0
  );
  const weeks = Math.ceil(totalHours / weeklyCapacity);
  return weeks;
}

export function getMethodologyRecommendation(
  formData: Partial<NewProjectFormData>,
  designerProfile?: DesignerProfile
): {
  methodology: Methodology;
  reason: string;
} {
  if (!formData.startDate || !formData.targetDeadline) {
    // Check designer preferences
    if (designerProfile && designerProfile.preferredMethodologies.length > 0) {
      return {
        methodology: designerProfile.preferredMethodologies[0],
        reason: `Based on your preference and ${designerProfile.yearsOfExperience} years of experience`,
      };
    }
    return { methodology: 'Double Diamond', reason: 'Balanced approach for most projects' };
  }

  const durationDays = Math.ceil(
    (formData.targetDeadline.getTime() - formData.startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const durationWeeks = Math.ceil(durationDays / 7);

  // Factor in designer preferences when available
  const preferredMatch = designerProfile?.preferredMethodologies.find(pref => {
    if (durationWeeks <= 1) return pref === 'Design Sprint';
    if (durationWeeks <= 3) return pref === 'Lean UX';
    if (durationWeeks <= 8) return pref === 'Double Diamond';
    if (durationWeeks <= 12) return pref === 'Design Thinking';
    return pref === 'Agile UX';
  });

  if (preferredMatch && designerProfile) {
    return {
      methodology: preferredMatch,
      reason: `Matches your expertise and ${durationWeeks}-week timeline`,
    };
  }

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
