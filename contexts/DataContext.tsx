'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { INITIAL_WORKSPACES, PROFILES, SYSTEM_USERS } from '@/constants';
import { Workspace, Profile, User, Message } from '@/types';

interface DataContextType {
  workspaces: Workspace[];
  profiles: Profile[];
  systemUsers: User[];
  activeProfileId: string;
  setActiveProfileId: (id: string) => void;
  addWorkspace: (workspace: Workspace) => void;
  updateWorkspace: (id: string, updates: Partial<Workspace>) => void;
  deleteWorkspace: (id: string) => void;
  addMessage: (workspaceId: string, message: Message) => void;
  addProfile: (profile: Profile) => void;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  WORKSPACES: 'rima_workspace_data',
  PROFILES: 'rima_profiles_data',
  ACTIVE_PROFILE: 'rima_active_profile',
} as const;

export function DataProvider({ children }: { children: ReactNode }) {
  const { isDemoMode, user } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>(PROFILES);
  const [activeProfileId, setActiveProfileIdState] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize data based on mode (Demo vs Real)
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const initializeData = async () => {
      setIsLoading(true);
      try {
        if (isDemoMode) {
          // DEMO MODE: Load from localStorage or initialize with constants
          const storedWorkspaces = localStorage.getItem(STORAGE_KEYS.WORKSPACES);
          const storedProfile = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE);

          if (storedWorkspaces) {
            setWorkspaces(JSON.parse(storedWorkspaces));
          } else {
            // First time in demo mode - initialize with mock data
            setWorkspaces(INITIAL_WORKSPACES);
            localStorage.setItem(STORAGE_KEYS.WORKSPACES, JSON.stringify(INITIAL_WORKSPACES));
          }

          const storedProfiles = localStorage.getItem(STORAGE_KEYS.PROFILES);
          if (storedProfiles) {
            setProfiles(JSON.parse(storedProfiles));
          } else {
            // Use default PROFILES, no need to set state as it's default
            // But persist it? Maybe not needed if generic.
          }

          if (storedProfile) {
            setActiveProfileIdState(storedProfile);
          }
        } else {
          // REAL MODE: Fetch from Firebase (placeholder for Phase 4)
          // TODO: Implement Firebase Firestore queries
          // For now, return empty array
          setWorkspaces([]);
        }
      } catch (error) {
        console.error('Error initializing data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [isDemoMode, user]);

  // Persist workspaces to localStorage in demo mode whenever they change
  useEffect(() => {
    if (isDemoMode && workspaces.length > 0) {
      localStorage.setItem(STORAGE_KEYS.WORKSPACES, JSON.stringify(workspaces));
    }
  }, [workspaces, isDemoMode]);

  // Persist profiles
  useEffect(() => {
    if (isDemoMode && profiles.length > 0) {
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
    }
  }, [profiles, isDemoMode]);

  const setActiveProfileId = (id: string) => {
    setActiveProfileIdState(id);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE, id);
  };

  const addWorkspace = (workspace: Workspace) => {
    if (isDemoMode) {
      const newWorkspaces = [...workspaces, workspace];
      setWorkspaces(newWorkspaces);
    } else {
      // TODO: Add to Firebase
      console.log('TODO: Add workspace to Firebase', workspace);
    }
  };

  const updateWorkspace = (id: string, updates: Partial<Workspace>) => {
    if (isDemoMode) {
      const updatedWorkspaces = workspaces.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      );
      setWorkspaces(updatedWorkspaces);
    } else {
      // TODO: Update in Firebase
      console.log('TODO: Update workspace in Firebase', id, updates);
    }
  };

  const deleteWorkspace = (id: string) => {
    if (isDemoMode) {
      const filteredWorkspaces = workspaces.filter((p) => p.id !== id);
      setWorkspaces(filteredWorkspaces);
    } else {
      // TODO: Delete from Firebase
      console.log('TODO: Delete workspace from Firebase', id);
    }
  };

  const addMessage = (workspaceId: string, message: Message) => {
    if (isDemoMode) {
      const updatedWorkspaces = workspaces.map((p) =>
        p.id === workspaceId
          ? { ...p, messages: [...p.messages, message] }
          : p
      );
      setWorkspaces(updatedWorkspaces);
    } else {
      // TODO: Add message to Firebase
      console.log('TODO: Add message to Firebase', workspaceId, message);
    }
  };

  const addProfile = (profile: Profile) => {
    // Avoid duplicates
    if (profiles.some(p => p.id === profile.id)) return;

    const newProfiles = [...profiles, profile];
    setProfiles(newProfiles);
    // LocalStorage update handled by useEffect
  };

  const value: DataContextType = {
    workspaces,
    profiles,
    systemUsers: SYSTEM_USERS,
    activeProfileId,
    setActiveProfileId,
    addWorkspace,
    updateWorkspace,
    deleteWorkspace,
    addMessage,
    addProfile,
    isLoading,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useWorkspaceData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useWorkspaceData must be used within a DataProvider');
  }
  return context;
}
