import { Task, Message, User } from '@/types';
import { extractDeadlineFromMessage } from './dateParser';

/**
 * Enhanced task extraction from messages
 * Extracts tasks with metadata: assignee, deadline, progress, status
 */

export function extractTasksFrom Messages(
  messages: Message[],
  workspaceId: string,
  roomId?: string
): Task[] {
  const tasks: Task[] = [];

  // Task patterns
  const taskPatterns = [
    /(?:todo|task|need to|must|should|action item)[:\s]+(.+)/gi,
    /\[\s*\]\s*(.+)/g, // Markdown checkbox style
    /@(\w+)\s+(?:can you|please|could you|needs? to)\s+(.+)/gi,
    /^[-*]\s+(.+)/gm, // Bullet points
  ];

  messages.forEach((msg, idx) => {
    if (typeof msg.content !== 'string') return;

    taskPatterns.forEach(pattern => {
      const matches = msg.content.matchAll(pattern);

      for (const match of matches) {
        const taskText = match[match.length - 1] || match[1];
        if (!taskText || taskText.length < 5 || taskText.length > 150) continue;

        // Extract assignee
        const assignee = extractAssignee(msg.content, msg.sender);

        // Extract deadline
        const deadlineInfo = extractDeadlineFromMessage(msg.content);

        // Extract progress
        const progress = extractProgress(msg.content);

        // Extract status
        const status = extractStatus(msg.content);

        // Extract priority (for future use)
        const priority = extractPriority(msg.content);

        const task: Task = {
          id: `extracted_${workspaceId}_${idx}_${tasks.length}`,
          title: cleanTaskTitle(taskText),
          owner: msg.sender === 'Rima' ? 'Rima' : (msg.sender as User)?.name || 'Unknown',
          assignee,
          completed: status === 'completed',
          dueDate: deadlineInfo?.date || 'Not set',
          deadline: deadlineInfo?.original,
          progress,
          status: status || (progress && progress > 0 ? 'in_progress' : 'pending'),
          priority,
          source: 'chat',
          roomIds: roomId ? [roomId] : [],
          workspaceId,
          extractedFrom: {
            messageId: msg.id,
            timestamp: msg.timestamp,
            confidence: calculateConfidence(taskText, msg.content),
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        tasks.push(task);
      }
    });
  });

  return tasks;
}

/**
 * Extract assignee from message content
 */
function extractAssignee(content: string, sender: User | 'Rima'): string | undefined {
  const lowerContent = content.toLowerCase();

  // Pattern: @username will/should/can do
  const mentionPattern = /@(\w+)\s+(?:will|should|can|needs? to)/i;
  const mentionMatch = content.match(mentionPattern);
  if (mentionMatch) {
    return mentionMatch[1];
  }

  // Pattern: assigned to @username
  const assignedPattern = /assigned to @(\w+)/i;
  const assignedMatch = content.match(assignedPattern);
  if (assignedMatch) {
    return assignedMatch[1];
  }

  // Pattern: username, you handle/do
  const youPattern = /(\w+),\s+you\s+(?:handle|do|take care of)/i;
  const youMatch = content.match(youPattern);
  if (youMatch) {
    return youMatch[1];
  }

  // Default to sender if it's a user (not Rima)
  if (sender !== 'Rima') {
    return (sender as User).name;
  }

  return undefined;
}

/**
 * Extract progress percentage from message
 */
function extractProgress(content: string): number | undefined {
  const lowerContent = content.toLowerCase();

  // Explicit percentage: 50% done, 80% complete
  const percentMatch = content.match(/(\d+)%\s*(?:done|complete|finished)/i);
  if (percentMatch) {
    return Math.min(100, Math.max(0, parseInt(percentMatch[1], 10)));
  }

  // Text indicators
  if (lowerContent.includes('halfway') || lowerContent.includes('half done')) return 50;
  if (lowerContent.includes('almost done') || lowerContent.includes('nearly finished')) return 90;
  if (lowerContent.includes('just started') || lowerContent.includes('barely started')) return 10;
  if (lowerContent.includes('in progress') || lowerContent.includes('working on')) return 50;

  return undefined;
}

/**
 * Extract status from message
 */
function extractStatus(content: string): Task['status'] | undefined {
  const lowerContent = content.toLowerCase();

  // Completed
  if (
    lowerContent.includes('done') ||
    lowerContent.includes('completed') ||
    lowerContent.includes('finished') ||
    content.includes('✓') ||
    content.includes('✅')
  ) {
    return 'completed';
  }

  // Blocked
  if (
    lowerContent.includes('blocked') ||
    lowerContent.includes('waiting for') ||
    lowerContent.includes('stuck') ||
    lowerContent.includes('blocker')
  ) {
    return 'blocked';
  }

  // In progress
  if (
    lowerContent.includes('working on') ||
    lowerContent.includes('in progress') ||
    lowerContent.includes('started')
  ) {
    return 'in_progress';
  }

  return undefined;
}

/**
 * Extract priority from message
 */
function extractPriority(content: string): Task['priority'] | undefined {
  const lowerContent = content.toLowerCase();

  if (
    lowerContent.includes('urgent') ||
    lowerContent.includes('asap') ||
    lowerContent.includes('critical') ||
    lowerContent.includes('high priority') ||
    lowerContent.includes('blocker')
  ) {
    return 'high';
  }

  if (
    lowerContent.includes('important') ||
    lowerContent.includes('should')
  ) {
    return 'medium';
  }

  if (
    lowerContent.includes('nice to have') ||
    lowerContent.includes('when possible') ||
    lowerContent.includes('low priority')
  ) {
    return 'low';
  }

  return undefined;
}

/**
 * Clean task title by removing common prefixes and suffixes
 */
function cleanTaskTitle(title: string): string {
  let cleaned = title.trim();

  // Remove common prefixes
  cleaned = cleaned.replace(/^(todo|task|action item)[:\s]+/i, '');
  cleaned = cleaned.replace(/^[-*]\s+/, '');
  cleaned = cleaned.replace(/^\[\s*\]\s*/, '');

  // Remove trailing punctuation except question marks
  cleaned = cleaned.replace(/[.,;]+$/, '');

  // Remove @mentions from title (keep in assignee instead)
  cleaned = cleaned.replace(/@\w+\s*/g, '');

  // Remove deadline phrases from title
  cleaned = cleaned.replace(/\s+(by|before|due|deadline)[:\s]+.+$/i, '');

  return cleaned.trim();
}

/**
 * Calculate confidence score for task extraction
 */
function calculateConfidence(taskText: string, fullContent: string): number {
  let confidence = 0.5; // Base confidence

  // Increase if explicit task keywords present
  if (/\b(todo|task|action item|must|should)\b/i.test(fullContent)) {
    confidence += 0.2;
  }

  // Increase if has assignee
  if (/@\w+/.test(fullContent)) {
    confidence += 0.1;
  }

  // Increase if has deadline
  if (/\b(by|before|due|deadline)\b/i.test(fullContent)) {
    confidence += 0.1;
  }

  // Decrease if very short or very long
  if (taskText.length < 10) {
    confidence -= 0.2;
  } else if (taskText.length > 100) {
    confidence -= 0.1;
  }

  return Math.min(1, Math.max(0, confidence));
}
