import { useState } from 'react';
import { Category } from '../types/task';
import { useTaskStore } from '../store/taskStore';
import { TaskCard } from './TaskCard';
import { Plus, ShoppingCart, Sparkles, Car, User } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface CategorySectionProps {
  category: Category;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  ShoppingCart,
  Sparkles,
  Car,
  User,
};

export function CategorySection({ category }: CategorySectionProps) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const tasks = useTaskStore((state) =>
    state.tasks.filter((task) => task.category === category.id)
  );
  const addTask = useTaskStore((state) => state.addTask);

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask({
        title: newTaskTitle.trim(),
        status: 'idle',
        category: category.id,
      });
      setNewTaskTitle('');
      setIsAddingTask(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    } else if (e.key === 'Escape') {
      setNewTaskTitle('');
      setIsAddingTask(false);
    }
  };

  const IconComponent = iconMap[category.icon] || User;

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div 
          className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm"
          style={{ backgroundColor: category.color + '15' }}
        >
          <IconComponent 
            className="w-5 h-5" 
            style={{ color: category.color }}
          />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900 tracking-tight">{category.name}</h2>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</p>
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}

        {isAddingTask ? (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 animate-scale-in">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleAddTask}
              placeholder="What needs to be done?"
              className="w-full text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none font-medium"
              autoFocus
            />
          </div>
        ) : (
          <button
            onClick={() => setIsAddingTask(true)}
            className="w-full py-3.5 px-4 text-sm text-gray-500 hover:text-gray-700 hover:bg-white rounded-xl border border-dashed border-gray-200 hover:border-gray-300 transition-all duration-200 font-medium flex items-center justify-center gap-2 group"
          >
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            Add task
          </button>
        )}
      </div>
    </div>
  );
}
