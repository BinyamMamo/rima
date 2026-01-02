'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { INITIAL_PROJECTS, PROFILES, SYSTEM_USERS } from '@/constants';
import { Project, Profile, User, Message } from '@/types';

interface DataContextType {
  projects: Project[];
  profiles: Profile[];
  systemUsers: User[];
  activeProfileId: string;
  setActiveProfileId: (id: string) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addMessage: (projectId: string, message: Message) => void;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROJECTS: 'rima_demo_projects',
  ACTIVE_PROFILE: 'rima_active_profile',
} as const;

export function DataProvider({ children }: { children: ReactNode }) {
  const { isDemoMode, user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
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
          const storedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
          const storedProfile = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE);

          if (storedProjects) {
            setProjects(JSON.parse(storedProjects));
          } else {
            // First time in demo mode - initialize with mock data
            setProjects(INITIAL_PROJECTS);
            localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
          }

          if (storedProfile) {
            setActiveProfileIdState(storedProfile);
          }
        } else {
          // REAL MODE: Fetch from Firebase (placeholder for Phase 4)
          // TODO: Implement Firebase Firestore queries
          // For now, return empty array
          setProjects([]);
        }
      } catch (error) {
        console.error('Error initializing data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [isDemoMode, user]);

  // Persist projects to localStorage in demo mode whenever they change
  useEffect(() => {
    if (isDemoMode && projects.length > 0) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    }
  }, [projects, isDemoMode]);

  const setActiveProfileId = (id: string) => {
    setActiveProfileIdState(id);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE, id);
  };

  const addProject = (project: Project) => {
    if (isDemoMode) {
      const newProjects = [...projects, project];
      setProjects(newProjects);
    } else {
      // TODO: Add to Firebase
      console.log('TODO: Add project to Firebase', project);
    }
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    if (isDemoMode) {
      const updatedProjects = projects.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      );
      setProjects(updatedProjects);
    } else {
      // TODO: Update in Firebase
      console.log('TODO: Update project in Firebase', id, updates);
    }
  };

  const deleteProject = (id: string) => {
    if (isDemoMode) {
      const filteredProjects = projects.filter((p) => p.id !== id);
      setProjects(filteredProjects);
    } else {
      // TODO: Delete from Firebase
      console.log('TODO: Delete project from Firebase', id);
    }
  };

  const addMessage = (projectId: string, message: Message) => {
    if (isDemoMode) {
      const updatedProjects = projects.map((p) =>
        p.id === projectId
          ? { ...p, messages: [...p.messages, message] }
          : p
      );
      setProjects(updatedProjects);
    } else {
      // TODO: Add message to Firebase
      console.log('TODO: Add message to Firebase', projectId, message);
    }
  };

  const value: DataContextType = {
    projects,
    profiles: PROFILES,
    systemUsers: SYSTEM_USERS,
    activeProfileId,
    setActiveProfileId,
    addProject,
    updateProject,
    deleteProject,
    addMessage,
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
