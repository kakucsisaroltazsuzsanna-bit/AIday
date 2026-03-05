'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import { ChatMessage } from '@/lib/types';
import { useProjects } from '@/lib/context/ProjectContext';

const suggestedPrompts = [
  'Create a new project for mobile app redesign',
  'Create a research plan task',
  'Move Dashboard Wireframes to next week',
  'Extend E-commerce project by 2 weeks',
  'Show me my capacity',
];

interface CommandAction {
  type: 'create_task' | 'move_task' | 'extend_project' | 'create_project' | 'info';
  data?: any;
  confirmation?: string;
}

interface AIAssistantProps {
  onOpenProjectModal?: (prefilledData?: any) => void;
}

export default function AIAssistant({ onOpenProjectModal }: AIAssistantProps) {
  const { projects, weeklyCapacity, addTask, rebalanceWorkload, adjustProjectTimeline } = useProjects();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your AI design assistant. I can help you manage projects, create tasks, and balance your workload. Try commands like:\n\n• "Create a new project for [description]"\n• "Create a [task name] task"\n• "Move [task] to next week"\n• "Extend [project] by 2 weeks"\n• "Show my capacity"',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [pendingAction, setPendingAction] = useState<CommandAction | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const parseCommand = (input: string): CommandAction | null => {
    const lowerInput = input.toLowerCase();

    // Create project command
    if (lowerInput.includes('create') && (lowerInput.includes('project') || lowerInput.includes('new project'))) {
      // Extract project details from the command
      const projectMatch = lowerInput.match(/create (?:a |an )?(?:new )?project (?:for |to )?(.+)/);
      const description = projectMatch ? projectMatch[1] : '';

      return {
        type: 'create_project',
        data: {
          title: description ? description.charAt(0).toUpperCase() + description.slice(1) : '',
          description: description,
        },
        confirmation: null, // No confirmation needed, will open modal
      };
    }

    // Create task command
    if (lowerInput.includes('create') && lowerInput.includes('task')) {
      const activeProject = projects.find(p => p.status === 'active');
      if (!activeProject) {
        return {
          type: 'info',
          data: { message: 'No active projects found. Please set a project to active first.' },
        };
      }

      // Extract task name
      const createMatch = lowerInput.match(/create (?:a |an )?(.+?) task/);
      const taskName = createMatch ? createMatch[1] : 'New Task';

      return {
        type: 'create_task',
        data: {
          projectId: activeProject.id,
          projectTitle: activeProject.title,
          phaseId: activeProject.phases[0]?.id,
          phaseName: activeProject.phases[0]?.name,
          taskName: taskName.charAt(0).toUpperCase() + taskName.slice(1),
        },
        confirmation: `Create "${taskName}" task in ${activeProject.title} (${activeProject.phases[0]?.name} phase)?`,
      };
    }

    // Move task command
    if ((lowerInput.includes('move') || lowerInput.includes('shift')) && lowerInput.includes('week')) {
      const allTasks = projects.flatMap(p =>
        p.phases.flatMap(phase => phase.tasks.map(t => ({ ...t, projectTitle: p.title })))
      );

      // Find task by name mention
      const foundTask = allTasks.find(task =>
        lowerInput.includes(task.title.toLowerCase())
      );

      if (!foundTask) {
        return {
          type: 'info',
          data: { message: 'Could not find that task. Try being more specific or check the task name.' },
        };
      }

      const toWeek = lowerInput.includes('next week') ? foundTask.startWeek + 1 : foundTask.startWeek + 2;

      return {
        type: 'move_task',
        data: {
          taskId: foundTask.id,
          taskTitle: foundTask.title,
          fromWeek: foundTask.startWeek,
          toWeek,
        },
        confirmation: `Move "${foundTask.title}" from Week ${foundTask.startWeek + 1} to Week ${toWeek + 1}?`,
      };
    }

    // Extend project command
    if (lowerInput.includes('extend') && lowerInput.includes('week')) {
      const project = projects.find(p =>
        lowerInput.includes(p.title.toLowerCase())
      );

      if (!project) {
        return {
          type: 'info',
          data: { message: 'Could not find that project. Try using the exact project name.' },
        };
      }

      const weeksMatch = lowerInput.match(/(\d+)\s*weeks?/);
      const additionalWeeks = weeksMatch ? parseInt(weeksMatch[1]) : 2;
      const currentWeeks = parseInt(project.timeline.split(' ')[0]);
      const newTotalWeeks = currentWeeks + additionalWeeks;

      return {
        type: 'extend_project',
        data: {
          projectId: project.id,
          projectTitle: project.title,
          currentWeeks,
          newWeeks: newTotalWeeks,
        },
        confirmation: `Extend ${project.title} from ${currentWeeks} weeks to ${newTotalWeeks} weeks?`,
      };
    }

    // Show capacity command
    if (lowerInput.includes('capacity') || lowerInput.includes('workload')) {
      const currentWeek = weeklyCapacity[0];
      const nextWeek = weeklyCapacity[1];
      const isOverbooked = currentWeek.allocatedHours > currentWeek.availableHours;

      let response = `📊 **Capacity Overview**\n\n`;
      response += `**This Week:**\n`;
      response += `• Allocated: ${currentWeek.allocatedHours}h / ${currentWeek.availableHours}h\n`;
      response += `• Status: ${isOverbooked ? '⚠️ Overbooked by ' + (currentWeek.allocatedHours - currentWeek.availableHours) + 'h' : '✅ On track'}\n\n`;

      if (nextWeek) {
        response += `**Next Week:**\n`;
        response += `• Allocated: ${nextWeek.allocatedHours}h / ${nextWeek.availableHours}h\n`;
        response += `• Available: ${nextWeek.availableHours - nextWeek.allocatedHours}h\n`;
      }

      return {
        type: 'info',
        data: { message: response },
      };
    }

    return null;
  };

  const executeAction = (action: CommandAction) => {
    switch (action.type) {
      case 'create_task':
        addTask(
          action.data.projectId,
          action.data.phaseId,
          {
            title: action.data.taskName,
            description: `AI-generated task: ${action.data.taskName}`,
            phase: action.data.phaseName,
            estimatedHours: 8,
            priority: 'Medium',
            status: 'todo',
            startWeek: 0,
            duration: 1,
            jiraDescription: `Task created by AI assistant: ${action.data.taskName}`,
          }
        );
        setNotification({
          type: 'success',
          message: `✅ Created "${action.data.taskName}" in ${action.data.projectTitle}`,
        });
        return `Task "${action.data.taskName}" has been created in ${action.data.projectTitle} (${action.data.phaseName} phase) with 8 hours estimated. You can view it in the project workspace.`;

      case 'move_task':
        rebalanceWorkload(action.data.fromWeek, action.data.toWeek, action.data.taskId);
        setNotification({
          type: 'success',
          message: `✅ Moved "${action.data.taskTitle}" to Week ${action.data.toWeek + 1}`,
        });
        return `Task "${action.data.taskTitle}" has been moved from Week ${action.data.fromWeek + 1} to Week ${action.data.toWeek + 1}. Your capacity has been updated accordingly.`;

      case 'extend_project':
        adjustProjectTimeline(action.data.projectId, action.data.newWeeks);
        setNotification({
          type: 'success',
          message: `✅ Extended ${action.data.projectTitle} to ${action.data.newWeeks} weeks`,
        });
        return `Project "${action.data.projectTitle}" has been extended from ${action.data.currentWeeks} weeks to ${action.data.newWeeks} weeks.`;

      case 'create_project':
        if (onOpenProjectModal) {
          onOpenProjectModal(action.data);
        }
        return `Opening project creation wizard${action.data.title ? ` for "${action.data.title}"` : ''}...`;

      case 'info':
        return action.data.message;

      default:
        return 'Action completed.';
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const action = parseCommand(input);

      if (action) {
        if (action.confirmation) {
          // Show confirmation dialog
          setPendingAction(action);
          const assistantMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: action.confirmation,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
        } else {
          // Execute immediately for info commands
          const response = executeAction(action);
          const assistantMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: response,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
        }
      } else {
        // Fallback response
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'I understand your request. Try commands like:\n• "Create a [task name] task"\n• "Move [task name] to next week"\n• "Extend [project name] by 2 weeks"\n• "Show my capacity"',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }

      setIsTyping(false);
    }, 1000);
  };

  const handleConfirm = (confirm: boolean) => {
    if (!pendingAction) return;

    if (confirm) {
      const response = executeAction(pendingAction);
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } else {
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Action cancelled. How else can I help you?',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }

    setPendingAction(null);
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <>
      {notification && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-lg border bg-white px-4 py-3 shadow-lg animate-in slide-in-from-top">
          {notification.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600" />
          )}
          <p className="text-sm font-medium text-gray-900">{notification.message}</p>
        </div>
      )}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex h-[600px] w-[420px] flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-t-2xl">
            <div className="flex items-center gap-2 text-white">
              <Sparkles className="h-5 w-5" />
              <h3 className="font-semibold">AI Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={clsx(
                  'flex',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={clsx(
                    'max-w-[85%] rounded-lg px-4 py-2 text-sm',
                    message.role === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className="mt-1 text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {pendingAction && (
              <div className="flex justify-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleConfirm(true)}
                    className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleConfirm(false)}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0ms' }} />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '150ms' }} />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="border-t border-gray-200 p-4">
              <p className="mb-2 text-xs font-medium text-gray-500">Try these commands:</p>
              <div className="space-y-2">
                {suggestedPrompts.slice(0, 3).map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handlePromptClick(prompt)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-left text-xs text-gray-700 transition-colors hover:bg-gray-100"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !pendingAction && handleSend()}
                placeholder="Type a command..."
                disabled={!!pendingAction}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping || !!pendingAction}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600 text-white transition-colors hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
