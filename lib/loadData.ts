import { Workspace, Profile } from '@/types';

// This function loads data from SQLite (server-side only)
export async function loadInitialData(): Promise<{
  workspaces: Workspace[];
  profiles: Profile[];
}> {
  // Only run on server-side
  if (typeof window !== 'undefined') {
    throw new Error('loadInitialData should only be called server-side');
  }

  const { getAllWorkspaces, getAllProfiles, initializeDatabase } = await import('./db');

  // Initialize database if not already done
  initializeDatabase();

  const workspaces = getAllWorkspaces();
  const profiles = getAllProfiles();

  return { workspaces, profiles };
}

// Export a static JSON version for client-side hydration
export function getStaticData() {
  // This will be populated by the build process or server
  // For now, fall back to constants
  if (typeof window === 'undefined') {
    // Server-side: load from DB
    const { loadInitialData } = require('./loadData');
    return loadInitialData();
  }

  // Client-side: use constants as fallback (will be replaced by Zustand persist)
  const { INITIAL_WORKSPACES, PROFILES } = require('../constants');
  return {
    workspaces: INITIAL_WORKSPACES,
    profiles: PROFILES,
  };
}
