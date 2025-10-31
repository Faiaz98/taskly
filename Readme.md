# Taskly - Real-Time Collaborative Task Manager

Taskly is a modern, minimalist task management web app build with React, TypeScript, Vite and TailwindCSS, featuring real-time sync using AirState.
Taskly isn’t just a static to-do app — it’s a dynamic real-time collaboration space powered by AirState.
Each user automatically gets their own unique workspace channel, generated from the app URL.

It's mainly designed to demonstrate how lightweight yet powerful frontend architechture can handle multi-device state sync seamlessly.

----

## Overview

Taskly allows multiple users or sessions to view, update and manage shared tasks in real time -- wtihout a backend server.

It leverages AirState for peer-to-peer style sync and Vite for ultra fast development builds.

---

## How it Works

- When someone visits the main app link (e.g. https://taskly-air.vercel.app),
Taskly automatically creates a new unique workspace ID in the URL, such as:

```bash
https://taskly-liard-eight.vercel.app/?family=cool-crew-191
```
- That unique ID (family=cool-crew-191) represents the workspace channel on AirState.

- Anyone who opens that exact link joins the same real-time workspace.
They’ll instantly see the same tasks, updates, and state synced live.

- If a new person opens the app without that link, they’ll get a brand new workspace with their own unique channel.

### TL;DR

> Each unique URL = a unique collaborative workspace.
> Only people with that exact link can join and sync data in real time.
> No backend, no login — just instant collaboration through shared state.

## Core Features

- **Real-Time Sync** - Instant data updates across browsers via AirState.
- **Modular Architechture** - Clean React + TypeScript component structure.
- **Tailwind Design System** - Fully responsive, mobile-first UI.
- **Vite + React 18** - Next-generation build system with blazing-fast HMR.
- **Deployed on Vercel** - Serverless, production-ready hosting.
- **Environment-Safe Configs** - Uses `VITE_` prefixed environment variables for browser access.

----

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

## Environment Variables

Your AirState configuration must be defined in a `.env` file at the project root, not inside `/src`.

```bash
VITE_AIRSTATE_APP_ID=your-appId
```

Only `VITE_` prefixed variables are exposed to the client in Vite.
This is intentional — do not store private keys in frontend .env files



----

## AirState Integration

**AirState** is used to persist and synchronized state across browser sessions.

Example:

```ts
import { AirState } from "@airstate/client";

const tasks = new AirState("tasks", [], {
  appId: import.meta.env.VITE_AIRSTATE_APP_ID,
});

tasks.subscribe((newTasks) => {
  console.log("Synced Tasks:", newTasks);
});

```

This allows real-time updates without a database or server.
When one client updates tasks, others immediately receive the change through AirState’s WebSocket bridge.


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

## Current Issues

1. AirState Connects but Doesn't Sync
2. Works locally but not on Vercel
3. Console spam with `wss://server.airstate.dev/ws`

Basically the issue is the same old "works on my dev but fails on prod". Hoping to find a fix soon. But the App works as expected.

----

## Developer Notes

- Keep `.env` files out of source control.
- Use React Hooks + TypeScript interfaces for modular state.
- Avoid modifying index.html script entry — it’s Vite’s bootloader.
- If you fork this repo, remember to create a new AirState App ID.
