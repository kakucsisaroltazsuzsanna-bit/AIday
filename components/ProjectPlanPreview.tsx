'use client';

import { useState } from 'react';
import { GeneratedPhase, GeneratedTask, NewProjectFormData, Priority } from '@/lib/types';
import { Pencil, Trash2, Plus, GripVertical, Clock, AlertCircle, Info } from 'lucide-react';
import { estimateProjectDuration } from '@/lib/aiPlanGenerator';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ProjectPlanPreviewProps {
  plan: GeneratedPhase[];
  formData: NewProjectFormData;
  onPlanUpdate: (plan: GeneratedPhase[]) => void;
}

function SortableTask({
  task,
  phaseId,
  onEdit,
  onDelete,
  isEditing,
}: {
  task: GeneratedTask;
  phaseId: string;
  onEdit: () => void;
  onDelete: () => void;
  isEditing: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group rounded-lg border bg-gray-50 p-4 hover:border-purple-300 hover:bg-white ${
        isDragging ? 'border-purple-500 shadow-lg' : 'border-gray-200'
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          {...attributes}
          {...listeners}
          className="mt-1 cursor-grab touch-none text-gray-400 hover:text-gray-600 active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <h5 className="font-medium text-gray-900">{task.title}</h5>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                task.priority === 'High'
                  ? 'bg-red-100 text-red-700'
                  : task.priority === 'Medium'
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              {task.priority}
            </span>
          </div>
          <p className="text-sm text-gray-600">{task.description}</p>
          <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {task.estimatedHours}h
            </span>
            {task.stakeholders && task.stakeholders.length > 0 && (
              <span>Stakeholders: {task.stakeholders.join(', ')}</span>
            )}
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100">
          <button
            onClick={onEdit}
            className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
            title="Edit task"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="rounded p-1 text-gray-400 hover:bg-red-100 hover:text-red-600"
            title="Delete task"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProjectPlanPreview({ plan, formData, onPlanUpdate }: ProjectPlanPreviewProps) {
  const [editingTask, setEditingTask] = useState<{ phaseId: string; taskId: string } | null>(null);
  const [editedTaskData, setEditedTaskData] = useState<Partial<GeneratedTask>>({});

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const totalHours = plan.reduce(
    (sum, phase) => sum + phase.tasks.reduce((s, task) => s + task.estimatedHours, 0),
    0
  );
  const estimatedWeeks = estimateProjectDuration(plan, formData.weeklyCapacity);
  const totalTasks = plan.reduce((sum, phase) => sum + phase.tasks.length, 0);

  const handleDragEnd = (event: DragEndEvent, phaseId: string) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const updatedPlan = plan.map((phase) => {
        if (phase.id === phaseId) {
          const oldIndex = phase.tasks.findIndex((t) => t.id === active.id);
          const newIndex = phase.tasks.findIndex((t) => t.id === over.id);

          return {
            ...phase,
            tasks: arrayMove(phase.tasks, oldIndex, newIndex),
          };
        }
        return phase;
      });

      onPlanUpdate(updatedPlan);
    }
  };

  const handleEditTask = (phaseId: string, task: GeneratedTask) => {
    setEditingTask({ phaseId, taskId: task.id });
    setEditedTaskData(task);
  };

  const handleSaveTask = () => {
    if (!editingTask) return;

    const updatedPlan = plan.map((phase) => {
      if (phase.id === editingTask.phaseId) {
        return {
          ...phase,
          tasks: phase.tasks.map((task) =>
            task.id === editingTask.taskId ? { ...task, ...editedTaskData } : task
          ),
        };
      }
      return phase;
    });

    onPlanUpdate(updatedPlan);
    setEditingTask(null);
    setEditedTaskData({});
  };

  const handleDeleteTask = (phaseId: string, taskId: string) => {
    const updatedPlan = plan.map((phase) => {
      if (phase.id === phaseId) {
        return {
          ...phase,
          tasks: phase.tasks.filter((task) => task.id !== taskId),
        };
      }
      return phase;
    });

    onPlanUpdate(updatedPlan);
  };

  const handleAddTask = (phaseId: string) => {
    const newTask: GeneratedTask = {
      id: `task-${Date.now()}`,
      title: 'New Task',
      description: 'Add a description for this task',
      estimatedHours: 8,
      priority: 'Medium',
    };

    const updatedPlan = plan.map((phase) => {
      if (phase.id === phaseId) {
        return {
          ...phase,
          tasks: [...phase.tasks, newTask],
        };
      }
      return phase;
    });

    onPlanUpdate(updatedPlan);
  };

  return (
    <div className="space-y-6">
      {/* Novice User Help */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
          <div className="text-sm text-blue-900">
            <p className="font-medium">How to customize your plan:</p>
            <ul className="mt-2 space-y-1 text-blue-800">
              <li>• <strong>Drag tasks</strong> up/down to reorder them within a phase</li>
              <li>• <strong>Click pencil icon</strong> to edit task details</li>
              <li>• <strong>Click trash icon</strong> to delete a task</li>
              <li>• <strong>Click "+ Add Task"</strong> to create new tasks</li>
              <li>• Review the summary below to ensure capacity fits your timeline</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-purple-50 to-blue-50 p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Generated Project Plan Summary</h3>
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <p className="text-sm text-gray-600">Total Phases</p>
            <p className="text-2xl font-bold text-gray-900">{plan.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Tasks</p>
            <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Estimated Hours</p>
            <p className="text-2xl font-bold text-gray-900">{totalHours}h</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Estimated Duration</p>
            <p className="text-2xl font-bold text-gray-900">{estimatedWeeks} weeks</p>
          </div>
        </div>

        {totalHours > formData.weeklyCapacity * estimatedWeeks && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-orange-200 bg-orange-50 p-3">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-600" />
            <div className="text-sm text-orange-800">
              <p className="font-medium">⚠️ Capacity Warning</p>
              <p className="mt-1">
                This project requires <strong>{totalHours} hours</strong> but you only have{' '}
                <strong>{formData.weeklyCapacity * estimatedWeeks}h</strong> available. Consider
                adjusting tasks, extending the timeline, or increasing weekly capacity.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Phases */}
      <div className="space-y-6">
        {plan.map((phase, phaseIndex) => (
          <div key={phase.id} className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${phase.color.split(' ')[0]}`} />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{phase.name}</h4>
                  <p className="text-sm text-gray-600">{phase.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{phase.tasks.length} tasks</p>
                <p className="text-xs text-gray-500">
                  {phase.tasks.reduce((sum, task) => sum + task.estimatedHours, 0)}h total
                </p>
              </div>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleDragEnd(event, phase.id)}
            >
              <SortableContext
                items={phase.tasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {phase.tasks.map((task) => (
                    editingTask?.taskId === task.id ? (
                      <div
                        key={task.id}
                        className="rounded-lg border border-purple-300 bg-purple-50 p-4 space-y-3"
                      >
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-700">Title</label>
                          <input
                            type="text"
                            value={editedTaskData.title || task.title}
                            onChange={(e) =>
                              setEditedTaskData({ ...editedTaskData, title: e.target.value })
                            }
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-700">Description</label>
                          <textarea
                            value={editedTaskData.description || task.description}
                            onChange={(e) =>
                              setEditedTaskData({ ...editedTaskData, description: e.target.value })
                            }
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                            rows={2}
                          />
                        </div>
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <label className="mb-1 block text-xs font-medium text-gray-700">Hours</label>
                            <input
                              type="number"
                              min="1"
                              value={editedTaskData.estimatedHours || task.estimatedHours}
                              onChange={(e) =>
                                setEditedTaskData({
                                  ...editedTaskData,
                                  estimatedHours: parseInt(e.target.value) || 1,
                                })
                              }
                              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="mb-1 block text-xs font-medium text-gray-700">Priority</label>
                            <select
                              value={editedTaskData.priority || task.priority}
                              onChange={(e) =>
                                setEditedTaskData({
                                  ...editedTaskData,
                                  priority: e.target.value as Priority,
                                })
                              }
                              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                            >
                              <option value="High">High</option>
                              <option value="Medium">Medium</option>
                              <option value="Low">Low</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveTask}
                            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={() => setEditingTask(null)}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <SortableTask
                        key={task.id}
                        task={task}
                        phaseId={phase.id}
                        onEdit={() => handleEditTask(phase.id, task)}
                        onDelete={() => handleDeleteTask(phase.id, task.id)}
                        isEditing={editingTask?.taskId === task.id}
                      />
                    )
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            <button
              onClick={() => handleAddTask(phase.id)}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-3 text-sm font-medium text-gray-600 hover:border-purple-400 hover:bg-purple-50 hover:text-purple-700"
            >
              <Plus className="h-4 w-4" />
              Add Task to {phase.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
