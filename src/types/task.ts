export type TaskStatus = 'idle' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  category: string;
  createdAt: number;
  updatedAt: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface User {
  id: string;
  name: string;
  color: string;
  isActive: boolean;
}

export interface PresenceState {
  userId: string;
  userName: string;
  taskId?: string;
  action?: 'viewing' | 'editing' | 'updating';
  lastSeen: number;
}
