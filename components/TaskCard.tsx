import { Clock, AlertCircle, CheckCircle2, Circle } from 'lucide-react';
import clsx from 'clsx';
import { Task } from '@/lib/types';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  compact?: boolean;
}

const priorityColors = {
  High: 'text-red-600 bg-red-50 border-red-200',
  Medium: 'text-orange-600 bg-orange-50 border-orange-200',
  Low: 'text-blue-600 bg-blue-50 border-blue-200',
};

const statusIcons = {
  'todo': Circle,
  'in-progress': AlertCircle,
  'done': CheckCircle2,
};

const statusColors = {
  'todo': 'text-gray-400',
  'in-progress': 'text-yellow-500',
  'done': 'text-green-500',
};

export default function TaskCard({ task, onClick, compact = false }: TaskCardProps) {
  const StatusIcon = statusIcons[task.status];

  return (
    <div
      onClick={onClick}
      className={clsx(
        'group cursor-pointer rounded-lg border border-gray-200 bg-white transition-all hover:border-purple-300 hover:shadow-md',
        compact ? 'p-3' : 'p-4'
      )}
    >
      <div className="mb-2 flex items-start justify-between">
        <h3 className={clsx(
          'font-medium text-gray-900 group-hover:text-purple-700',
          compact ? 'text-sm' : 'text-base'
        )}>
          {task.title}
        </h3>
        <StatusIcon className={clsx('h-4 w-4 flex-shrink-0 ml-2', statusColors[task.status])} />
      </div>

      {!compact && (
        <p className="mb-3 line-clamp-2 text-sm text-gray-600">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={clsx(
              'rounded-full border px-2 py-0.5 text-xs font-medium',
              priorityColors[task.priority]
            )}
          >
            {task.priority}
          </span>
          <span className="flex items-center text-xs text-gray-600">
            <Clock className="mr-1 h-3 w-3" />
            {task.estimatedHours}h
          </span>
        </div>
        <span className="text-xs font-medium text-gray-500">
          {task.phase}
        </span>
      </div>
    </div>
  );
}
