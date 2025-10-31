import { useTaskStore } from './store/taskStore';
import { CategorySection } from './components/CategorySection';
import { CheckSquare, Wifi, WifiOff } from 'lucide-react';
import { useSharedState } from '@airstate/react';
import { Task } from './types/task';

// Initial tasks for the shared state
const initialTasks: Task[] = [
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

function App() {
  const categories = useTaskStore((state) => state.categories);
  
  // Use AirState's SharedState for real-time task synchronization
  const [tasks, setTasks, { connected, synced }] = useSharedState<Task[]>(initialTasks, {
    channel: 'family-tasks',
  });

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    setTasks((currentTasks) => [
      ...currentTasks,
      {
        ...taskData,
        id: Date.now().toString(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? { ...task, ...updates, updatedAt: Date.now() }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-10 text-center animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <CheckSquare className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent tracking-tight">
              Family Tasks
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto text-[15px] leading-relaxed font-medium">
            Collaborate with your family in real-time. Track tasks, share progress, and stay organized together.
          </p>
          
          {/* Real-time Status badge */}
          <div className={`mt-6 inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all duration-300 ${
            connected && synced
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-gray-50 border border-gray-200 text-gray-600'
          }`}>
            <div className="relative flex items-center">
              {connected && synced ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-green-600" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </>
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-gray-400" />
              )}
            </div>
            <span className="text-xs">
              {connected && synced
                ? '🎉 Live sync active • Changes sync instantly'
                : '⏳ Connecting to AirState...'}
            </span>
          </div>
        </div>

        {/* Task Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 mb-12">
          {categories.map((category, index) => {
            const categoryTasks = tasks.filter((task) => task.category === category.id);
            return (
              <div 
                key={category.id}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CategorySection 
                  category={category}
                  tasks={categoryTasks}
                  onAddTask={addTask}
                  onUpdateTask={updateTask}
                  onDeleteTask={deleteTask}
                />
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-xs text-gray-400 font-medium">
            <span>Powered by</span>
            <span className="text-gray-600 font-semibold">AirState</span>
            <span>•</span>
            <span>Built with React & TypeScript</span>
          </div>
          {connected && synced && (
            <p className="mt-2 text-xs text-green-600 font-medium">
              ✨ Open this page in multiple tabs or devices to see real-time sync in action!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
