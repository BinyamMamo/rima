import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { Workspace, Profile, User, Message } from '@/types';
import { INITIAL_WORKSPACES, PROFILES, SYSTEM_USERS } from '@/constants';

interface State {
    workspaces: Workspace[];
    profiles: Profile[];
    user: User | null; // Placeholder for future auth sync
    activeProfileId: string;
    hasHydrated: boolean;
}

interface Actions {
    setHasHydrated: (state: boolean) => void;
    setActiveProfileId: (id: string) => void;
    addWorkspace: (workspace: Workspace) => void;
    updateWorkspace: (id: string, updates: Partial<Workspace>) => void;
    deleteWorkspace: (id: string) => void;
    addMessage: (workspaceId: string, message: Message) => void;
    addRoomMessage: (workspaceId: string, roomId: string, message: Message) => void;
    updateRoom: (workspaceId: string, roomId: string, updates: Partial<any>) => void;
    deleteRoom: (workspaceId: string, roomId: string) => void;
    // Task management
    setWorkspaceTasks: (workspaceId: string, tasks: any[]) => void;
    updateTaskStatus: (workspaceId: string, taskId: string, completed: boolean) => void;
    resetData: () => void;
}

export const useStore = create<State & Actions>()(
    persist(
        immer((set) => ({
            workspaces: INITIAL_WORKSPACES,
            profiles: PROFILES,
            user: null,
            activeProfileId: 'all',
            hasHydrated: false,

            setHasHydrated: (state) => set({ hasHydrated: state }),

            setActiveProfileId: (id) => set({ activeProfileId: id }),

            addWorkspace: (workspace) =>
                set((state) => {
                    state.workspaces.push(workspace);
                }),

            updateWorkspace: (id, updates) =>
                set((state) => {
                    const index = state.workspaces.findIndex((w) => w.id === id);
                    if (index !== -1) {
                        state.workspaces[index] = { ...state.workspaces[index], ...updates };
                    }
                }),

            deleteWorkspace: (id) =>
                set((state) => {
                    state.workspaces = state.workspaces.filter((w) => w.id !== id);
                }),

            addMessage: (workspaceId, message) =>
                set((state) => {
                    const workspace = state.workspaces.find((w) => w.id === workspaceId);
                    if (workspace) {
                        workspace.messages.push(message);
                    }
                }),

            addRoomMessage: (workspaceId, roomId, message) =>
                set((state) => {
                    const workspace = state.workspaces.find((w) => w.id === workspaceId);
                    if (workspace) {
                        const room = workspace.rooms.find((r) => r.id === roomId);
                        if (room) {
                            room.messages.push(message);
                        }
                    }
                }),

            updateRoom: (workspaceId, roomId, updates) =>
                set((state) => {
                    const workspace = state.workspaces.find((w) => w.id === workspaceId);
                    if (workspace) {
                        const roomIndex = workspace.rooms.findIndex((r) => r.id === roomId);
                        if (roomIndex !== -1) {
                            workspace.rooms[roomIndex] = { ...workspace.rooms[roomIndex], ...updates };
                        }
                    }
                }),

            deleteRoom: (workspaceId, roomId) =>
                set((state) => {
                    const workspace = state.workspaces.find((w) => w.id === workspaceId);
                    if (workspace) {
                        workspace.rooms = workspace.rooms.filter((r) => r.id !== roomId);
                    }
                }),

            setWorkspaceTasks: (workspaceId, tasks) =>
                set((state) => {
                    const workspace = state.workspaces.find((w) => w.id === workspaceId);
                    if (workspace) {
                        // Merge logic: Only add if not exists, but here we might overwrite or intelligent merge?
                        // For simplicity: If tasks array is empty, populate. If not, merge by ID or keep existing status.
                        // Actually, dashboard pushes *current* extracted tasks. We want to preserve `completed` status of existing ones.

                        const existingTasks = workspace.tasks || [];
                        const mergedTasks = tasks.map(newTask => {
                            const existing = existingTasks.find(t => t.id === newTask.id);
                            return existing ? { ...newTask, completed: existing.completed } : newTask;
                        });
                        workspace.tasks = mergedTasks;
                    }
                }),

            updateTaskStatus: (workspaceId, taskId, completed) =>
                set((state) => {
                    const workspace = state.workspaces.find((w) => w.id === workspaceId);
                    if (workspace) {
                        const task = workspace.tasks?.find(t => t.id === taskId);
                        if (task) {
                            task.completed = completed;
                        }
                    }
                }),

            resetData: () => set({ workspaces: INITIAL_WORKSPACES, profiles: PROFILES })
        })),
        {
            name: 'rima-storage-v7', // Increment version to trigger migration logic
            version: 7,
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);
