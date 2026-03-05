'use client';

import { useState } from 'react';
import { Task, Phase } from '@/lib/types';
import { DndContext, DragEndEvent, DragStartEvent, PointerSensor, useSensor, useSensors, DragOverlay, useDroppable, useDraggable } from '@dnd-kit/core';
import { GripVertical, Calendar, Clock, Info } from 'lucide-react';
import { format, addWeeks } from 'date-fns';

interface TimelineEditorProps {
  phases: Phase[];
  projectStartDate: Date;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

interface DroppableWeekProps {
  weekIndex: number;
  children: React.ReactNode;
}

function DroppableWeek({ weekIndex, children }: DroppableWeekProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `week-${weekIndex}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={`border border-dashed rounded transition-colors ${
        isOver
          ? 'bg-purple-100 border-purple-400'
          : 'bg-gray-50/50 border-gray-200'
      }`}
    >
      {children}
    </div>
  );
}

interface DraggableTaskCardProps {
  task: Task;
  taskIndex: number;
  weeks: number[];
  priorityColors: Record<string, string>;
  onDurationChange: (taskId: string, duration: number) => void;
}

function DraggableTaskCard({ task, taskIndex, weeks, priorityColors, onDurationChange }: DraggableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const columnWidth = 100 / weeks.length;
  const taskWidth = columnWidth * task.duration;
  const taskLeft = columnWidth * task.startWeek;

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        top: `${taskIndex * 70 + 10}px`,
        left: `calc(${taskLeft}% + ${task.startWeek * 8}px)`,
        width: `calc(${taskWidth}% - ${(task.duration - 1) * 8}px)`,
        minWidth: '100px',
      }}
      className={`absolute ${isDragging ? 'opacity-30 z-50' : 'z-10'} transition-opacity`}
    >
      <div
        className={`
          relative rounded-lg border-2 bg-white p-3 shadow-sm transition-all
          hover:shadow-md hover:border-purple-400 cursor-move
          ${priorityColors[task.priority]}
        `}
        {...attributes}
        {...listeners}
      >
        <div className="flex items-start gap-2">
          <GripVertical className="h-4 w-4 flex-shrink-0 text-gray-400 mt-0.5 cursor-grab active:cursor-grabbing" />
          <div className="flex-1 min-w-0">
            <h5 className="text-sm font-medium text-gray-900 truncate" title={task.title}>
              {task.title}
            </h5>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs text-gray-600 flex items-center gap-1 whitespace-nowrap">
                <Clock className="h-3 w-3" />
                {task.estimatedHours}h
              </span>
              <span className="text-xs text-gray-600 flex items-center gap-1 whitespace-nowrap">
                <Calendar className="h-3 w-3" />
                <input
                  type="number"
                  min="1"
                  max={weeks.length - task.startWeek}
                  value={task.duration}
                  onChange={(e) => onDurationChange(task.id, parseInt(e.target.value))}
                  onClick={(e) => e.stopPropagation()}
                  className="w-12 border border-gray-300 rounded px-1 py-0.5 text-center hover:border-purple-400 focus:border-purple-500 focus:outline-none"
                />
                <span className="text-xs">{task.duration === 1 ? 'wk' : 'wks'}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TimelineEditor({ phases, projectStartDate, onUpdateTask }: TimelineEditorProps) {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Calculate total weeks needed
  const allTasks = phases.flatMap(phase => phase.tasks);
  const maxWeek = Math.max(...allTasks.map(task => task.startWeek + task.duration), 12);
  const weeks = Array.from({ length: maxWeek }, (_, i) => i);

  const handleDragStart = (event: DragStartEvent) => {
    const task = allTasks.find(t => t.id === event.active.id);
    if (task) {
      setDraggedTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setDraggedTask(null);

    if (!event.over) return;

    const taskId = event.active.id as string;
    const dropTarget = event.over.id as string;

    // Check if dropped on a week column
    const weekMatch = dropTarget.match(/week-(\d+)/);
    if (weekMatch) {
      const targetWeek = parseInt(weekMatch[1]);
      onUpdateTask(taskId, { startWeek: targetWeek });
    }
  };

  const handleDurationChange = (taskId: string, newDuration: number) => {
    if (newDuration >= 1) {
      onUpdateTask(taskId, { duration: newDuration });
    }
  };

  const getTasksInWeek = (weekIndex: number) => {
    return allTasks.filter(task =>
      task.startWeek <= weekIndex &&
      task.startWeek + task.duration > weekIndex
    );
  };

  const getTaskColor = (phaseId: string) => {
    const phase = phases.find(p => p.tasks.some(t => t.phase === phaseId));
    return phase?.color || 'bg-purple-500';
  };

  const priorityColors = {
    High: 'border-red-400',
    Medium: 'border-orange-400',
    Low: 'border-blue-400',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Project Timeline</h3>
          <p className="text-sm text-gray-600">Drag tasks to adjust their start week, or edit duration below</p>
        </div>
      </div>

      {/* Info Box */}
      <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">How to use Timeline View:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Drag task cards left/right to change their start week</li>
              <li>Edit the duration input field to change how many weeks a task spans</li>
              <li>Border colors indicate priority: Red (High), Orange (Medium), Blue (Low)</li>
              <li>Tasks are grouped by phase for better organization</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Timeline Grid */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Week Headers */}
            <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(120px, 1fr))` }}>
              {weeks.map((week) => (
                <div
                  key={week}
                  className="text-center border-b-2 border-gray-300 pb-2"
                >
                  <div className="text-xs font-semibold text-gray-900">Week {week + 1}</div>
                  <div className="text-xs text-gray-600">
                    {format(addWeeks(projectStartDate, week), 'MMM d')}
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline Rows by Phase */}
            {phases.map((phase) => (
              <div key={phase.id} className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`h-3 w-3 rounded-full ${phase.color.split(' ')[0]}`} />
                  <h4 className="text-sm font-semibold text-gray-900">{phase.name}</h4>
                  <span className="text-xs text-gray-600">({phase.tasks.length} tasks)</span>
                </div>

                <div className="relative" style={{ minHeight: `${phase.tasks.length * 70 + 20}px` }}>
                  {/* Week Columns (Drop Zones) */}
                  <div className="absolute inset-0 grid gap-2" style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(120px, 1fr))` }}>
                    {weeks.map((week) => (
                      <DroppableWeek key={`week-${week}`} weekIndex={week}>
                        <div className="h-full" />
                      </DroppableWeek>
                    ))}
                  </div>

                  {/* Task Cards */}
                  {phase.tasks.map((task, taskIndex) => (
                    <DraggableTaskCard
                      key={task.id}
                      task={task}
                      taskIndex={taskIndex}
                      weeks={weeks}
                      priorityColors={priorityColors}
                      onDurationChange={handleDurationChange}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <DragOverlay>
          {draggedTask ? (
            <div className="opacity-90 rotate-2">
              <div
                className={`
                  rounded-lg border-2 bg-white p-3 shadow-lg
                  ${priorityColors[draggedTask.priority]}
                `}
                style={{ width: '150px' }}
              >
                <div className="flex items-start gap-2">
                  <GripVertical className="h-4 w-4 flex-shrink-0 text-gray-400 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-medium text-gray-900 truncate">
                      {draggedTask.title}
                    </h5>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-600 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {draggedTask.estimatedHours}h
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Legend */}
      <div className="flex items-center gap-6 pt-4 border-t border-gray-200 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded border-2 border-red-400" />
          <span className="text-gray-600">High Priority</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded border-2 border-orange-400" />
          <span className="text-gray-600">Medium Priority</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded border-2 border-blue-400" />
          <span className="text-gray-600">Low Priority</span>
        </div>
        <div className="ml-auto text-xs text-gray-600">
          Drag tasks horizontally to change start week • Edit duration inline
        </div>
      </div>
    </div>
  );
}
