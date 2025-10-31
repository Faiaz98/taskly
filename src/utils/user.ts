/**
 * Generate a unique user session ID
 */
export function generateUserId(): string {
  // Generate a unique session ID that persists during the session
  const sessionId = sessionStorage.getItem('user-session-id');
  if (sessionId) {
    return sessionId;
  }
  
  const newSessionId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  sessionStorage.setItem('user-session-id', newSessionId);
  return newSessionId;
}

/**
 * Get or generate user name
 */
export function getUserName(): string {
  // Check localStorage first (persisted across sessions)
  const storedName = localStorage.getItem('user-name');
  if (storedName) {
    return storedName;
  }
  
  // Fallback to sessionStorage for backwards compatibility
  const sessionName = sessionStorage.getItem('user-name');
  if (sessionName) {
    // Migrate to localStorage
    localStorage.setItem('user-name', sessionName);
    return sessionName;
  }
  
  // Generate a friendly random name
  const adjectives = ['Happy', 'Bright', 'Swift', 'Kind', 'Bold', 'Wise', 'Cool', 'Smart'];
  const names = ['Alex', 'Sam', 'Jordan', 'Casey', 'Riley', 'Morgan', 'Quinn', 'Taylor'];
  
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomName = names[Math.floor(Math.random() * names.length)];
  const newName = `${randomAdjective} ${randomName}`;
  
  // Save to localStorage for persistence
  localStorage.setItem('user-name', newName);
  return newName;
}

/**
 * Update user name with validation
 */
export function setUserName(name: string): { success: boolean; error?: string } {
  // Validate name
  const trimmedName = name.trim();
  
  if (!trimmedName) {
    return { success: false, error: 'Name cannot be empty' };
  }
  
  if (trimmedName.length > 30) {
    return { success: false, error: 'Name must be 30 characters or less' };
  }
  
  // Basic validation for forbidden characters (optional)
  const forbiddenChars = /[<>{}[\]\\]/;
  if (forbiddenChars.test(trimmedName)) {
    return { success: false, error: 'Name contains invalid characters' };
  }
  
  // Save to localStorage for persistence across sessions
  localStorage.setItem('user-name', trimmedName);
  
  // Also save to sessionStorage for backwards compatibility
  sessionStorage.setItem('user-name', trimmedName);
  
  return { success: true };
}
