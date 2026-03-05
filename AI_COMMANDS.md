# AI Assistant Commands

The AI Assistant can execute intelligent commands to modify your project plan in real-time. All commands require confirmation before execution.

## Available Commands

### 1. Create Tasks

**Command Format:**
```
Create a [task name] task
Create an [task name] task
```

**Examples:**
- "Create a user research task"
- "Create an accessibility audit task"
- "Create a design review task"

**What it does:**
- Creates a new task in the first active project
- Adds it to the first phase of that project
- Assigns 8 hours by default
- Sets priority to Medium
- Sets status to Todo
- Updates capacity allocation

**Response:**
Shows confirmation dialog, then creates the task and displays success notification.

---

### 2. Move Tasks (Rebalance Workload)

**Command Format:**
```
Move [task name] to next week
Shift [task name] to next week
Move [task name] to week [number]
```

**Examples:**
- "Move Dashboard Wireframes to next week"
- "Shift User Personas to next week"
- "Move Usability Testing to week 4"

**What it does:**
- Finds the task by name
- Moves it to the specified week
- Updates capacity allocation automatically
- Recalculates weekly workload
- Shows old and new week numbers

**Response:**
Shows confirmation with week details, then moves the task and updates capacity.

---

### 3. Extend Project Timeline

**Command Format:**
```
Extend [project name] by [number] weeks
Extend [project name] by [number] week
```

**Examples:**
- "Extend E-commerce Mobile App by 2 weeks"
- "Extend Dashboard Analytics by 1 week"
- "Extend Design System by 3 weeks"

**What it does:**
- Finds the project by name (must match exactly)
- Adds the specified number of weeks to the timeline
- Updates project end date
- Updates timeline display

**Response:**
Shows confirmation with old and new timeline, then extends the project.

---

### 4. Show Capacity

**Command Format:**
```
Show my capacity
Show capacity
What's my workload
Show my workload
Am I overbooked
```

**Examples:**
- "Show my capacity"
- "What's my workload next week?"
- "Am I overbooked?"

**What it does:**
- Displays current week allocated vs available hours
- Shows if you're overbooked
- Displays next week's capacity
- Shows available hours

**Response:**
Immediate info response with capacity breakdown (no confirmation needed).

---

## Command Parsing Intelligence

The AI Assistant uses natural language processing to understand variations:

### Flexible Keyword Matching
- "create", "add", "make" → Create task
- "move", "shift", "reschedule" → Move task
- "extend", "lengthen", "add time" → Extend timeline
- "capacity", "workload", "hours" → Show capacity

### Context Awareness
- Automatically finds active projects for task creation
- Matches task names even with partial information
- Understands "next week" relative to current date
- Parses numbers from natural language

---

## Examples by Use Case

### Scenario 1: You're Overbooked
```
User: "Am I overbooked next week?"
AI: Shows capacity breakdown with overbooked warning

User: "Move Dashboard Wireframes to week 3"
AI: Confirms and rebalances workload
```

### Scenario 2: Adding Research Tasks
```
User: "Create a competitive analysis task"
AI: Confirms creation in active project

User: "Create a user interview task"
AI: Creates second research task
```

### Scenario 3: Project Running Late
```
User: "Extend E-commerce Mobile App by 2 weeks"
AI: Confirms extension from 8 weeks to 10 weeks

User: "Show my capacity"
AI: Shows updated capacity allocation
```

---

## Confirmation Flow

1. **User sends command** → AI parses intent
2. **AI shows confirmation** → "Create 'User Research' task in E-commerce Mobile App?"
3. **User clicks Confirm/Cancel** → Action executed or cancelled
4. **Success notification** → Top-right corner shows result
5. **Data updates** → All pages reflect changes immediately

---

## Visual Feedback

### Success Notifications
- Green checkmark icon
- Task/action description
- Auto-dismisses after 5 seconds
- Appears in top-right corner

### Confirmation Dialog
- Shows in chat interface
- Confirm (purple) and Cancel (gray) buttons
- Input disabled during confirmation
- Clear action preview

---

## Technical Details

### State Management
- Uses React Context for global state
- All pages subscribe to project updates
- Changes propagate instantly
- No page refresh needed

### Data Persistence
- Changes stored in memory (current session)
- Survives navigation between pages
- Resets on page refresh
- (Ready for backend integration)

### Capacity Recalculation
- Automatic when tasks move
- Considers task duration
- Updates weekly allocation
- Maintains project breakdown

---

## Future Commands (Coming Soon)

- "Delete [task name]"
- "Change [task name] priority to high"
- "Assign [task name] to [person]"
- "Mark [task name] as done"
- "Create a new project"
- "Generate sprint plan"
- "Optimize my schedule"
- "Find available time slots"

---

## Tips for Best Results

1. **Use specific names** - "Move Dashboard Wireframes" works better than "Move that task"
2. **Match project names exactly** - "E-commerce Mobile App" not "ecommerce app"
3. **Be clear with numbers** - "by 2 weeks" not "by a couple weeks"
4. **One command at a time** - Wait for confirmation before next command
5. **Check capacity** - Use "Show my capacity" to verify changes

---

## Error Handling

### Task Not Found
If task name doesn't match:
- AI responds: "Could not find that task. Try being more specific..."
- Suggests checking task name
- No action taken

### Project Not Found
If project name doesn't match:
- AI responds: "Could not find that project. Try using the exact project name."
- No action taken

### No Active Projects
If trying to create task with no active projects:
- AI responds: "No active projects found. Please set a project to active first."
- No action taken

---

## Integration Points

The AI Assistant integrates with:
- **Dashboard** - Shows updated metrics
- **Projects** - Displays new tasks
- **Timeline** - Updates Gantt visualization
- **Capacity** - Recalculates workload
- **Tasks** - Shows all tasks including new ones

All changes are reflected immediately across the entire application.
