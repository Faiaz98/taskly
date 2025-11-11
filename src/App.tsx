import { useMemo, useEffect, useState, useRef } from 'react';
import { useTaskStore } from './store/taskStore';
import { CategorySection } from './components/CategorySection';
import { WorkspaceHeader } from './components/WorkspaceHeader';
import { ConnectionStatus } from './components/ConnectionStatus';
import { PresenceBar } from './components/PresenceBar';
import { useSharedState, useSharedPresence } from '@airstate/react';
import { Task } from './types/task';
import { UserPresence } from './types/presence';
import { getOrCreateWorkspaceId, getInviteLink } from './utils/workspace';
import { generateUserId, getUserName, setUserName } from './utils/user';

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
  
  // Use refs for truly stable values that should never change
  const workspaceIdRef = useRef<string>();
  if (!workspaceIdRef.current) {
    workspaceIdRef.current = getOrCreateWorkspaceId();
  }
  const workspaceId = workspaceIdRef.current;
  
  const inviteLinkRef = useRef<string>();
  if (!inviteLinkRef.current) {
    inviteLinkRef.current = getInviteLink();
  }
  const inviteLink = inviteLinkRef.current;
  
  // Use refs for user ID (truly stable)
  const userIdRef = useRef<string>();
  if (!userIdRef.current) {
    userIdRef.current = generateUserId();
  }
  const userId = userIdRef.current;
  
  const [userName, setUserNameState] = useState(() => getUserName());
  
  // Use refs for channel names (stable)
  const tasksChannelRef = useRef<string>();
  if (!tasksChannelRef.current) {
    tasksChannelRef.current = `family-tasks-${workspaceId}`;
  }
  const tasksChannel = tasksChannelRef.current;
  
  const presenceRoomRef = useRef<string>();
  if (!presenceRoomRef.current) {
    presenceRoomRef.current = `family-presence-${workspaceId}`;
  }
  const presenceRoom = presenceRoomRef.current;
  
  // Create initial presence state with ref for timestamp (stable)
  const initialTimestampRef = useRef<number>();
  if (!initialTimestampRef.current) {
    initialTimestampRef.current = Date.now();
  }
  
  const initialUserPresenceRef = useRef<UserPresence>();
  if (!initialUserPresenceRef.current) {
    initialUserPresenceRef.current = {
      name: userName,
      status: 'active',
      lastActivity: initialTimestampRef.current,
    };
  }
  
  // User presence state
  const [userPresence, setUserPresence] = useState<UserPresence>(() => initialUserPresenceRef.current!);
  
  // Create stable options objects using refs
  const sharedStateOptionsRef = useRef<{ channel: string }>();
  if (!sharedStateOptionsRef.current) {
    sharedStateOptionsRef.current = { channel: tasksChannel };
  }
  
  const sharedPresenceOptionsRef = useRef<{ peerId: string; initialState: UserPresence; room: string }>();
  if (!sharedPresenceOptionsRef.current) {
    sharedPresenceOptionsRef.current = {
      peerId: userId,
      initialState: initialUserPresenceRef.current,
      room: presenceRoom,
    };
  }
  
  // Use AirState's SharedState with stable options
  const [tasks, setTasks, { connected: tasksConnected, synced: tasksSynced }] = useSharedState<Task[]>(
    initialTasks,
    sharedStateOptionsRef.current
  );

  // Use AirState's SharedPresence with stable options
  const { self, setState: setPresenceState, others, connected: presenceConnected, started: presenceStarted } = useSharedPresence<UserPresence>(
    sharedPresenceOptionsRef.current
  );
  
  // Debug logging in development
  useEffect(() => {
    console.log('🔍 AirState Connection Status:', {
      workspaceId,
      tasksChannel,
      presenceRoom,
      userId,
      tasksConnected,
      tasksSynced,
      presenceConnected,
      presenceStarted,
    });
  }, [workspaceId, tasksChannel, presenceRoom, userId, tasksConnected, tasksSynced, presenceConnected, presenceStarted]);

  // Handle name change
  const handleNameChange = (newName: string) => {
    const result = setUserName(newName);
    if (result.success) {
      setUserNameState(newName);
      
      // Update presence state with new name
      setPresenceState((prev) => ({
        ...prev,
        name: newName,
      }));
      
      // Update local user presence state
      setUserPresence((prev) => ({
        ...prev,
        name: newName,
      }));
    }
  };

  // Update activity timestamp periodically
  // FIXED: Remove setPresenceState from dependencies to prevent infinite loop
  useEffect(() => {
    if (!presenceStarted) return; // Only run when presence is actually started
    
    const interval = setInterval(() => {
      setPresenceState((prev) => ({
        ...prev,
        lastActivity: Date.now(),
        status: 'active',
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [presenceStarted]); // Only depend on presenceStarted, not setPresenceState

  // Update presence on user activity
  // FIXED: Remove setPresenceState from dependencies and throttle activity updates
  useEffect(() => {
    if (!presenceStarted) return; // Only run when presence is actually started
    
    let lastUpdate = 0;
    const THROTTLE_MS = 5000; // Only update every 5 seconds max
    
    const handleActivity = () => {
      const now = Date.now();
      if (now - lastUpdate < THROTTLE_MS) return; // Throttle updates
      
      lastUpdate = now;
      setPresenceState((prev) => ({
        ...prev,
        lastActivity: now,
        status: 'active',
      }));
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [presenceStarted]); // Only depend on presenceStarted, not setPresenceState

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

  const connected = tasksConnected && presenceConnected;
  const synced = tasksSynced && presenceStarted;

  // Get current user presence from self.state or fallback to userPresence
  const currentUserPresence = self.state || userPresence;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header with Workspace Info */}
        <WorkspaceHeader 
          workspaceName={workspaceId}
          inviteLink={inviteLink}
        />

        {/* Connection Status */}
        <div className="text-center mb-6">
          <ConnectionStatus connected={connected} synced={synced} />
        </div>

        {/* Presence Bar with Name Editor */}
        {synced && (
          <PresenceBar 
            currentUser={currentUserPresence}
            others={others}
            onNameChange={handleNameChange}
          />
        )}

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
