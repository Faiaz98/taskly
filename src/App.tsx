import { useMemo } from 'react';
import { useTaskStore } from './store/taskStore';
import { CategorySection } from './components/CategorySection';
import { WorkspaceHeader } from './components/WorkspaceHeader';
import { ConnectionStatus } from './components/ConnectionStatus';
import { useSharedState } from '@airstate/react';
import { Task } from './types/task';
import { getOrCreateWorkspaceId, getInviteLink } from './utils/workspace';

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
  
  // Get or create workspace ID from URL
  const workspaceId = useMemo(() => getOrCreateWorkspaceId(), []);
  const inviteLink = useMemo(() => getInviteLink(), []);
  
  // Use AirState's SharedState with workspace-specific channel
  const [tasks, setTasks, { connected, synced }] = useSharedState<Task[]>(initialTasks, {
    channel: `family-tasks-${workspaceId}`,
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
        {/* Header with Workspace Info */}
        <WorkspaceHeader 
          workspaceName={workspaceId}
          inviteLink={inviteLink}
        />

        {/* Connection Status */}
        <div className="text-center mb-8">
          <ConnectionStatus connected={connected} synced={synced} />
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
              ✨ Share your invite link to collaborate in real-time!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
