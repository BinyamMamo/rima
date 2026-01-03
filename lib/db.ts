import Database from 'better-sqlite3';
import path from 'path';
import { Workspace, Room, User, Profile, Message, Insight, Task } from '@/types';

const dbPath = path.join(process.cwd(), 'rima.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

export function initializeDatabase() {
  // Create tables
  db.exec(`
    -- Profiles table
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT NOT NULL
    );

    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      avatar_color TEXT NOT NULL,
      email TEXT,
      role TEXT,
      status TEXT,
      recent_activity TEXT,
      room_involvement INTEGER
    );

    -- Workspaces table
    CREATE TABLE IF NOT EXISTS workspaces (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      theme TEXT NOT NULL,
      profile_id TEXT NOT NULL,
      budget TEXT,
      deadline TEXT,
      phase TEXT,
      progress INTEGER,
      last_activity TEXT,
      parent_room_id TEXT,
      is_private INTEGER DEFAULT 0,
      FOREIGN KEY (profile_id) REFERENCES profiles(id)
    );

    -- Workspace members (many-to-many)
    CREATE TABLE IF NOT EXISTS workspace_members (
      workspace_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      PRIMARY KEY (workspace_id, user_id),
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    -- Workspace tags
    CREATE TABLE IF NOT EXISTS workspace_tags (
      workspace_id TEXT NOT NULL,
      tag TEXT NOT NULL,
      PRIMARY KEY (workspace_id, tag),
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
    );

    -- Rooms table
    CREATE TABLE IF NOT EXISTS rooms (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      is_private INTEGER DEFAULT 0,
      unread_count INTEGER DEFAULT 0,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
    );

    -- Room members (many-to-many)
    CREATE TABLE IF NOT EXISTS room_members (
      room_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      PRIMARY KEY (room_id, user_id),
      FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    -- Messages table (can belong to workspace or room)
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      workspace_id TEXT,
      room_id TEXT,
      sender_id TEXT,
      sender_type TEXT NOT NULL, -- 'user' or 'rima'
      content TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
      FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
      FOREIGN KEY (sender_id) REFERENCES users(id)
    );

    -- Insights table
    CREATE TABLE IF NOT EXISTS insights (
      id TEXT PRIMARY KEY,
      workspace_id TEXT,
      room_id TEXT,
      category TEXT NOT NULL,
      text TEXT NOT NULL,
      icon TEXT,
      type TEXT,
      content TEXT,
      timestamp TEXT,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
      FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
    );

    -- Tasks table
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      workspace_id TEXT,
      room_id TEXT,
      title TEXT NOT NULL,
      owner TEXT NOT NULL,
      assignee TEXT,
      completed INTEGER DEFAULT 0,
      due_date TEXT,
      deadline TEXT,
      progress INTEGER,
      status TEXT,
      priority TEXT,
      source TEXT,
      created_at TEXT,
      updated_at TEXT,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
      FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
    );

    -- Task room associations (many-to-many)
    CREATE TABLE IF NOT EXISTS task_rooms (
      task_id TEXT NOT NULL,
      room_id TEXT NOT NULL,
      PRIMARY KEY (task_id, room_id),
      FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
      FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
    );

    -- Task dependencies
    CREATE TABLE IF NOT EXISTS task_dependencies (
      task_id TEXT NOT NULL,
      depends_on_task_id TEXT NOT NULL,
      PRIMARY KEY (task_id, depends_on_task_id),
      FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
      FOREIGN KEY (depends_on_task_id) REFERENCES tasks(id) ON DELETE CASCADE
    );

    -- Spending table
    CREATE TABLE IF NOT EXISTS spending (
      id TEXT PRIMARY KEY,
      workspace_id TEXT,
      room_id TEXT,
      amount TEXT NOT NULL,
      category TEXT NOT NULL,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
      FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
    );

    -- Create indexes for performance
    CREATE INDEX IF NOT EXISTS idx_messages_workspace ON messages(workspace_id);
    CREATE INDEX IF NOT EXISTS idx_messages_room ON messages(room_id);
    CREATE INDEX IF NOT EXISTS idx_rooms_workspace ON rooms(workspace_id);
    CREATE INDEX IF NOT EXISTS idx_tasks_workspace ON tasks(workspace_id);
    CREATE INDEX IF NOT EXISTS idx_insights_workspace ON insights(workspace_id);
  `);
}

// Query functions
export function getAllProfiles(): Profile[] {
  const stmt = db.prepare('SELECT * FROM profiles');
  return stmt.all() as Profile[];
}

export function getAllUsers(): User[] {
  const stmt = db.prepare(`
    SELECT
      id, name, avatar_color as avatarColor, email, role,
      status, recent_activity as recentActivity, room_involvement as roomInvolvement
    FROM users
  `);
  return stmt.all() as User[];
}

export function getAllWorkspaces(): Workspace[] {
  const workspaces = db.prepare(`
    SELECT
      id, title, description, theme, profile_id as profileId,
      budget, deadline, phase, progress, last_activity as lastActivity,
      parent_room_id as parentRoomId, is_private as isPrivate
    FROM workspaces
  `).all() as Workspace[];

  return workspaces.map(workspace => ({
    ...workspace,
    members: getWorkspaceMembers(workspace.id),
    rooms: getRoomsByWorkspace(workspace.id),
    messages: getWorkspaceMessages(workspace.id),
    insights: getWorkspaceInsights(workspace.id),
    tasks: getWorkspaceTasks(workspace.id),
    spending: getWorkspaceSpending(workspace.id),
    tags: getWorkspaceTags(workspace.id),
  }));
}

export function getWorkspaceById(id: string): Workspace | null {
  const workspace = db.prepare(`
    SELECT
      id, title, description, theme, profile_id as profileId,
      budget, deadline, phase, progress, last_activity as lastActivity,
      parent_room_id as parentRoomId, is_private as isPrivate
    FROM workspaces WHERE id = ?
  `).get(id) as Workspace | undefined;

  if (!workspace) return null;

  return {
    ...workspace,
    members: getWorkspaceMembers(workspace.id),
    rooms: getRoomsByWorkspace(workspace.id),
    messages: getWorkspaceMessages(workspace.id),
    insights: getWorkspaceInsights(workspace.id),
    tasks: getWorkspaceTasks(workspace.id),
    spending: getWorkspaceSpending(workspace.id),
    tags: getWorkspaceTags(workspace.id),
  };
}

export function getWorkspaceMembers(workspaceId: string): User[] {
  const stmt = db.prepare(`
    SELECT u.id, u.name, u.avatar_color as avatarColor, u.email, u.role,
           u.status, u.recent_activity as recentActivity, u.room_involvement as roomInvolvement
    FROM users u
    INNER JOIN workspace_members wm ON u.id = wm.user_id
    WHERE wm.workspace_id = ?
  `);
  return stmt.all(workspaceId) as User[];
}

export function getWorkspaceTags(workspaceId: string): string[] {
  const stmt = db.prepare('SELECT tag FROM workspace_tags WHERE workspace_id = ?');
  return stmt.all(workspaceId).map((row: any) => row.tag);
}

export function getRoomsByWorkspace(workspaceId: string): Room[] {
  const rooms = db.prepare(`
    SELECT id, workspace_id as workspaceId, title, description,
           is_private as isPrivate, unread_count as unreadCount
    FROM rooms WHERE workspace_id = ?
  `).all(workspaceId) as Room[];

  return rooms.map(room => ({
    ...room,
    members: getRoomMembers(room.id),
    messages: getRoomMessages(room.id),
    insights: getRoomInsights(room.id),
    tasks: getRoomTasks(room.id),
    spending: getRoomSpending(room.id),
  }));
}

export function getRoomById(roomId: string): Room | null {
  const room = db.prepare(`
    SELECT id, workspace_id as workspaceId, title, description,
           is_private as isPrivate, unread_count as unreadCount
    FROM rooms WHERE id = ?
  `).get(roomId) as Room | undefined;

  if (!room) return null;

  return {
    ...room,
    members: getRoomMembers(room.id),
    messages: getRoomMessages(room.id),
    insights: getRoomInsights(room.id),
    tasks: getRoomTasks(room.id),
    spending: getRoomSpending(room.id),
  };
}

export function getRoomMembers(roomId: string): User[] {
  const stmt = db.prepare(`
    SELECT u.id, u.name, u.avatar_color as avatarColor, u.email, u.role,
           u.status, u.recent_activity as recentActivity, u.room_involvement as roomInvolvement
    FROM users u
    INNER JOIN room_members rm ON u.id = rm.user_id
    WHERE rm.room_id = ?
  `);
  return stmt.all(roomId) as User[];
}

export function getWorkspaceMessages(workspaceId: string): Message[] {
  const messages = db.prepare(`
    SELECT id, sender_id as senderId, sender_type as senderType, content, timestamp
    FROM messages WHERE workspace_id = ? AND room_id IS NULL
    ORDER BY timestamp ASC
  `).all(workspaceId) as any[];

  const users = getAllUsers();
  return messages.map(msg => ({
    id: msg.id,
    sender: msg.senderType === 'rima' ? 'Rima' : users.find(u => u.id === msg.senderId)!,
    content: msg.content,
    timestamp: msg.timestamp,
  })) as Message[];
}

export function getRoomMessages(roomId: string): Message[] {
  const messages = db.prepare(`
    SELECT id, sender_id as senderId, sender_type as senderType, content, timestamp
    FROM messages WHERE room_id = ?
    ORDER BY timestamp ASC
  `).all(roomId) as any[];

  const users = getAllUsers();
  return messages.map(msg => ({
    id: msg.id,
    sender: msg.senderType === 'rima' ? 'Rima' : users.find(u => u.id === msg.senderId)!,
    content: msg.content,
    timestamp: msg.timestamp,
  })) as Message[];
}

export function getWorkspaceInsights(workspaceId: string): Insight[] {
  return db.prepare(`
    SELECT id, category, text, icon, type, content, timestamp
    FROM insights WHERE workspace_id = ? AND room_id IS NULL
  `).all(workspaceId) as Insight[];
}

export function getRoomInsights(roomId: string): Insight[] {
  return db.prepare(`
    SELECT id, category, text, icon, type, content, timestamp
    FROM insights WHERE room_id = ?
  `).all(roomId) as Insight[];
}

export function getWorkspaceTasks(workspaceId: string): Task[] {
  return db.prepare(`
    SELECT id, title, owner, assignee, completed, due_date as dueDate,
           deadline, progress, status, priority, source, created_at as createdAt,
           updated_at as updatedAt
    FROM tasks WHERE workspace_id = ? AND room_id IS NULL
  `).all(workspaceId) as Task[];
}

export function getRoomTasks(roomId: string): Task[] {
  return db.prepare(`
    SELECT id, title, owner, assignee, completed, due_date as dueDate,
           deadline, progress, status, priority, source, created_at as createdAt,
           updated_at as updatedAt
    FROM tasks WHERE room_id = ?
  `).all(roomId) as Task[];
}

export function getWorkspaceSpending(workspaceId: string): { amount: string; category: string }[] {
  return db.prepare(`
    SELECT amount, category FROM spending WHERE workspace_id = ? AND room_id IS NULL
  `).all(workspaceId) as { amount: string; category: string }[];
}

export function getRoomSpending(roomId: string): { amount: string; category: string }[] {
  return db.prepare(`
    SELECT amount, category FROM spending WHERE room_id = ?
  `).all(roomId) as { amount: string; category: string }[];
}

// Mutation functions
export function addMessage(message: {
  workspaceId?: string;
  roomId?: string;
  senderId?: string;
  senderType: 'user' | 'rima';
  content: string;
  timestamp: string;
}): Message {
  const id = `m_${Date.now()}_${Math.random()}`;

  db.prepare(`
    INSERT INTO messages (id, workspace_id, room_id, sender_id, sender_type, content, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    message.workspaceId || null,
    message.roomId || null,
    message.senderId || null,
    message.senderType,
    message.content,
    message.timestamp
  );

  const users = getAllUsers();
  return {
    id,
    sender: message.senderType === 'rima' ? 'Rima' : users.find(u => u.id === message.senderId)!,
    content: message.content,
    timestamp: message.timestamp,
  };
}

export function updateRoom(roomId: string, updates: Partial<Room>) {
  const fields = [];
  const values = [];

  if (updates.title !== undefined) {
    fields.push('title = ?');
    values.push(updates.title);
  }
  if (updates.description !== undefined) {
    fields.push('description = ?');
    values.push(updates.description);
  }
  if (updates.unreadCount !== undefined) {
    fields.push('unread_count = ?');
    values.push(updates.unreadCount);
  }

  if (fields.length === 0) return;

  values.push(roomId);
  db.prepare(`UPDATE rooms SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function updateWorkspace(workspaceId: string, updates: Partial<Workspace>) {
  const fields = [];
  const values = [];

  if (updates.title !== undefined) {
    fields.push('title = ?');
    values.push(updates.title);
  }
  if (updates.description !== undefined) {
    fields.push('description = ?');
    values.push(updates.description);
  }
  if (updates.progress !== undefined) {
    fields.push('progress = ?');
    values.push(updates.progress);
  }

  if (fields.length === 0) return;

  values.push(workspaceId);
  db.prepare(`UPDATE workspaces SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteRoom(workspaceId: string, roomId: string) {
  db.prepare('DELETE FROM rooms WHERE id = ? AND workspace_id = ?').run(roomId, workspaceId);
}

export function deleteWorkspace(workspaceId: string) {
  db.prepare('DELETE FROM workspaces WHERE id = ?').run(workspaceId);
}

export { db };
