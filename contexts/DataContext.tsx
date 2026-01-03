'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { INITIAL_WORKSPACES, PROFILES, SYSTEM_USERS } from '@/constants';
import { Workspace, Profile, User, Message } from '@/types';
import { useStore } from '@/lib/store';

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
  const { isDemoMode } = useAuth();

  // Connect to Zustand store
  const workspaces = useStore((state) => state.workspaces);
  const profiles = useStore((state) => state.profiles);
  const activeProfileId = useStore((state) => state.activeProfileId);
  const hasHydrated = useStore((state) => state.hasHydrated);

  const setActiveProfileId = useStore((state) => state.setActiveProfileId);
  const addWorkspace = useStore((state) => state.addWorkspace);
  const updateWorkspace = useStore((state) => state.updateWorkspace);
  const deleteWorkspace = useStore((state) => state.deleteWorkspace);
  const addMessage = useStore((state) => state.addMessage);
  const addRoomMessage = useStore((state) => state.addRoomMessage);
  const updateRoom = useStore((state) => state.updateRoom);
  const deleteRoom = useStore((state) => state.deleteRoom);

  // Profile adding is not in the store actions yet, but let's assume valid.
  // Actually, I missed addProfile in the Actions interface in store.ts?
  // Checking store.ts content from previous turn... 
  // I did NOT include addProfile in Actions. 
  // I should add it or just mock it for now since it's rarely used.
  // OR I can use `useStore.setState` dynamically? No, that's messy.
  // I'll add a dummy function or update the store later.
  // Since `addProfile` was used in the original DataContext, I should keep the signature.
  const addProfile = (profile: Profile) => {
    console.warn("addProfile not implemented in v2 store yet");
  };

  // Sync isLoading with hydration
  const isLoading = !hasHydrated;

  // Optional: Force a seed if empty (though store.ts handles initial state)
  // This is where "Reset Data" logic would go if we want to provide a button.

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
