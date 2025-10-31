import { Task, TaskStatus } from '../types/task';
import { Circle, Clock, CheckCircle2, X } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onUpdate: (updates: Partial<Task>) => void;
  onDelete: () => void;
}

const statusConfig: Record<TaskStatus, { 
  label: string; 
  color: string; 
  bgColor: string; 
  icon: typeof Circle;
  borderColor: string;
}> = {
  idle: { 
    label: 'Idle', 
    color: '#6B7280', 
    bgColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    icon: Circle,
  },
  'in-progress': { 
    label: 'In Progress', 
    color: '#3B82F6', 
    bgColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    icon: Clock,
  },
  done: { 
    label: 'Done', 
    color: '#10B981', 
    bgColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    icon: CheckCircle2,
  },
};

export function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const config = statusConfig[task.status];
  const StatusIcon = config.icon;

  const cycleStatus = () => {
    const statuses: TaskStatus[] = ['idle', 'in-progress', 'done'];
    const currentIndex = statuses.indexOf(task.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    onUpdate({ status: nextStatus });
  };

  return (
    <div
      className="bg-white rounded-xl p-4 hover:shadow-lg transition-all duration-300 border border-gray-100 group animate-slide-up backdrop-blur-sm"
      style={{
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.05)',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-gray-800 font-medium text-[15px] leading-relaxed mb-3">
            {task.title}
          </p>
          <button
            onClick={cycleStatus}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105"
            style={{
              color: config.color,
              backgroundColor: config.bgColor,
              border: `1px solid ${config.borderColor}`,
            }}
          >
            <StatusIcon className="w-3.5 h-3.5" />
            {config.label}
          </button>
        </div>
        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg"
          aria-label="Delete task"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
