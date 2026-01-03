import { Workspace, Room, Insight } from '@/types';

export type PresetType =
  | 'budget'
  | 'deadline'
  | 'team'
  | 'tasks'
  | 'progress'
  | 'spending'
  | 'insights'
  | 'recent_activity';

export interface DashboardPreset {
  id: PresetType;
  title: string;
  icon: string;
  isRelevant: (workspace: Workspace) => boolean;
  renderData: (workspace: Workspace) => any;
}

export const workspacePresets: DashboardPreset[] = [
  {
    id: 'budget',
    title: 'Budget',
    icon: '💰',
    isRelevant: (workspace) => !!workspace.budget,
    renderData: (workspace) => ({
      value: workspace.budget,
      label: 'Total Budget',
    }),
  },
  {
    id: 'deadline',
    title: 'Deadline',
    icon: '⏰',
    isRelevant: (workspace) => !!workspace.deadline,
    renderData: (workspace) => ({
      value: workspace.deadline,
      label: 'Project Deadline',
    }),
  },
  {
    id: 'team',
    title: 'Team',
    icon: '👥',
    isRelevant: (workspace) => workspace.members.length > 0,
    renderData: (workspace) => ({
      value: workspace.members.length,
      label: 'Team Members',
      members: workspace.members,
    }),
  },
  {
    id: 'tasks',
    title: 'Tasks',
    icon: '✓',
    isRelevant: (workspace) => !!workspace.tasks && workspace.tasks.length > 0,
    renderData: (workspace) => {
      const completed = workspace.tasks?.filter(t => t.completed).length || 0;
      const total = workspace.tasks?.length || 0;
      return {
        value: `${completed}/${total}`,
        label: 'Tasks Completed',
        tasks: workspace.tasks,
      };
    },
  },
  {
    id: 'progress',
    title: 'Progress',
    icon: '📊',
    isRelevant: (workspace) => workspace.progress !== undefined && workspace.progress !== null,
    renderData: (workspace) => ({
      value: `${workspace.progress}%`,
      label: 'Overall Progress',
      progress: workspace.progress,
    }),
  },
  {
    id: 'spending',
    title: 'Spending',
    icon: '💸',
    isRelevant: (workspace) => !!workspace.spending && workspace.spending.length > 0,
    renderData: (workspace) => {
      const total = workspace.spending?.reduce((sum, s) => {
        const amount = parseFloat(s.amount.replace(/[^0-9.-]+/g, ''));
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0) || 0;
      return {
        value: `€${total.toFixed(2)}`,
        label: 'Total Spending',
        breakdown: workspace.spending,
      };
    },
  },
];

export const getRelevantPresets = (workspace: Workspace): DashboardPreset[] => {
  return workspacePresets.filter(preset => preset.isRelevant(workspace));
};

// Simulate Rima generating insights based on workspace/room data
export const generateRimaInsights = async (
  workspace: Workspace,
  room?: Room
): Promise<Insight[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const insights: Insight[] = [];
  const context = room || workspace;

  // Analyze messages for patterns
  if (context.messages && context.messages.length > 0) {
    const recentMessages = context.messages.slice(-10);
    const hasQuestions = recentMessages.some(m =>
      typeof m.content === 'string' && m.content.includes('?')
    );

    if (hasQuestions) {
      insights.push({
        category: 'social',
        text: `Recent discussions show ${recentMessages.filter(m => typeof m.content === 'string' && m.content.includes('?')).length} open questions that may need attention.`,
        icon: '❓',
      });
    }
  }

  // Analyze tasks
  if (context.tasks && context.tasks.length > 0) {
    const overdueTasks = context.tasks.filter(t => !t.completed && t.dueDate.toLowerCase().includes('overdue'));
    const upcomingTasks = context.tasks.filter(t => !t.completed && !t.dueDate.toLowerCase().includes('overdue'));

    if (overdueTasks.length > 0) {
      insights.push({
        category: 'risk',
        text: `${overdueTasks.length} task(s) are overdue and require immediate attention.`,
        icon: '⚠️',
      });
    }

    if (upcomingTasks.length > 0) {
      insights.push({
        category: 'planning',
        text: `${upcomingTasks.length} active task(s) are on track. Keep up the momentum!`,
        icon: '✅',
      });
    }
  }

  // Analyze budget vs spending (workspace only)
  if ('budget' in context && context.budget && context.spending) {
    const budgetAmount = parseFloat(context.budget.replace(/[^0-9.-]+/g, ''));
    const totalSpending = context.spending.reduce((sum, s) => {
      const amount = parseFloat(s.amount.replace(/[^0-9.-]+/g, ''));
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    const percentageUsed = (totalSpending / budgetAmount) * 100;

    if (percentageUsed > 80) {
      insights.push({
        category: 'finance',
        text: `Budget utilization is at ${percentageUsed.toFixed(0)}%. Consider reviewing expenses.`,
        icon: '💰',
      });
    } else if (percentageUsed < 50) {
      insights.push({
        category: 'finance',
        text: `Budget utilization is at ${percentageUsed.toFixed(0)}%. Resources are being used efficiently.`,
        icon: '💚',
      });
    }
  }

  // Team collaboration insights
  if (context.members && context.members.length > 1) {
    insights.push({
      category: 'social',
      text: `${context.members.length} team members are collaborating. Strong teamwork detected!`,
      icon: '🤝',
    });
  }

  // Progress insights (workspace only)
  if ('progress' in context && context.progress !== undefined) {
    if (context.progress > 75) {
      insights.push({
        category: 'planning',
        text: `Project is ${context.progress}% complete. Approaching final stages!`,
        icon: '🎯',
      });
    } else if (context.progress < 25) {
      insights.push({
        category: 'planning',
        text: `Project is ${context.progress}% complete. Early stages with plenty of time to refine.`,
        icon: '🚀',
      });
    }
  }

  // Default insight if none generated
  if (insights.length === 0) {
    insights.push({
      category: 'social',
      text: room
        ? `Room "${room.title}" is set up and ready for collaboration. Start chatting to generate more insights!`
        : `Workspace "${workspace.title}" is active. Keep the momentum going!`,
      icon: '✨',
    });
  }

  return insights;
};

// Extract tasks from chat messages using simple pattern matching
export const extractTasksFromMessages = (messages: any[]): any[] => {
  const tasks: any[] = [];
  const taskPatterns = [
    /(?:todo|task|need to|must|should):\s*(.+)/gi,
    /\[\s*\]\s*(.+)/g, // Markdown checkbox style
    /@(\w+)\s+(?:can you|please|could you)\s+(.+)/gi,
  ];

  messages.forEach((msg, idx) => {
    if (typeof msg.content !== 'string') return;

    taskPatterns.forEach(pattern => {
      const matches = msg.content.matchAll(pattern);
      for (const match of matches) {
        const taskText = match[1] || match[2];
        if (taskText && taskText.length > 5 && taskText.length < 100) {
          tasks.push({
            id: `extracted_${idx}_${tasks.length}`,
            title: taskText.trim(),
            owner: msg.sender === 'Rima' ? 'Rima' : (msg.sender as any)?.name || 'Unknown',
            completed: false,
            dueDate: 'Not set',
            source: 'chat',
          });
        }
      }
    });
  });

  return tasks;
};
