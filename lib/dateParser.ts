/**
 * Utility to parse natural language dates from messages
 * Examples: "next Friday", "end of week", "tomorrow", "by Jan 15"
 */

export function parseNaturalDate(text: string): { date: string; original: string } | null {
  const today = new Date();
  const lowerText = text.toLowerCase();

  // Common date patterns
  const patterns = [
    // Relative days
    { regex: /\b(tomorrow|tmrw)\b/, offset: 1 },
    { regex: /\b(today)\b/, offset: 0 },
    { regex: /\b(yesterday)\b/, offset: -1 },

    // This/next week
    { regex: /\b(this|next)\s+(monday|mon)\b/, dayOfWeek: 1 },
    { regex: /\b(this|next)\s+(tuesday|tue|tues)\b/, dayOfWeek: 2 },
    { regex: /\b(this|next)\s+(wednesday|wed)\b/, dayOfWeek: 3 },
    { regex: /\b(this|next)\s+(thursday|thu|thur|thurs)\b/, dayOfWeek: 4 },
    { regex: /\b(this|next)\s+(friday|fri)\b/, dayOfWeek: 5 },
    { regex: /\b(this|next)\s+(saturday|sat)\b/, dayOfWeek: 6 },
    { regex: /\b(this|next)\s+(sunday|sun)\b/, dayOfWeek: 0 },

    // End of periods
    { regex: /\bend of (this )?week\b/, offset: getDaysUntilEndOfWeek(today) },
    { regex: /\bend of (this )?month\b/, offset: getDaysUntilEndOfMonth(today) },

    // In X days
    { regex: /\bin (\d+) days?\b/, extractDays: true },
  ];

  for (const pattern of patterns) {
    const match = lowerText.match(pattern.regex);
    if (match) {
      let targetDate: Date;

      if ('offset' in pattern && typeof pattern.offset === 'number') {
        targetDate = new Date(today);
        targetDate.setDate(today.getDate() + pattern.offset);
      } else if ('dayOfWeek' in pattern && pattern.dayOfWeek !== undefined) {
        const isNext = match[1] === 'next';
        targetDate = getNextDayOfWeek(today, pattern.dayOfWeek, isNext);
      } else if ('extractDays' in pattern) {
        const days = parseInt(match[1], 10);
        targetDate = new Date(today);
        targetDate.setDate(today.getDate() + days);
      } else {
        continue;
      }

      return {
        date: targetDate.toISOString().split('T')[0],
        original: match[0]
      };
    }
  }

  // Try to extract explicit dates (Jan 15, 2026-01-15, etc.)
  const explicitDateMatch = lowerText.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
  if (explicitDateMatch) {
    return {
      date: explicitDateMatch[0],
      original: explicitDateMatch[0]
    };
  }

  // Month day pattern (Jan 15, January 15th)
  const monthDayMatch = lowerText.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{1,2})(st|nd|rd|th)?\b/);
  if (monthDayMatch) {
    const monthMap: Record<string, number> = {
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
      jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
    };
    const month = monthMap[monthDayMatch[1]];
    const day = parseInt(monthDayMatch[2], 10);
    const year = today.getFullYear();

    const targetDate = new Date(year, month, day);
    // If date is in the past, assume next year
    if (targetDate < today) {
      targetDate.setFullYear(year + 1);
    }

    return {
      date: targetDate.toISOString().split('T')[0],
      original: monthDayMatch[0]
    };
  }

  return null;
}

/**
 * Extract deadline text from message
 */
export function extractDeadlineFromMessage(message: string): { date: string; original: string } | null {
  const lowerMessage = message.toLowerCase();

  // Look for deadline keywords
  const deadlinePatterns = [
    /\b(by|before|due|deadline)[:\s]+([^\n,.]+)/,
    /\bdue date[:\s]+([^\n,.]+)/,
  ];

  for (const pattern of deadlinePatterns) {
    const match = lowerMessage.match(pattern);
    if (match) {
      const deadlineText = match[match.length - 1].trim();
      return parseNaturalDate(deadlineText);
    }
  }

  // Fallback: just look for date-like text
  return parseNaturalDate(message);
}

// Helper functions
function getNextDayOfWeek(from: Date, targetDay: number, forceNext: boolean = false): Date {
  const result = new Date(from);
  const currentDay = from.getDay();
  let daysToAdd = targetDay - currentDay;

  if (daysToAdd < 0 || (daysToAdd === 0 && forceNext)) {
    daysToAdd += 7;
  }

  result.setDate(from.getDate() + daysToAdd);
  return result;
}

function getDaysUntilEndOfWeek(from: Date): number {
  const currentDay = from.getDay();
  return 6 - currentDay; // Sunday is 0, Saturday is 6
}

function getDaysUntilEndOfMonth(from: Date): number {
  const lastDay = new Date(from.getFullYear(), from.getMonth() + 1, 0).getDate();
  return lastDay - from.getDate();
}
