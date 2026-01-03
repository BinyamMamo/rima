
export type ThemeColor = 'gold' | 'rust' | 'obsidian' | 'teal' | 'emerald' | 'indigo' | 'rose' | 'sky' | 'violet' | 'slate';

export type UserRole = 'Admin' | 'Collaborator' | 'Viewer';

export interface User {
  id: string;
  name: string;
  avatarColor: string;
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
  completed: boolean;
  dueDate: string;
}

export interface Channel {
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

export interface Project {
  id: string;
  title: string;
  description: string;
  theme: ThemeColor;
  channels: Channel[];
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
}

export interface Profile {
  id: string;
  name: string;
  icon: string;
}

export type ViewType = {
  type: 'welcome' | 'login' | 'signup' | 'home' | 'project' | 'channel' | 'settings' | 'new_workspace' | 'new_channel' | 'people' | 'invite_people' | 'initialize_note';
  mode?: 'chat' | 'dashboard';
  projectId?: string;
  channelId?: string;
};
