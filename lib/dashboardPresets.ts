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
    icon: 'CurrencyCircleDollar',
    isRelevant: (workspace) => !!workspace.budget,
    renderData: (workspace) => ({
      value: workspace.budget,
      label: 'Total Budget',
    }),
  },
  {
    id: 'deadline',
    title: 'Deadline',
    icon: 'Calendar',
    isRelevant: (workspace) => !!workspace.deadline,
    renderData: (workspace) => ({
      value: workspace.deadline,
      label: 'Project Deadline',
    }),
  },
  {
    id: 'team',
    title: 'Team',
    icon: 'UsersThree',
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
    icon: 'CheckSquare',
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
    icon: 'TrendUp',
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
    icon: 'Receipt',
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
  await new Promise(resolve => setTimeout(resolve, 800));

  const insights: Insight[] = [];
  const context = room || workspace;

  // 1. Analyze Messages in Context
  const allMessages = room ? room.messages : [
    ...workspace.messages,
    ...workspace.rooms.flatMap(r => r.messages)
  ];

  if (allMessages && allMessages.length > 0) {
    // Filter for recent messages (last 30 for better analysis)
    const recentMessages = allMessages.slice(-30);

    // Pattern: Questions
    const questions = recentMessages.filter(m => typeof m.content === 'string' && m.content.includes('?'));
    if (questions.length >= 3) {
      insights.push({
        category: 'social',
        text: `${questions.length} open questions detected. Latest: "${questions[questions.length - 1].content.slice(0, 45)}..."`,
        icon: 'Question',
      });
    }

    // Pattern: Urgency
    const urgentKeywords = ['urgent', 'asap', 'deadline', 'blocker', 'stuck', 'delay', 'critical', 'priority'];
    const urgentMessages = recentMessages.filter(m =>
      typeof m.content === 'string' && urgentKeywords.some(kw => m.content.toLowerCase().includes(kw))
    );
    if (urgentMessages.length > 0) {
      insights.push({
        category: 'risk',
        text: `${urgentMessages.length} urgent message(s) detected: "${urgentMessages[urgentMessages.length - 1].content.slice(0, 50)}..."`,
        icon: 'Warning'
      });
    }

    // Pattern: Completed tasks/actions
    const completionKeywords = ['done', 'completed', 'finished', '✓', '✅', 'shipped'];
    const completedMessages = recentMessages.filter(m =>
      typeof m.content === 'string' && completionKeywords.some(kw => m.content.toLowerCase().includes(kw))
    );
    if (completedMessages.length >= 3) {
      insights.push({
        category: 'planning',
        text: `${completedMessages.length} tasks marked as completed recently. Team is making progress!`,
        icon: 'CheckSquare'
      });
    }

    // Pattern: Mentions & Engagement
    const mentionPattern = /@\w+/g;
    const messagesWithMentions = recentMessages.filter(m =>
      typeof m.content === 'string' && m.content.match(mentionPattern)
    );
    if (messagesWithMentions.length >= 5) {
      insights.push({
        category: 'social',
        text: `High collaboration: ${messagesWithMentions.length} messages with @mentions in recent activity`,
        icon: 'UsersThree'
      });
    }

    // Pattern: Decision points
    const decisionKeywords = ['decide', 'decision', 'choose', 'option', 'should we', 'vote', 'agree'];
    const decisionMessages = recentMessages.filter(m =>
      typeof m.content === 'string' && decisionKeywords.some(kw => m.content.toLowerCase().includes(kw))
    );
    if (decisionMessages.length >= 2) {
      insights.push({
        category: 'planning',
        text: `${decisionMessages.length} pending decision point(s) in recent discussions`,
        icon: 'ChatCircleDots'
      });
    }

    // Pattern: Blockers
    const blockerKeywords = ['blocked', 'waiting for', 'can\'t proceed', 'stuck', 'pending', 'blocker'];
    const blockerMessages = recentMessages.filter(m =>
      typeof m.content === 'string' && blockerKeywords.some(kw => m.content.toLowerCase().includes(kw))
    );
    if (blockerMessages.length >= 2) {
      insights.push({
        category: 'risk',
        text: `${blockerMessages.length} message(s) indicate blocked work. Review dependencies.`,
        icon: 'WarningCircle'
      });
    }

    // Pattern: Activity level
    if (recentMessages.length < 5 && allMessages.length > 10) {
      insights.push({
        category: 'social',
        text: `Low activity detected. Only ${recentMessages.length} messages in recent period.`,
        icon: 'Clock'
      });
    } else if (recentMessages.length > 20) {
      insights.push({
        category: 'social',
        text: `High activity: ${recentMessages.length} messages recently. Team is engaged!`,
        icon: 'TrendUp'
      });
    }
  }

  // 2. Analyze Tasks
  if (context.tasks && context.tasks.length > 0) {
    const overdueTasks = context.tasks.filter(t => !t.completed && (t.dueDate.toLowerCase().includes('overdue') || t.dueDate.toLowerCase().includes('yesterday')));
    // Simple check for "today" or "tomorrow"
    const urgentTasks = context.tasks.filter(t => !t.completed && (t.dueDate.toLowerCase().includes('today') || t.dueDate.toLowerCase().includes('tomorrow')));

    if (overdueTasks.length > 0) {
      insights.push({
        category: 'risk',
        text: `${overdueTasks.length} task(s) are OVERDUE. Priority attention needed.`,
        icon: 'WarningCircle',
      });
    }

    if (urgentTasks.length > 0) {
      insights.push({
        category: 'planning',
        text: `${urgentTasks.length} task(s) are due soon.`,
        icon: 'Clock'
      });
    }
  }

  // 3. Analyze Budget (Workspace Only)
  if ('budget' in context && context.budget && context.spending) {
    // Parse budget string (e.g. "$50,000")
    const budgetAmount = parseFloat(context.budget.replace(/[^0-9.-]+/g, ''));
    const totalSpending = context.spending.reduce((sum, s) => {
      const amount = parseFloat(s.amount.replace(/[^0-9.-]+/g, ''));
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    if (budgetAmount > 0) {
      const percentageUsed = (totalSpending / budgetAmount) * 100;
      if (percentageUsed > 90) {
        insights.push({
          category: 'finance',
          text: `CRITICAL: Budget utilization at ${percentageUsed.toFixed(0)}%. ${context.budget} limit approaching.`,
          icon: 'XCircle',
        });
      } else if (percentageUsed > 75) {
        insights.push({
          category: 'finance',
          text: `Budget utilization is high (${percentageUsed.toFixed(0)}%). Review expenses.`,
          icon: 'TrendUp',
        });
      }
    }
  }

  // 4. Activity & Progress
  if (!room && 'progress' in context && (context.progress || 0) < 100) {
    // If progress is low but lots of messages = High Friction?
    if ((context.progress || 0) < 30 && allMessages.length > 20) {
      insights.push({
        category: 'planning',
        text: `High discussion volume but low reported progress (${context.progress}%). Is the team blocked?`,
        icon: 'ChatCircleDots'
      });
    }
  }

  // Default Fallback
  if (insights.length === 0) {
    insights.push({
      category: 'social',
      text: room
        ? `Room "${room.title}" is quiet. Start a conversation to generate insights!`
        : `Workspace "${workspace.title}" is on track. No critical anomalies detected.`,
      icon: 'Sparkle',
    });
  }

  return insights;
};

// Extract tasks from chat messages using simple pattern matching
// Extract tasks from chat messages using improved pattern matching
export const extractTasksFromMessages = (messages: any[]): any[] => {
  const tasks: any[] = [];

  // 1. Explicit Assignment: "@User please do X by Y" or "@User1, @User2 ..."
  // 2. Simple Todo: "Todo: X"
  // 3. Status updates (optional linkage, currently just extraction)

  const patterns = [
    // Pattern: Assignment with Deadline (e.g., "@Maryam please book flights due Friday")
    // Supports: @User1 ... or @User1, @User2 ...
    {
      regex: /((?:@\w+(?:,?\s*)?)+)\s+(?:please|can you|need to)\s+(.+?)\s+(?:due|by)\s+([a-zA-Z0-9\s/]+)(?:$|[.!])/i,
      handler: (match: RegExpMatchArray, msg: any) => {
        const ownersBlock = match[1];
        const assignees = ownersBlock.match(/@(\w+)/g)?.map(m => m.substring(1)) || [];
        // Only unique
        const uniqueAssignees = Array.from(new Set(assignees));

        return {
          title: match[2].trim(),
          assignee: uniqueAssignees.length > 1 ? uniqueAssignees : uniqueAssignees[0],
          dueDate: match[3].trim(),
          source: 'assignment'
        };
      }
    },
    // Pattern: Explicit Task Definition
    {
      regex: /(?:Task|Todo):\s*(.+?)(?:$|\n)/i,
      handler: (match: RegExpMatchArray, msg: any) => ({
        title: match[1].trim(),
        assignee: 'Unassigned',
        dueDate: 'Not set',
        source: 'todo'
      })
    },
    // Pattern: Progress Update
    {
      regex: /(\d+)%\s+(?:done|complete|finished)/i,
      handler: (match: RegExpMatchArray, msg: any) => ({
        title: `Progress Update: ${match[0]}`,
        assignee: msg.sender === 'Rima' ? 'Rima' : (msg.sender as any)?.name || 'Unknown',
        progress: parseInt(match[1]),
        dueDate: 'Ongoing',
        source: 'progress'
      })
    }
  ];

  messages.forEach((msg, idx) => {
    if (typeof msg.content !== 'string') return;

    patterns.forEach(pattern => {
      const match = msg.content.match(pattern.regex);
      if (match) {
        const extracted = pattern.handler(match, msg);

        // Prevent duplicates or very short matches
        if (extracted.title.length > 3) {
          tasks.push({
            id: `extracted_${idx}_${tasks.length}`,
            ...extracted,
            owner: msg.sender === 'Rima' ? 'Rima' : (msg.sender as any)?.name || 'Unknown', // The person who POSTED the task/update
            completed: false, // Default
            originalMessageId: msg.id
          });
        }
      }
    });
  });

  return tasks;
};
