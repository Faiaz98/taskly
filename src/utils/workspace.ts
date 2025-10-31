/**
 * Generate a unique workspace ID
 */
export function generateWorkspaceId(): string {
  const adjectives = ['happy', 'sunny', 'bright', 'swift', 'cool', 'smart', 'kind', 'bold'];
  const nouns = ['family', 'team', 'group', 'squad', 'crew', 'tribe', 'clan', 'house'];
  
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(Math.random() * 1000);
  
  return `${randomAdjective}-${randomNoun}-${randomNumber}`;
}

/**
 * Get workspace ID from URL query parameter
 */
export function getWorkspaceId(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('family');
}

/**
 * Set workspace ID in URL without page reload
 */
export function setWorkspaceId(workspaceId: string): void {
  const url = new URL(window.location.href);
  url.searchParams.set('family', workspaceId);
  window.history.replaceState({}, '', url.toString());
}

/**
 * Get or create workspace ID
 */
export function getOrCreateWorkspaceId(): string {
  let workspaceId = getWorkspaceId();
  
  if (!workspaceId) {
    workspaceId = generateWorkspaceId();
    setWorkspaceId(workspaceId);
  }
  
  return workspaceId;
}

/**
 * Get invite link for current workspace
 */
export function getInviteLink(): string {
  return window.location.href;
}
