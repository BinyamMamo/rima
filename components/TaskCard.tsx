import React from 'react';
import { Task, User } from '@/types';
import { CheckSquare, Square, Clock, TrendUp, User as UserIcon, Warning } from '@phosphor-icons/react';

interface TaskCardProps {
  task: Task;
  workspaceMembers?: User[];
  onToggleComplete?: (taskId: string) => void;
  onTaskClick?: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  workspaceMembers,
  onToggleComplete,
  onTaskClick,
}) => {
  // Get assignee details
  const assigneeUser = workspaceMembers?.find(m => m.name === task.assignee);

  // Determine if overdue
  const isOverdue = task.dueDate !== 'Not set' && new Date(task.dueDate) < new Date() && !task.completed;
  const isDueToday = task.dueDate !== 'Not set' && new Date(task.dueDate).toDateString() === new Date().toDateString();

  // Status badge color
  const getStatusColor = () => {
    if (task.completed || task.status === 'completed') return 'bg-green-500/10 text-green-600 border-green-500/20';
    if (task.status === 'blocked') return 'bg-red-500/10 text-red-600 border-red-500/20';
    if (task.status === 'in_progress') return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
  };

  // Deadline color
  const getDeadlineColor = () => {
    if (isOverdue) return 'text-red-600';
    if (isDueToday) return 'text-orange-600';
    return 'text-[var(--text-secondary)]';
  };

  return (
    <div
      className={`
        group relative p-4 rounded-2xl border transition-all
        ${task.completed
          ? 'bg-[var(--bg-surface)] border-[var(--border-subtle)] opacity-60'
          : 'bg-[var(--bg-card)] border-[var(--border-subtle)] hover:border-[var(--primary)]'
        }
        ${onTaskClick ? 'cursor-pointer' : ''}
      `}
      onClick={() => onTaskClick?.(task)}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete?.(task.id);
          }}
          className="shrink-0 mt-0.5 text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
        >
          {task.completed ? (
            <CheckSquare size={20} weight="fill" className="text-[var(--primary)]" />
          ) : (
            <Square size={20} weight="regular" />
          )}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <p className={`text-sm font-medium ${task.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}`}>
            {task.title}
          </p>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {/* Assignee */}
            {task.assignee && (
              <div className="flex items-center gap-1.5">
                {assigneeUser ? (
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${assigneeUser.avatarColor}`}
                    title={assigneeUser.name}
                  >
                    {assigneeUser.name[0]}
                  </div>
                ) : (
                  <UserIcon size={14} className="text-[var(--text-muted)]" />
                )}
                <span className="text-xs text-[var(--text-secondary)]">{task.assignee}</span>
              </div>
            )}

            {/* Deadline */}
            {task.dueDate && task.dueDate !== 'Not set' && (
              <div className={`flex items-center gap-1 ${getDeadlineColor()}`}>
                {isOverdue && <Warning size={14} weight="fill" />}
                <Clock size={14} />
                <span className="text-xs font-medium">
                  {task.deadline || formatDate(task.dueDate)}
                </span>
              </div>
            )}

            {/* Status */}
            {task.status && task.status !== 'pending' && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor()}`}>
                {task.status.replace('_', ' ')}
              </span>
            )}

            {/* Source */}
            {task.source === 'chat' && (
              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                from chat
              </span>
            )}
          </div>

          {/* Progress Bar */}
          {task.progress !== undefined && task.progress > 0 && !task.completed && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <TrendUp size={12} className="text-[var(--primary)]" />
                  <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Progress
                  </span>
                </div>
                <span className="text-xs font-bold text-[var(--primary)]">{task.progress}%</span>
              </div>
              <div className="h-1.5 bg-[var(--bg-surface)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--primary)] transition-all duration-300 rounded-full"
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to format date
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      // Return as "Jan 15" or "Jan 15, 2026" if different year
      const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
      if (date.getFullYear() !== today.getFullYear()) {
        options.year = 'numeric';
      }
      return date.toLocaleDateString('en-US', options);
    }
  } catch {
    return dateString;
  }
}

export default TaskCard;
