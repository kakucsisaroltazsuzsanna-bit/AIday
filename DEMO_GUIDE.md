# AI Design Project Planner - Demo Guide

## Quick Start

The app is running at: **http://localhost:3000**

The application will automatically redirect you to the Dashboard.

---

## AI Assistant - Live Demo Commands

The AI Assistant is always accessible via the **purple floating button** in the bottom-right corner of every page.

### Try These Commands (In Order)

#### 1. Check Your Current Workload
```
Show my capacity
```
**What happens:**
- AI displays current week: 38h / 40h allocated
- Shows you're nearly at capacity
- Displays next week: 42h / 40h (overbooked by 2h!)

---

#### 2. Create a New Task
```
Create a user testing task
```
**What happens:**
- AI asks for confirmation: "Create 'user testing' task in E-commerce Mobile App (Discover phase)?"
- Click **Confirm**
- Success notification appears: "✅ Created 'user testing' in E-commerce Mobile App"
- Task appears in Projects page under E-commerce project
- Capacity increases by 8 hours

---

#### 3. Fix Overbooked Week
```
Move Dashboard Wireframes to next week
```
**What happens:**
- AI asks: "Move 'Dashboard Wireframes' from Week 2 to Week 3?"
- Click **Confirm**
- Success notification: "✅ Moved 'Dashboard Wireframes' to Week 3"
- Capacity Planner updates automatically
- Week 2 now shows 30h (under capacity!)
- Timeline view reflects the change

---

#### 4. Extend a Project
```
Extend E-commerce Mobile App by 2 weeks
```
**What happens:**
- AI asks: "Extend E-commerce Mobile App from 8 weeks to 10 weeks?"
- Click **Confirm**
- Success notification: "✅ Extended E-commerce Mobile App to 10 weeks"
- Project card shows updated timeline
- Project detail page reflects new end date

---

#### 5. Check Updated Capacity
```
Show my capacity
```
**What happens:**
- AI displays updated allocation
- Week 2 now balanced (30h / 40h)
- Shows impact of your changes

---

## Exploring the Application

### 1. Dashboard (Default Page)
**Features:**
- 4 metric cards: Active Projects, Tasks Completed, This Week Hours, Overbooked Hours
- Active projects grid with progress bars
- AI Insights panel (purple gradient box)
- Upcoming Milestones timeline

**What to notice:**
- Numbers update in real-time when AI creates tasks
- Overbooked warning appears when capacity exceeded
- Project progress reflects completed tasks

---

### 2. Projects Page
**Features:**
- Grid view of all 3 projects
- Project cards show: title, description, methodology, status, progress, team size
- Click any card to open detailed workspace

**Try this:**
1. Click on "E-commerce Mobile App" card
2. See all 4 phases with color coding
3. Notice the new task you created via AI
4. Scroll through phases: Discover → Define → Develop → Deliver

---

### 3. Project Workspace (Click a project)
**Features:**
- Project header with metadata (Methodology, Timeline, Estimated Hours, Progress)
- Collapsible phase sections with color indicators
- Task cards within each phase
- Priority badges (High, Medium, Low)
- Status icons (Circle = Todo, Alert = In Progress, Check = Done)

**What to notice:**
- Tasks are organized by phase
- Each task shows estimated hours
- Color coding by phase (blue, purple, green, orange)

---

### 4. Tasks Page
**Features:**
- Stats cards: To Do, In Progress, Done counts
- Tasks organized by status
- Filter dropdown
- All tasks from all projects in one view

**Try this:**
1. Notice your AI-created "user testing" task appears here
2. Click any task card to see details (future feature)
3. Observe priority and hour estimates

---

### 5. Timeline Page
**Features:**
- Cross-project Gantt chart
- 8-week view with week numbers and dates
- Color-coded bars by phase
- Projects grouped together

**What to notice:**
- "Dashboard Wireframes" moved to Week 3 (if you ran that command)
- Visual representation of overlapping projects
- Task duration shown in bars
- Color coding matches project phases

---

### 6. Capacity Planner
**Features:**
- 4 metric cards: This Week, Overbooked Hours, Available Next Week, Utilization %
- Bar chart comparing available vs allocated hours
- Weekly breakdown cards with project allocation
- Overbooked warnings (red highlights)
- AI Recommendation box

**What to notice:**
- Red warning when week exceeds 40 hours
- Stacked project breakdown per week
- Utilization bar shows 95%, 105%, etc.
- AI suggests moving tasks when overbooked

**Try this:**
1. Scroll to Week 2 card
2. See project breakdown (E-commerce: 24h, Dashboard: 12h, Design System: 6h)
3. Notice if overbooked warning appears
4. Check AI Recommendation at bottom

---

### 7. Integrations Page
**Features:**
- Mock integrations: Jira, Confluence, Google Calendar, Google Drive
- Connection status indicators
- Document upload area

**Status:**
- Google Calendar: Connected ✅
- Others: Not connected

---

### 8. Settings Page
**Features:**
- Profile settings (Name, Email, Experience Level)
- Notification preferences
- Appearance (Theme selector)
- Data & Privacy (Export, Delete)

---

## AI Assistant Features

### Persistent Across All Pages
- Always accessible via floating button
- Maintains conversation history
- Context-aware of your data
- Commands work from any page

### Conversation History
- Scrollable message history
- Timestamps on messages
- User messages (purple, right-aligned)
- AI responses (gray, left-aligned)

### Suggested Prompts
When you first open the chat, you'll see 3 suggested commands:
1. "Create a research plan for E-commerce project"
2. "Move Dashboard Wireframes to next week"
3. "Add a usability testing task to the active project"

Click any suggestion to auto-fill the input.

### Confirmation Flow
1. Type command → Press Enter
2. AI shows confirmation question
3. Two buttons appear: **Confirm** (purple) | **Cancel** (gray)
4. Input field disables during confirmation
5. Click your choice
6. Success notification appears (top-right)
7. Data updates across all pages instantly

### Success Notifications
- Green checkmark icon
- Appears in top-right corner
- Auto-dismisses after 5 seconds
- Shows what action completed

---

## Real-Time Updates Demo

### Test Data Propagation:

1. **Open Dashboard** - Note current task count
2. **Open AI Assistant**
3. **Type:** "Create a wireframe review task"
4. **Confirm** creation
5. **See notification** appear
6. **Watch Dashboard** task count increase
7. **Navigate to Projects** page
8. **Click E-commerce project**
9. **Scroll to first phase**
10. **See new task** in the list!

### Test Capacity Update:

1. **Open Capacity Planner**
2. **Note Week 2:** 42h allocated (overbooked)
3. **Open AI Assistant**
4. **Type:** "Move Dashboard Wireframes to next week"
5. **Confirm** the move
6. **Watch Week 2** drop to 30h
7. **Watch Week 3** increase
8. **Navigate to Timeline**
9. **See task** in new week position

---

## Advanced Commands to Try

### Multiple Tasks
```
Create a design sprint task
Create a prototype testing task
Create a stakeholder review task
```
→ Creates 3 tasks, all show up in project

### Different Projects
First, note "Dashboard Analytics Redesign" is also active.
```
Create a dashboard layout task
```
→ Goes to first active project (E-commerce)

### Capacity Queries
```
What's my workload?
Am I overbooked?
Show capacity
```
→ All show the same capacity info

### Timeline Extensions
```
Extend Dashboard Analytics by 1 week
Extend Design System by 3 weeks
```
→ Updates project timelines

---

## What Makes This Special

### 1. Intelligent Command Parsing
- Understands natural language variations
- "Create a task" = "Add a task" = "Make a task"
- Partial task name matching
- Context awareness

### 2. Real-Time State Management
- React Context for global state
- All pages subscribe to changes
- No page refresh needed
- Instant updates everywhere

### 3. Capacity Intelligence
- Auto-recalculates workload
- Detects overbooking
- Suggests rebalancing
- Visual warnings

### 4. User Confirmation
- No accidental changes
- Clear action preview
- Easy to cancel
- Undo-friendly (just cancel)

### 5. Visual Feedback
- Success notifications
- Typing indicators
- Loading states
- Color-coded status

---

## Technical Implementation

### Architecture
```
ProjectContext (Global State)
├── Dashboard (subscribes)
├── Projects (subscribes)
├── Tasks (subscribes)
├── Timeline (subscribes)
├── Capacity (subscribes)
└── AI Assistant (modifies state)
```

### State Management Functions
- `addTask()` - Creates new tasks
- `updateTask()` - Modifies existing tasks
- `deleteTask()` - Removes tasks
- `rebalanceWorkload()` - Moves tasks between weeks
- `adjustProjectTimeline()` - Extends projects
- `updateProject()` - Modifies project data

### Data Flow
```
User Command
    ↓
AI Parses Intent
    ↓
Shows Confirmation
    ↓
User Confirms
    ↓
State Update Function
    ↓
All Pages Re-render
    ↓
Success Notification
```

---

## Common Questions

### Q: Do changes persist after refresh?
**A:** Currently no - data is in-memory. Ready for backend integration.

### Q: Can I undo a change?
**A:** Click "Cancel" during confirmation. After confirmation, currently no undo (future feature).

### Q: Why doesn't it find my task?
**A:** Task name must match closely. Try using the exact task title from the project page.

### Q: Can I create tasks in specific phases?
**A:** Currently creates in first phase. Specify phase in command (future feature).

### Q: What if I'm offline?
**A:** All features work offline - no API calls needed. Pure frontend logic.

---

## Future Enhancements

Based on this implementation, easy to add:
- [ ] More command types (delete, update priority, change status)
- [ ] Backend persistence (Supabase, Firebase)
- [ ] Real AI (Claude API, OpenAI)
- [ ] Task drag-and-drop
- [ ] Undo/redo
- [ ] Command history
- [ ] Keyboard shortcuts
- [ ] Voice commands
- [ ] Bulk operations
- [ ] Export to Jira

---

## Tips for Impressive Demo

1. **Start with capacity check** - Shows overbooked state
2. **Create a task** - Shows instant creation
3. **Move task to fix overload** - Shows intelligent rebalancing
4. **Navigate between pages** - Shows real-time updates
5. **Check timeline** - Shows visual representation
6. **End with capacity check** - Shows balanced state

This flow demonstrates:
- Problem identification
- AI-powered solution
- Real-time updates
- Multi-view consistency
- User-friendly UX

---

## Keyboard Shortcuts

- **Enter** - Send message
- **Escape** - Close AI Assistant (future feature)
- Click floating button - Open AI Assistant
- Click X - Close AI Assistant

---

## Browser Compatibility

Tested on:
- Chrome/Edge (Recommended)
- Firefox
- Safari

Requires:
- Modern browser with ES6+ support
- JavaScript enabled
- LocalStorage enabled

---

Enjoy exploring your AI-powered design project planner! 🎨✨
