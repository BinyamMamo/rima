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
  addRoomMessage: (workspaceId: string, roomId: string, message: Message) => void;
  updateRoom: (workspaceId: string, roomId: string, updates: Partial<any>) => void;
  deleteRoom: (workspaceId: string, roomId: string) => void;
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

  const addRoomMessage = (workspaceId: string, roomId: string, message: Message) => {
    if (isDemoMode) {
      const updatedWorkspaces = workspaces.map((workspace) => {
        if (workspace.id === workspaceId) {
          const updatedRooms = workspace.rooms.map((room) => {
            if (room.id === roomId) {
              return { ...room, messages: [...room.messages, message] };
            }
            return room;
          });
          return { ...workspace, rooms: updatedRooms };
        }
        return workspace;
      });
      setWorkspaces(updatedWorkspaces);
    } else {
      // TODO: Add message to Firebase
      console.log('TODO: Add room message to Firebase', workspaceId, roomId, message);
    }
  };

  const updateRoom = (workspaceId: string, roomId: string, updates: Partial<any>) => {
    if (isDemoMode) {
      const updatedWorkspaces = workspaces.map((workspace) => {
        if (workspace.id === workspaceId) {
          const updatedRooms = workspace.rooms.map((room) => {
            if (room.id === roomId) {
              return { ...room, ...updates };
            }
            return room;
          });
          return { ...workspace, rooms: updatedRooms };
        }
        return workspace;
      });
      setWorkspaces(updatedWorkspaces);
    } else {
      // TODO: Update room in Firebase
      console.log('TODO: Update room in Firebase', workspaceId, roomId, updates);
    }
  };

  const deleteRoom = (workspaceId: string, roomId: string) => {
    if (isDemoMode) {
      const updatedWorkspaces = workspaces.map((workspace) => {
        if (workspace.id === workspaceId) {
          const filteredRooms = workspace.rooms.filter((room) => room.id !== roomId);
          return { ...workspace, rooms: filteredRooms };
        }
        return workspace;
      });
      setWorkspaces(updatedWorkspaces);
    } else {
      // TODO: Delete room from Firebase
      console.log('TODO: Delete room from Firebase', workspaceId, roomId);
    }
  };

  const updateProfile = (updates: Partial<User>) => {
    // In a real app, this would update the auth user profile in the backend
    // Since we are using a mock User object from AuthContext which is often derived or static in this demo:

    // We can't directly update the 'user' object from useAuth() here as it comes from AuthContext.
    // However, for this prototype, if the user updates their profile in DataContext, 
    // we should probably expose a method in AuthContext to update the local user state.

    // BUT, the request is to make it work. 
    // Let's assume there is a setSystemUsers or similar if we were editing system users, 
    // but we are editing the CURRENT LOGGED IN USER.

    // The clean way: Calling updateProfile on AuthContext. 
    // But since I'm in DataContext, I should probably just provide this function 
    // and let it call a method I'll add to AuthContext? 
    // OR, I can just update the local storage 'rima_user' if that's how it persists.

    // Let's check AuthContext. 
    // For now, I will implement a placeholder that logs it, but the real fix needs to be in AuthContext probably.
    // Wait, the user said "profile isn't updating". The `user` object comes from `useAuth`.
    // So I need to update `useAuth`'s state. 
    // I will add `updateUser` to `AuthContext` instead of here, or bridge it.
    // Actually, let's look at AuthContext first before committing this implementation.
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
    addRoomMessage,
    updateRoom,
    deleteRoom,
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
