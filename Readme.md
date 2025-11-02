# Taskly - Real-Time Collaborative Task Manager

Taskly is a modern, real-time collaborative task management application built with React, TypeScript, and AirState. Perfect for families or small teams who want to manage tasks together with instant synchronization across all devices.

It's mainly designed to demonstrate how lightweight yet powerful frontend architechture can handle multi-device state sync seamlessly.

----

## Overview

Taskly allows multiple users or sessions to view, update and manage shared tasks in real time -- wtihout a backend server.

It leverages AirState for peer-to-peer style sync and Vite for ultra fast development builds.

---

## Features

- **Real-Time Collaboration**: Tasks sync instantly across all connected users using AirState
- **Isolated Workspaces**: Each family/group gets their own private workspace via unique URLs
- **Live Presence Indicators**: See who's online with real-time user avatars
- **Editable User Names**: Customize your display name with instant updates across all users
- **Task Management**: Create, update, and delete tasks with status tracking (idle, in-progress, done)
- **Category Organization**: Organize tasks by categories (Groceries, Chores, Errands, Personal)
- **Modern UI**: Clean, minimal interface built with Tailwind CSS and Lucide icons
- **Responsive Design**: Works seamlessly on desktop and mobile devices

----

## Quick Start

### Prerequisites
- Node.js 16+ and npm

### Installation

1. **Clone the repository and install dependencies**:
   ```bash
   npm install
   ```

2. **Configure AirState** (Optional for demo):
   ```bash
   cp .env.example .env
   # Edit .env and add your AirState App ID from https://console.airstate.dev/
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```
   Visit http://localhost:5173

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

---
## Tech Stack

- **Frontend Framework** : React 18 + TypeScript
- **Build Tool** - Vite 7
- **Styling** - Tailwind CSS
- **Animation** - Framer Motion
- **State Sync** - AirState
- **Routing** - React Router DOM
- **Icons** - Lucide React
- **Deployment** - Vercel

----

## How the Code Works

### Application Entry Point (`src/main.tsx`)

The application starts in `main.tsx`, which handles:

1. **AirState Configuration**: Initializes the AirState client with your App ID
   ```typescript
   configure({
     appId: import.meta.env.VITE_AIRSTATE_APP_ID || 'demo-family-tasks-app',
   });
   ```

2. **Error Handling**: Wraps configuration in try-catch for production reliability
3. **React Mounting**: Renders the App component into the DOM

### Main Application Component (`src/App.tsx`)

The heart of the application orchestrates all features:

#### 1. **Workspace Management**
- Uses `getOrCreateWorkspaceId()` to extract or generate a unique workspace ID from the URL
- Creates workspace-specific channels: `family-tasks-${workspaceId}` for tasks
- Generates shareable invite links for collaboration

#### 2. **Real-Time State Management**
- **Tasks**: Uses AirState's `useSharedState` hook for instant task synchronization
  ```typescript
  const [tasks, setTasks, { connected, synced }] = useSharedState<Task[]>(initialTasks, {
    channel: `family-tasks-${workspaceId}`,
  });
  ```
- **Presence**: Uses AirState's `useSharedPresence` hook for user tracking
  ```typescript
  const { self, setState, others } = useSharedPresence<UserPresence>({
    peerId: userId,
    initialState: { name, status: 'active', lastActivity: Date.now() },
    room: `family-presence-${workspaceId}`,
  });
  ```

#### 3. **User Identity**
- Generates unique session ID via `generateUserId()` (stored in sessionStorage)
- Manages user names with `getUserName()` and `setUserName()` (persisted in localStorage)
- Updates presence state when name changes

#### 4. **Activity Tracking**
- Monitors mouse movements, clicks, and keyboard events
- Updates `lastActivity` timestamp every 30 seconds
- Keeps presence status current across all users

#### 5. **Task Operations**
- **Add Task**: Creates new task with unique ID and timestamps
- **Update Task**: Modifies existing task and updates `updatedAt`
- **Delete Task**: Removes task from shared state

### State Management (`src/store/taskStore.ts`)

Uses Zustand for **static** data that doesn't need real-time sync:
- Task categories (Groceries, Chores, Errands, Personal)
- Category metadata (name, icon, color)

**Why separate stores?**
- Zustand: Lightweight, perfect for static/local data
- AirState: Real-time synchronization for collaborative data

### Utilities

#### `src/utils/workspace.ts`
- **URL-based Multi-Tenancy**: Reads `?family=<id>` from URL
- **Auto-Generation**: Creates unique workspace ID if missing
- **Invite Links**: Generates shareable URLs for workspace collaboration

#### `src/utils/user.ts`
- **Session Identity**: Generates UUID v4 for unique user sessions
- **Name Persistence**: Stores user names in localStorage
- **Validation**: Ensures names are 1-20 characters, alphanumeric + spaces

#### `src/utils/avatar.ts`
- **Deterministic Avatars**: Generates SVG avatars based on user initials
- **Color Generation**: Creates unique background colors from name hash
- **Accessibility**: Uses contrasting white text for readability

---

## Feature Deep Dive

### Real-Time Task Synchronization

**How it works:**
1. User creates/updates/deletes a task
2. AirState's `setTasks` function updates local state
3. Change is broadcast to AirState server
4. Server pushes update to all connected clients in the same channel
5. Other users see changes instantly (typically < 100ms)

**Code Example:**
```typescript
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
```

### Isolated Workspaces

**How it works:**
1. User visits the app (e.g., `https://yourapp.com/`)
2. `getOrCreateWorkspaceId()` checks URL for `?family=<id>` parameter
3. If missing, generates unique ID and updates URL: `?family=happy-squad-123`
4. AirState channels use this ID: `family-tasks-happy-squad-123`
5. Users in different workspaces never see each other's data

**Sharing a workspace:**
- Copy the URL with the `?family=` parameter
- Share with family/team members
- They join the same channel and see all tasks

### Live Presence System

**How it works:**
1. Each user gets a unique `peerId` (stored in sessionStorage)
2. User's presence state includes: name, status, lastActivity
3. `useSharedPresence` broadcasts presence to all users in the room
4. Activity events (mouse, keyboard) update `lastActivity` timestamp
5. `PresenceBar` component displays all online users with avatars

**Avatar Generation:**
- Extracts initials from user name (e.g., "John Doe" → "JD")
- Generates deterministic color based on name hash
- Creates SVG with initials and colored background
- Updates automatically when name changes

### User Name Editing

**How it works:**
1. User clicks their name in the presence bar
2. `UserNameEditor` component shows inline input field
3. User types new name and presses Enter or clicks Save
4. `setUserName()` validates and saves to localStorage
5. `setPresenceState()` broadcasts change to all users
6. Avatar regenerates with new initials
7. All other users see the updated name instantly

----

## Tech Stack

### Core Framework
- **React 18.3.1**: Modern UI library with hooks and concurrent features
- **TypeScript 5.8.3**: Type-safe development experience
- **Vite 7.0.0**: Lightning-fast build tool with HMR

### Real-Time Infrastructure
- **AirState 3.0.1**: Real-time state synchronization engine
  - `@airstate/client`: Core client library
  - `@airstate/react`: React hooks integration

### State Management
- **Zustand 4.4.7**: Lightweight state management for static data
- **AirState useSharedState**: Real-time collaborative state
- **AirState useSharedPresence**: User presence tracking

### Styling & UI
- **Tailwind CSS 3.4.17**: Utility-first CSS framework
- **Lucide React 0.533.0**: Beautiful icon library
- **Framer Motion 11.0.8**: Animation library (available for enhancements)
- **Headless UI 1.7.18**: Accessible UI components (available)

### Routing & Utilities
- **React Router DOM 6.30.1**: Client-side routing (available for multi-page features)
- **clsx 2.1.0**: Conditional className utility
----

## Development Guide

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Required: Your AirState App ID from https://console.airstate.dev/
VITE_AIRSTATE_APP_ID=your-airstate-app-id-here

# Optional: Custom AirState server (for self-hosted instances)
# VITE_AIRSTATE_SERVER_URL=wss://your-server.airstate.dev
```

**Note**: The app works with the demo `appId` for testing, but you should create your own for production.

### Getting an AirState App ID

1. Visit [AirState Console](https://console.airstate.dev/)
2. Sign up or log in
3. Create a new application
4. Copy your App ID
5. Add it to your `.env` file

### Running the App

**Development Mode** (with hot reload):
```bash
npm run dev
```

**Production Build**:
```bash
npm run build
```

**Preview Production Build**:
```bash
npm run preview
```

### Understanding the Connection Status

The app displays connection status in the header:

- **🟢 Connected & Synced**: All real-time features working
- **🟡 Connecting**: Establishing connection to AirState server
- **🔴 Disconnected**: No real-time sync (local changes only)

### TypeScript Configuration

- `tsconfig.json`: Main TypeScript configuration
- `tsconfig.app.json`: App-specific settings
- `tsconfig.node.json`: Node.js tooling settings

### Build Output

Production build generates:
- `dist/index.html`: Entry point
- `dist/assets/*.js`: Bundled JavaScript with hash
- `dist/assets/*.css`: Compiled Tailwind CSS
----

## Customization Guide

### Adding New Task Categories

Edit `src/store/taskStore.ts`:

```typescript
const mockCategories: Category[] = [
  { id: 'groceries', name: 'Groceries', icon: 'ShoppingCart', color: '#10B981' },
  { id: 'work', name: 'Work Tasks', icon: 'Briefcase', color: '#3B82F6' }, // Add this
];
```

Icons are from [Lucide React](https://lucide.dev/icons/).

### Changing Color Scheme

Edit `tailwind.config.js` to customize colors:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
        secondary: '#your-color',
      },
    },
  },
};
```

Update background gradient in `src/App.tsx`:

```typescript
<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
```

### Adding Task Properties

1. Update `src/types/task.ts`:
   ```typescript
   export interface Task {
     // existing properties...
     priority?: 'low' | 'medium' | 'high';
     dueDate?: number;
   }
   ```

2. Update task creation in `src/App.tsx`
3. Update `TaskCard.tsx` to display new properties
----

## Collaboration Tips

### Best Practices

1. **Share Workspace Links**: Copy the full URL including `?family=` parameter
2. **Name Yourself**: Click your name to set a recognizable display name
3. **Stay Active**: The app tracks activity to show who's actively working
4. **Refresh on Issues**: If sync stops, refresh the browser to reconnect

### Troubleshooting

**Tasks not syncing?**
- Check connection status in the header
- Ensure all users are on the same workspace URL
- Refresh the browser to reconnect
- Check browser console for errors

**Can't see other users?**
- Verify you're using the same workspace URL (same `?family=` parameter)
- Check that AirState is configured correctly
- Ensure presence system is started (green status indicator)

**Name changes not working?**
- Names must be 1-20 characters
- Only letters, numbers, and spaces allowed
- Check browser's localStorage permissions


----


## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Add environment variable
echo "VITE_AIRSTATE_APP_ID=pk_airstate_nVVsF3Fm-OEO49Rankf0d" > .env

# 3. Start dev server
npm run dev

```

Visit → http://localhost:5173

If you see real-time updates locally, your AirState setup is correct.

## Production Deployment (Vercel)

1. Push your code to GitHub

```bash
git add .
git commit -m "Initial Taskly deployment"
git push origin main

```

2. Deploy on Vercel

- Import your repo
- Framework Preset: Vite
- Root directory: `.`
- Output directory: `dist`
- Build Command: `npm run build`

3. Add Environment Variables (IMPORTANT!)

In Vercel -> Project -> Settings -> Environment Variables:

4. Whitelist your domain in AirState Dashboard

Example:

```bash
taskly-air.vercel.app
```

❗ Don’t include https:// — only hostname or wildcard domains are accepted.

---

## Known Issues & Resolutions

This section documents issues encountered during development and their solutions to help future developers.

### Issue 1: AirState Constant Reconnection Loop

**Symptoms:**
- App stuck showing "Connecting to AirState" 
- WebSocket connections spam (constant reconnection attempts)
- Tasks not syncing despite successful WebSocket handshakes (HTTP 101)
- Console showing repeated `wss://server.airstate.dev/ws` connections

**Root Cause:**
The AirState hooks (`useSharedState` and `useSharedPresence`) were receiving new object references on every React render, causing them to detect configuration changes and attempt reconnection. Even though `workspaceId` and `userId` were memoized with `useMemo`, the options objects containing these values were being recreated on each render.

```typescript
// ❌ INCORRECT - Creates new object reference every render
const [tasks, setTasks] = useSharedState<Task[]>(initialTasks, {
  channel: `family-tasks-${workspaceId}`,  // New object every render!
});
```

**Solution:**
Memoize all options objects and configuration values passed to AirState hooks:

```typescript
// ✅ CORRECT - Stable references across renders
const tasksChannel = useMemo(() => `family-tasks-${workspaceId}`, [workspaceId]);
const sharedStateOptions = useMemo(() => ({
  channel: tasksChannel,
}), [tasksChannel]);

const [tasks, setTasks] = useSharedState<Task[]>(initialTasks, sharedStateOptions);
```

**Files Modified:** `src/App.tsx`

**Key Learnings:**
- React hooks that accept options objects need stable references to prevent re-initialization
- Always memoize configuration objects passed to third-party hooks
- WebSocket handshake success (HTTP 101) doesn't guarantee stable connection if hooks keep reinitializing

---

### Issue 2: Workspace Isolation Causing Failed Sync

**Symptoms:**
- Users can't see each other's tasks
- Presence system shows only current user
- No sync errors in console
- Each user appears to be in their own isolated workspace

**Root Cause:**
Each user visiting the app without a shared URL gets a different workspace ID generated randomly. For example:
- User A visits `https://app.com/` → gets `?family=happy-squad-123`
- User B visits `https://app.com/` → gets `?family=cool-team-456`
- Users end up in completely different AirState channels and can never sync

**Solution:**
Ensure all collaborators use the **exact same URL** including the `?family=` parameter:

1. **First user** visits app and gets workspace ID automatically added to URL
2. **Share the complete URL** (with `?family=` parameter) via the invite link feature
3. **Other users** click the shared link to join the same workspace

**Prevention:**
- Always copy the full URL from browser address bar when sharing
- Use the built-in "Copy Invite Link" button in the WorkspaceHeader component
- Educate users that bookmarking the base URL won't maintain workspace access

**Files Involved:** `src/utils/workspace.ts`, `src/components/WorkspaceHeader.tsx`

---

### Issue 3: PeerId Not Persistent Across Sessions

**Symptoms:**
- User appears as new person after browser restart
- Session ID changes when opening new tab
- Presence history not maintained

**Root Cause:**
The `generateUserId()` function uses `sessionStorage` instead of `localStorage`, which clears when the browser tab/window closes. This was intentional for session-based presence but can be confusing if users expect persistent identity.

```typescript
// Current implementation (session-based)
sessionStorage.setItem('user-session-id', newSessionId);
```

**Current Behavior:**
- ✅ Each browser session gets unique peerId
- ✅ Multiple tabs get different peerIds (prevents conflicts)
- ⚠️ Closing and reopening browser creates new identity

**When This Is a Problem:**
If you need persistent user identity across browser sessions, consider migrating to `localStorage`:

```typescript
// For persistent identity
localStorage.setItem('user-session-id', newSessionId);
```

**Files Involved:** `src/utils/user.ts`

**Decision Made:** Kept `sessionStorage` for presence tracking as it better represents actual session activity.

---

----

## Developer Notes

- Keep `.env` files out of source control.
- Use React Hooks + TypeScript interfaces for modular state.
- Avoid modifying index.html script entry — it’s Vite’s bootloader.
- If you fork this repo, remember to create a new AirState App ID.

## Acknowledgments

- **AirState**: Real-time synchronization infrastructure
- **React Team**: Modern UI framework
- **Tailwind CSS**: Utility-first styling system
- **Lucide**: Beautiful icon library


## Support

For issues or questions:
- Check the [AirState Documentation](https://docs.airstate.dev/)
- Review the [React Documentation](https://react.dev/)
- Consult the [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---