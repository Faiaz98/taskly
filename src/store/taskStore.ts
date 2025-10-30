import { create } from 'zustand';
import { Task, Category } from '../types/task';

interface TaskStore {
  tasks: Task[];
  categories: Category[];
  selectedCategory: string | null;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setSelectedCategory: (categoryId: string | null) => void;
}

// Mock data for initial landing
const mockCategories: Category[] = [
  { id: 'groceries', name: 'Groceries', icon: 'ShoppingCart', color: '#10B981' },
  { id: 'chores', name: 'Chores', icon: 'Sparkles', color: '#8B5CF6' },
  { id: 'errands', name: 'Errands', icon: 'Car', color: '#F59E0B' },
  { id: 'personal', name: 'Personal', icon: 'User', color: '#EC4899' },
];

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Buy milk and eggs',
    status: 'idle',
    category: 'groceries',
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 3600000,
  },
  {
    id: '2',
    title: 'Clean the kitchen',
    status: 'in-progress',
    category: 'chores',
    createdAt: Date.now() - 7200000,
    updatedAt: Date.now() - 1800000,
  },
  {
    id: '3',
    title: 'Pick up dry cleaning',
    status: 'done',
    category: 'errands',
    createdAt: Date.now() - 10800000,
    updatedAt: Date.now() - 900000,
  },
  {
    id: '4',
    title: 'Vacuum living room',
    status: 'idle',
    category: 'chores',
    createdAt: Date.now() - 14400000,
    updatedAt: Date.now() - 14400000,
  },
];

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: mockTasks,
  categories: mockCategories,
  selectedCategory: null,
  
  addTask: (taskData) => set((state) => ({
    tasks: [
      ...state.tasks,
      {
        ...taskData,
        id: Date.now().toString(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ],
  })),
  
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map((task) =>
      task.id === id
        ? { ...task, ...updates, updatedAt: Date.now() }
        : task
    ),
  })),
  
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((task) => task.id !== id),
  })),
  
  setSelectedCategory: (categoryId) => set({ selectedCategory: categoryId }),
}));
