
export type ThemeColor = 'gold' | 'rust' | 'obsidian' | 'teal' | 'emerald' | 'indigo' | 'rose' | 'sky' | 'violet' | 'slate';

export type UserRole = 'Admin' | 'Collaborator' | 'Viewer';

export interface User {
  id: string;
  name: string;
  avatarColor: string;
  email?: string;
  role?: string;
  status?: 'active' | 'away' | 'offline';
  recentActivity?: string;
  roomInvolvement?: number;
}

export interface Message {
  id: string;
  sender: User | 'Rima';
  content: string;
  timestamp: string;
}

export interface Insight {
  category: 'finance' | 'planning' | 'risk' | 'social';
  text: string;
  icon: string;
}

export interface Task {
  id: string;
  title: string;
  owner: string;
  assignee?: string;  // Who's assigned (can differ from owner)
  completed: boolean;
  dueDate: string;  // ISO date string or "Not set"
  deadline?: string;  // Original extracted text like "next Friday"
  progress?: number;  // 0-100 percentage
  status?: 'pending' | 'in_progress' | 'completed' | 'blocked';
  priority?: 'low' | 'medium' | 'high';
  source?: 'chat' | 'manual';  // Where it came from
  roomIds?: string[];  // Which rooms mention this task (for deduplication)
  workspaceId?: string;  // Which workspace owns this task
  extractedFrom?: {  // Metadata about extraction
    messageId: string;
    timestamp: string;
    confidence?: number;
  };
  dependencies?: string[];  // IDs of tasks this depends on
  createdAt?: string;  // ISO timestamp
  updatedAt?: string;  // ISO timestamp
}

export interface Room {
  id: string;
  title: string;
  members: User[];
  unreadCount?: number;
  messages: Message[];
  isPrivate?: boolean;
  description?: string;
  insights?: Insight[];
  tasks?: Task[];
  spending?: { amount: string; category: string }[];
}

export interface Workspace {
  id: string;
  title: string;
  description: string;
  theme: ThemeColor;
  rooms: Room[];
  members: User[];
  messages: Message[];
  profileId: string;
  budget?: string;
  deadline?: string;
  phase?: string;
  progress?: number;
  lastActivity?: string;
  parentRoomId?: string | null;
  tags?: string[];
  insights?: Insight[];
  tasks?: Task[];
  spending?: { amount: string; category: string }[];
  isPrivate?: boolean;
}

export interface Profile {
  id: string;
  name: string;
  icon: string;
}

export type ViewType = {
  type: 'welcome' | 'login' | 'signup' | 'home' | 'workspace' | 'room' | 'settings' | 'new_workspace' | 'new_room' | 'people' | 'invite_people' | 'initialize_note';
  mode?: 'chat' | 'dashboard';
  workspaceId?: string;
  roomId?: string;
};
