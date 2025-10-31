import { Wifi, WifiOff } from 'lucide-react';

interface ConnectionStatusProps {
  connected: boolean;
  synced: boolean;
}

export function ConnectionStatus({ connected, synced }: ConnectionStatusProps) {
  const isActive = connected && synced;

  return (
    <div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all duration-300 ${
      isActive
        ? 'bg-green-50 border border-green-200 text-green-700'
        : 'bg-gray-50 border border-gray-200 text-gray-600'
    }`}>
      <div className="relative flex items-center">
        {isActive ? (
          <>
            <Wifi className="w-3.5 h-3.5 text-green-600" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </>
        ) : (
          <WifiOff className="w-3.5 h-3.5 text-gray-400" />
        )}
      </div>
      <span className="text-xs">
        {isActive
          ? '🎉 Live sync active • Changes sync instantly'
          : '⏳ Connecting to AirState...'}
      </span>
    </div>
  );
}
