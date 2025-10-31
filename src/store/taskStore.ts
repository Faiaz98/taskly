import { create } from 'zustand';
import { Category } from '../types/task';

interface TaskStore {
  categories: Category[];
  selectedCategory: string | null;
  setSelectedCategory: (categoryId: string | null) => void;
}

// Mock data for categories (kept in Zustand as it's static)
const mockCategories: Category[] = [
  { id: 'groceries', name: 'Groceries', icon: 'ShoppingCart', color: '#10B981' },
  { id: 'chores', name: 'Chores', icon: 'Sparkles', color: '#8B5CF6' },
  { id: 'errands', name: 'Errands', icon: 'Car', color: '#F59E0B' },
  { id: 'personal', name: 'Personal', icon: 'User', color: '#EC4899' },
];

// Tasks are now managed by AirState's SharedState instead of Zustand
export const useTaskStore = create<TaskStore>((set) => ({
  categories: mockCategories,
  selectedCategory: null,
  setSelectedCategory: (categoryId) => set({ selectedCategory: categoryId }),
}));
