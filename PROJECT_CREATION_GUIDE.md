# Project Creation Feature Guide

## Overview

The "Add New Project" feature allows designers to create projects manually or generate them using AI. This comprehensive 4-step wizard guides users through project creation with intelligent AI-powered plan generation.

---

## Accessing the Feature

### From Projects Page
Click the **"+ New Project"** button in the top-right corner of the Projects page.

### From AI Assistant
Use natural language commands:
```
"Create a new project for redesigning a mobile banking onboarding flow"
"Create a project to improve dashboard analytics"
"Create a new project"
```

The AI Assistant will pre-fill the form with extracted information from your command.

---

## Step-by-Step Process

### Step 1: Project Basic Info

**Required Fields:**
- **Project Name** - e.g., "E-commerce Mobile App Redesign"
- **Short Description** - Brief one-line summary

**Optional Fields:**
- **Design Brief** - Detailed project requirements, context, goals, and constraints
- **Priority** - Low, Medium, or High
- **Start Date** - Project start date
- **Target Deadline** - Project end date
- **Stakeholders** - Comma-separated list (e.g., "Product Manager, Engineering Lead, CEO")
- **Product Area** - e.g., "Mobile", "Web", "Dashboard"

**Tips:**
- The more detail in the design brief, the better the AI can generate your plan
- Stakeholders will be suggested for key tasks

---

### Step 2: Project Settings

**Design Methodology:**
Choose from 6 options:
1. **Let AI Choose** (Recommended) - AI selects based on timeline
   - ≤1 week → Design Sprint
   - 2-3 weeks → Lean UX
   - 4-8 weeks → Double Diamond
   - 9-12 weeks → Design Thinking
   - 12+ weeks → Agile UX

2. **Design Thinking** - Empathize → Define → Ideate → Prototype → Test
3. **Double Diamond** - Discover → Define → Develop → Deliver
4. **Lean UX** - Think → Make → Check (Rapid iteration)
5. **Design Sprint** - 5-day process
6. **Agile UX** - Continuous design in sprints

**Designer Experience Level:**
- **Junior** - More tasks, longer estimates (1.5x multiplier)
- **Mid-level** - Balanced approach (1x multiplier)
- **Senior** - Fewer tasks, faster estimates (0.8x multiplier)

**Team Configuration:**
- **Team Size** - Number of designers (1-20)
- **Weekly Design Capacity** - Available hours per week (1-80h)

**AI Recommendations:**
The system shows:
- Recommended methodology with reasoning
- Planning summary (timeline, capacity, total hours)
- Capacity warnings if needed

---

### Step 3: AI Project Plan Generation

**What Happens:**
1. Click **"Generate Project Plan with AI"**
2. AI analyzes:
   - Project requirements
   - Timeline constraints
   - Team capacity
   - Experience level
3. Shows loading state with processing steps
4. Generates complete project structure

**Generated Output:**
- **Phases** - Based on selected methodology
- **Tasks** - 2-4 tasks per phase (varies by experience)
- **Estimates** - Hour estimates for each task
- **Priorities** - High/Medium/Low based on criticality
- **Stakeholders** - Suggested for key tasks
- **Descriptions** - Detailed task descriptions

**Example for Double Diamond:**
```
Discover Phase (3 tasks, ~40h)
  - User Interviews (High, 24h)
  - Analytics Review (High, 16h)
  - Competitive Analysis (Medium, 12h)

Define Phase (3 tasks, ~36h)
  - User Personas (High, 16h)
  - Journey Mapping (High, 20h)
  - Problem Statement (Medium, 8h)

...and so on
```

---

### Step 4: Plan Review & Edit

**Summary Panel:**
- Total Phases
- Total Tasks
- Estimated Hours
- Estimated Duration (weeks)
- Capacity Warning (if overbooked)

**Editing Features:**

**Edit Task:**
1. Hover over task card
2. Click pencil icon
3. Modify:
   - Title
   - Description
   - Estimated hours
   - Priority
4. Click "Save"

**Delete Task:**
1. Hover over task card
2. Click trash icon
3. Task removed immediately

**Add Task:**
1. Click "+ Add Task to [Phase]" at bottom of phase
2. New task template created
3. Edit as needed

**Reorder Tasks:**
- Grab task by drag handle (currently visual only)
- Tasks can be edited to change execution order

**Phase Display:**
- Color-coded phases
- Task count and total hours per phase
- Expandable/collapsible sections
- Priority badges on tasks
- Hour estimates clearly visible

---

## Saving the Project

**Save Project Button:**
- Creates new project
- Adds to global project list
- Sets status to "Planning"
- Initializes at 0% progress
- Tasks set to "To Do" status
- Appears on Dashboard and Projects page

**Cancel Button:**
- Discards all changes
- Closes modal without saving

---

## AI-Powered Intelligence

### Methodology Selection

When "Let AI choose" is selected:
- Analyzes project timeline
- Considers team size and experience
- Recommends best-fit methodology
- Explains reasoning

### Task Generation

AI generates contextual tasks based on:
- **Phase type** - Research tasks for discovery, design tasks for development
- **Experience level** - Adjusts complexity and quantity
- **Timeline** - Scales scope appropriately

### Capacity Planning

Automatically calculates:
- Total hours needed
- Project duration in weeks
- Shows warnings if capacity insufficient
- Suggests timeline adjustments

---

## Integration with Existing Features

### Dashboard
- New projects appear in "Active Projects" section
- Task counts update
- Capacity metrics include new project

### Projects Page
- Project card displayed immediately
- Shows methodology badge
- Progress bar at 0%
- All metadata visible

### Tasks Page
- All generated tasks listed
- Organized by status
- Filterable and searchable

### Timeline View
- Tasks mapped to weeks
- Color-coded by phase
- Cross-project visualization

### Capacity Planner
- Hours allocated automatically
- Project breakdown shown
- Overload warnings if needed

### AI Assistant
- Can create tasks in new project
- Recognizes new project by name
- Can modify timeline and tasks

---

## Best Practices

### Writing Good Design Briefs
```
Example:
"Redesign the mobile shopping experience to improve conversion
rates and user satisfaction. Key issues include:
- Complex checkout flow (5 steps)
- Poor product discovery
- Outdated visual design
- Low mobile conversion (2.3%)

Goals:
- Reduce checkout to 3 steps
- Improve search and filters
- Modern, accessible UI
- Target 4%+ conversion

Constraints:
- Must integrate with existing backend
- Launch in Q2 2024
- iOS and Android
"
```

### Choosing Timeline
- Be realistic about available capacity
- Factor in meetings, reviews, iterations
- Add buffer for unexpected issues
- Consider stakeholder availability

### Team Size vs Capacity
- 1 designer @ 30h/week = moderate pace
- 2 designers @ 40h/week = fast pace
- 3+ designers = large/complex project

### Experience Level Impact
- Junior: More granular tasks, longer estimates
- Mid-level: Balanced tasks and time
- Senior: High-level tasks, efficient estimates

---

## Keyboard Shortcuts

- **Enter** - Next step (when enabled)
- **Escape** - Close modal (with confirmation)
- **Tab** - Navigate form fields

---

## Technical Details

### Components Architecture
```
NewProjectModal (Main wizard)
├── ProjectInfoForm (Step 1)
├── ProjectSettingsForm (Step 2)
├── AIPlanGenerator (Step 3 logic)
└── ProjectPlanPreview (Step 4)
    ├── PhaseSection (per phase)
    └── TaskCard (per task)
```

### Data Flow
```
User Input (Form Data)
    ↓
AI Plan Generator (lib/aiPlanGenerator.ts)
    ↓
Generated Phases & Tasks
    ↓
Editable Preview
    ↓
Save → ProjectContext.addProject()
    ↓
Global State Updated
    ↓
All Pages Reflect New Project
```

### State Management
- Form data: Local component state
- Generated plan: Local component state
- Saved project: Global ProjectContext
- Real-time updates across all pages

---

## Examples

### Example 1: Quick Design Sprint
```
Input:
- Name: "5-Day Design Sprint - New Feature"
- Timeline: 5 days
- Methodology: Design Sprint
- Experience: Senior
- Capacity: 40h/week

Output:
- 5 phases (Map, Sketch, Decide, Prototype, Test)
- 10 tasks total
- 40 hours estimated
- 1 week duration
```

### Example 2: Complex Redesign
```
Input:
- Name: "Enterprise Platform Redesign"
- Timeline: 12 weeks
- Methodology: Design Thinking
- Experience: Mid-level
- Team: 3 designers
- Capacity: 30h/week each

Output:
- 5 phases (Empathize, Define, Ideate, Prototype, Test)
- 15 tasks total
- 360 hours estimated
- 12 weeks duration
```

### Example 3: AI Assistant Command
```
Command: "Create a new project for redesigning a mobile banking onboarding flow"

Pre-fills:
- Title: "Redesigning a mobile banking onboarding flow"
- Description: Same as title
- Design Brief: Same as title
- Other fields: Defaults

User can then:
- Refine the brief
- Set timeline
- Choose methodology
- Generate plan
```

---

## Troubleshooting

### "Capacity Warning" appears
**Issue:** Project requires more hours than available
**Solutions:**
- Extend timeline
- Increase weekly capacity
- Reduce scope (delete tasks)
- Add team members

### Tasks seem too generic
**Issue:** AI generated basic task descriptions
**Solution:**
- Edit tasks to add specificity
- Add stakeholders manually
- Include links to relevant docs
- Customize descriptions

### Can't find generated project
**Issue:** Project saved but not visible
**Check:**
- Projects page (should appear immediately)
- Dashboard (check "All Projects" filter)
- Status filter (set to "Planning")

### Modal won't close
**Issue:** Stuck in wizard
**Solution:**
- Click Cancel button
- Click X in top-right
- Refresh page (progress lost)

---

## Future Enhancements

Planned features:
- [ ] Import from Jira/Confluence
- [ ] Templates for common project types
- [ ] Duplicate existing project
- [ ] Bulk task operations
- [ ] Custom phase creation
- [ ] Task dependencies visualization
- [ ] Gantt timeline in preview
- [ ] Export project plan as PDF
- [ ] Share project plan link
- [ ] Collaborative editing

---

## API Integration (Future)

Ready for real AI integration:
```typescript
// Current (Mock)
const plan = generateProjectPlan(formData);

// Future (Real AI)
const response = await fetch('/api/generate-plan', {
  method: 'POST',
  body: JSON.stringify({
    brief: formData.designBrief,
    methodology: formData.methodology,
    timeline: formData.timeline,
    experience: formData.experienceLevel,
  })
});
const plan = await response.json();
```

---

## Feedback & Support

For issues or suggestions:
- Use AI Assistant: "I found a bug in project creation"
- Check console for errors
- Review generated project structure

---

Built with ❤️ using Next.js, TypeScript, and AI-powered generation.
