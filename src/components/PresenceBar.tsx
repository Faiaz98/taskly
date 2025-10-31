import { UserPresence, PresencePeer } from '../types/presence';
import { generateAvatarUrl } from '../utils/avatar';
import { UserNameEditor } from './UserNameEditor';

interface PresenceBarProps {
  currentUser: UserPresence;
  others: Record<string, PresencePeer>;
  onNameChange: (newName: string) => void;
}

export function PresenceBar({ currentUser, others, onNameChange }: PresenceBarProps) {
  const onlineUsers = Object.values(others).filter((peer) => peer.connected && peer.state);
  const totalUsers = onlineUsers.length + 1; // +1 for current user

  return (
    <div className="flex flex-col items-center gap-4 mb-6">
      {/* User Name Editor */}
      <div className="flex items-center gap-2">
        <UserNameEditor 
          currentName={currentUser.name}
          onNameChange={onNameChange}
        />
      </div>

      {/* Avatars and Online Count */}
      <div className="flex items-center gap-3">
        <div className="flex items-center -space-x-2">
          {/* Current user */}
          <div className="relative group">
            <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden bg-white transition-transform hover:scale-110 hover:z-10">
              <img 
                src={generateAvatarUrl(currentUser.name)} 
                alt={currentUser.name}
                className="w-full h-full"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
              {currentUser.name} (You)
            </div>
          </div>

          {/* Other online users */}
          {onlineUsers.slice(0, 4).map((peer) => {
            const user = peer.state;
            if (!user) return null;

            return (
              <div key={peer.peer} className="relative group">
                <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden bg-white transition-transform hover:scale-110 hover:z-10">
                  <img 
                    src={generateAvatarUrl(user.name)} 
                    alt={user.name}
                    className="w-full h-full"
                  />
                </div>
                <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
                  user.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                }`}></span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {user.name}
                </div>
              </div>
            );
          })}

          {/* More users indicator */}
          {onlineUsers.length > 4 && (
            <div className="w-10 h-10 rounded-full border-2 border-white shadow-md bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600">
              +{onlineUsers.length - 4}
            </div>
          )}
        </div>

        <div className="text-sm text-gray-600 font-medium">
          {totalUsers} {totalUsers === 1 ? 'person' : 'people'} online
        </div>
      </div>
    </div>
  );
}
