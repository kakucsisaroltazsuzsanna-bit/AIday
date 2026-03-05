# AI Design Project Planner

A modern web application that helps product designers manage multiple design projects, generate AI-powered project plans, and track design capacity across projects.

## Features

### Multi-Project Management
- Manage multiple design projects simultaneously
- View projects as cards, lists, or timeline
- Track project status, progress, and methodology
- Detailed project workspace with phases and tasks

### AI Project Plan Generator
- Generate project plans from design briefs
- Intelligent methodology recommendations
- Automated task breakdown and time estimates
- Suggested meetings and milestones

### Persistent AI Assistant ✨ NEW
- **AI-Powered Commands** - Modify project plans with natural language
- **Create Tasks** - "Create a user testing task" → Task created instantly
- **Rebalance Workload** - "Move Dashboard Wireframes to next week" → Automatic capacity adjustment
- **Extend Projects** - "Extend E-commerce project by 2 weeks" → Timeline updated
- **Capacity Queries** - "Show my capacity" → Instant workload analysis
- Always-accessible chatbot on every page
- Real-time state updates across all pages
- User confirmation before any modifications
- Success notifications with visual feedback

### Cross-Project Timeline
- Gantt-style timeline view
- Visualize tasks across multiple projects
- Track overlapping projects
- Project milestones and dependencies

### Capacity Planner
- Weekly workload tracking
- Allocated vs available hours
- Overload warnings and suggestions
- Utilization charts and metrics

### Task Management
- Comprehensive task tracking
- Jira-ready task descriptions
- Priority levels and estimates
- Phase organization

### Integrations
- Mock Jira integration
- Mock Confluence integration
- Mock Google Calendar integration
- Mock Google Drive integration
- Document upload capability

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **date-fns** - Date utilities

## Getting Started

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Try AI Commands

Click the purple floating button (bottom-right) and try:

```
Create a user research task
```
→ Creates a new task instantly

```
Move Dashboard Wireframes to next week
```
→ Rebalances your workload automatically

```
Show my capacity
```
→ Displays your weekly workload

```
Extend E-commerce Mobile App by 2 weeks
```
→ Updates project timeline

See [AI_COMMANDS.md](./AI_COMMANDS.md) for full command documentation.

See [DEMO_GUIDE.md](./DEMO_GUIDE.md) for comprehensive demo walkthrough.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Application Structure

```
app/
├── (main)/                 # Main application layout
│   ├── dashboard/         # Overview and insights
│   ├── projects/          # Project list and detail
│   ├── tasks/             # All tasks view
│   ├── timeline/          # Cross-project Gantt
│   ├── capacity/          # Weekly capacity planner
│   ├── integrations/      # Third-party integrations
│   └── settings/          # User settings
├── layout.tsx             # Root layout
└── page.tsx               # Home redirect

components/
├── Sidebar.tsx            # Navigation sidebar
├── AIAssistant.tsx        # Persistent chatbot
├── ProjectCard.tsx        # Project display card
└── TaskCard.tsx           # Task display card

lib/
├── types.ts               # TypeScript definitions
└── mockData.ts            # Sample project data
```

## Key Features

### Dashboard
- Active projects overview
- Task completion metrics
- Weekly workload summary
- AI insights and recommendations
- Upcoming milestones

### Projects
- Grid, list, and timeline views
- Detailed project workspace
- Phase-based organization
- Task management

### Timeline
- Cross-project Gantt chart
- 8-week view
- Color-coded by phase
- Task duration visualization

### Capacity Planner
- Weekly capacity overview
- Project allocation breakdown
- Overbooked warnings
- AI rebalancing suggestions
- Utilization charts

### AI Assistant
- Floating chat interface
- Conversation history
- Suggested prompts
- Context-aware responses
- Project data access

## Sample Prompts

Try asking the AI assistant:
- "Create a research plan for my active project"
- "Am I overbooked next week?"
- "What methodology fits this project?"
- "Redistribute my tasks this week"
- "Break this phase into smaller tasks"

## Customization

### Adding New Projects

Edit `lib/mockData.ts` to add more projects:

```typescript
{
  id: 'proj-4',
  title: 'Your Project Title',
  description: 'Project description',
  methodology: 'Design Thinking',
  // ... more fields
}
```

### Modifying AI Responses

Update the `mockResponses` object in `components/AIAssistant.tsx`:

```typescript
const mockResponses: Record<string, string> = {
  'your keyword': 'Your AI response',
  // ...
};
```

## Design System

- **Colors**: Purple primary (#9333ea), neutral grays
- **Typography**: Inter font family
- **Components**: Rounded corners, subtle shadows
- **Layout**: Sidebar navigation, full-height pages
- **Inspiration**: Linear, Notion, Asana

## Future Enhancements

- [ ] Real AI integration (Claude/OpenAI)
- [ ] Actual Jira API integration
- [ ] Real-time collaboration
- [ ] Team management
- [ ] Dark mode
- [ ] Mobile responsiveness
- [ ] Export functionality
- [ ] Advanced filtering
- [ ] Custom methodologies
- [ ] Time tracking

## License

MIT
