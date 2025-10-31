/**
 * Generate a color from a string (deterministic)
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate pleasant pastel colors
  const hue = hash % 360;
  const saturation = 65 + (hash % 10);
  const lightness = 55 + (hash % 10);
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  if (!name) return '?';
  
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

/**
 * Generate SVG avatar data URL from initials
 */
export function generateAvatarUrl(name: string): string {
  const initials = getInitials(name);
  const backgroundColor = stringToColor(name);
  
  const svg = `
    <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="20" fill="${backgroundColor}"/>
      <text
        x="50%"
        y="50%"
        font-family="Inter, system-ui, sans-serif"
        font-size="16"
        font-weight="600"
        fill="white"
        text-anchor="middle"
        dominant-baseline="central"
      >${initials}</text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}
