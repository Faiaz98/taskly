export interface UserPresence {
  name: string;
  status: 'active' | 'idle';
  lastActivity: number;
}

export interface PresencePeer {
  peer: string;
  state: UserPresence | undefined;
  connected: boolean;
  lastConnected?: number;
  lastDisconnected?: number;
  error?: any;
}
