'use client';

import React, { useState } from 'react';
import { X, House, PlusCircle, CaretRight, Folders, Briefcase, User, GraduationCap, UsersThree, Lock, Plus, Hash, Sun, Moon, Gear } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import Logo from './Logo';
import { Workspace } from '@/types';
import { PROFILES } from '@/constants';
import { useWorkspaceData, useAuth, useTheme } from '@/contexts';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentWorkspaceId?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentWorkspaceId,
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { workspaces, activeProfileId, setActiveProfileId, profiles } = useWorkspaceData();
  const [expandedWorkspaces, setExpandedWorkspaces] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    if (currentWorkspaceId) initial.add(currentWorkspaceId);
    return initial;
  });

  // Effect to ensure current workspace is always expanded when navigating
  React.useEffect(() => {
    if (currentWorkspaceId) {
      setExpandedWorkspaces(prev => {
        const next = new Set(prev);
        next.add(currentWorkspaceId);
        return next;
      });
    }
  }, [currentWorkspaceId]);

  if (!isOpen) return null;

  const toggleExpand = (id: string) => {
    const next = new Set(expandedWorkspaces);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedWorkspaces(next);
  };

  const filteredWorkspaces = activeProfileId === 'all'
    ? workspaces
    : workspaces.filter(p => p.profileId === activeProfileId);

  const rootWorkspaces = filteredWorkspaces.filter(p => !p.parentRoomId);

  const getProfileIcon = (id: string) => {
    switch (id) {
      case 'p_work': return <Briefcase size={16} weight="bold" />;
      case 'p_life': return <User size={16} weight="bold" />;
      case 'p_edu': return <GraduationCap size={16} weight="bold" />;
      default: return <Folders size={16} weight="bold" />;
    }
  };

  const renderWorkspaceItem = (workspace: Workspace, depth: number = 0) => {
    const isActive = currentWorkspaceId === workspace.id;
    // Flat hierarchy: Workspaces contain Rooms.
    const isExpanded = expandedWorkspaces.has(workspace.id);

    return (
      <div key={workspace.id} className="animate-fade-in mb-3">
        <div
          className={`flex items-center gap-2 group cursor-pointer transition-all duration-200 rounded-2xl px-3 py-3 ${isActive
            ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20'
            : 'text-[var(--text-secondary)] hover:bg-[var(--border-subtle)] hover:text-[var(--text-primary)]'
            }`}
          style={{ marginLeft: depth * 12 }}
          onClick={() => {
            // Clicking workspace title toggles expand/collapse
            toggleExpand(workspace.id);
            // Navigate to workspace
            router.push(`/workspace/${workspace.id}`);
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); toggleExpand(workspace.id); }}
            className="p-1 hover:bg-white/10 rounded-md transition-transform duration-300"
            style={{ transform: isExpanded ? 'rotate(90deg)' : 'none' }}>
            <CaretRight size={14} weight="bold" />
          </button>

          <span className={`text-sm ${isActive ? 'font-bold' : 'font-semibold'} truncate flex-1`}>
            {workspace.title}
          </span>
        </div>

        {isExpanded && (
          <div className="border-l-2 border-[var(--border-subtle)] ml-5 pl-2 mt-1 space-y-0.5">
            {workspace.rooms.map(room => {
              const isPrivate = room.isPrivate;

              return (
                <button
                  key={room.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Fix: Use correct nested route structure
                    router.push(`/workspace/${workspace.id}/room/${room.id}`);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all group ${
                    // Check if this room is active
                    window.location.pathname.includes(`/room/${room.id}`)
                      ? 'bg-[var(--primary)] text-white font-bold shadow-md'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]'
                    }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {isPrivate ? (
                      <Lock size={14} weight="fill" className="opacity-70 shrink-0" />
                    ) : (
                      <Hash size={14} weight="regular" className="opacity-70 shrink-0" />
                    )}
                    <span className="truncate">{room.title}</span>
                  </div>

                  {(room.unreadCount && room.unreadCount > 0) ? (
                    <span className="min-w-[1.25rem] h-5 px-1 rounded-full bg-[var(--primary)] text-white text-[10px] font-bold flex items-center justify-center">
                      {room.unreadCount}
                    </span>
                  ) : null}
                </button>
              );
            })}

            {/* Add Room Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/create-room?workspaceId=${workspace.id}`);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all"
            >
              <Plus size={14} />
              <span>Add Room...</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] animate-fade-in" onClick={onClose} />

      <div className="fixed top-0 left-0 h-full w-80 bg-[var(--bg-sidebar)] z-[70] shadow-2xl animate-slide-in flex flex-col font-sans border-r border-[var(--border-subtle)]">
        {/* Header with Brand Logo */}
        <div className="h-24 flex items-center justify-between px-6 pt-2">
          <div
            className="flex items-center gap-4 group cursor-pointer"
            onClick={() => {
              router.push('/dashboard');
              onClose();
            }}
          >
            <Logo size={44} className="group-hover:rotate-12 transition-transform" />
            <span className="text-xl font-branding font-black tracking-tight text-[var(--text-primary)]">
              RIMA
            </span>
          </div>
          <button onClick={onClose} className="p-2 text-[var(--text-secondary)] hover:bg-[var(--border-subtle)] rounded-xl transition-colors">
            <X size={24} weight="bold" />
          </button>
        </div>

        {/* Global Navigation */}
        <div className="px-4 py-2 flex flex-col gap-1">
          <button
            onClick={() => {
              router.push('/dashboard');
              onClose();
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all text-[var(--text-secondary)] hover:bg-[var(--bg-app)]"
          >
            <House size={20} weight="bold" />
            <span>Home</span>
          </button>
          <button
            onClick={() => {
              router.push('/people');
              onClose();
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all text-[var(--text-secondary)] hover:bg-[var(--bg-app)]"
          >
            <UsersThree size={20} weight="bold" />
            <span>People</span>
          </button>
        </div>

        {/* Profile Filter "Chips" */}
        <div className="px-6 py-4 flex gap-2 overflow-x-auto scrollbar-hide">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              onClick={() => setActiveProfileId(profile.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-xs font-bold transition-all ${activeProfileId === profile.id
                ? 'bg-[var(--primary)] text-white shadow-md'
                : 'bg-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--text-muted)] hover:text-white'
                }`}
            >
              {getProfileIcon(profile.id)}
              {profile.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 scrollbar-hide">
          <div className="space-y-4">
            <div className="px-4 flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Workspaces</span>
              <button
                onClick={() => {
                  router.push('/create-workspace');
                  onClose();
                }}
                className="text-[var(--primary)] hover:scale-110 transition-transform"
                title="Create Workspace"
              >
                <PlusCircle size={18} weight="fill" />
              </button>
            </div>
            <div className="space-y-1">
              {rootWorkspaces.length > 0 ? rootWorkspaces.map(workspace => renderWorkspaceItem(workspace)) : (
                <div className="px-4 py-10 text-center space-y-2 opacity-40">
                  <Folders size={32} className="mx-auto" />
                  <p className="text-xs font-bold">No workspaces found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Settings */}
        <div className="p-6 border-t border-[var(--border-subtle)]">
          <div className="flex items-center justify-between p-4 rounded-3xl bg-[var(--bg-app)] border border-[var(--border-subtle)]">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl bg-zinc-200 text-black flex items-center justify-center font-bold relative`}>
                {user?.name?.[0]?.toUpperCase() || 'U'}
                <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[var(--bg-app)] bg-[#3ECF8E]" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[var(--text-primary)]">{user?.name || 'User'}</span>
                <span className="text-[10px] text-[var(--primary)] font-black uppercase tracking-widest">{(user as any)?.role || 'Member'}</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--primary)] hover:text-white transition-all"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Moon size={20} weight="fill" /> : <Sun size={20} weight="fill" />}
              </button>
              <button
                onClick={() => {
                  router.push('/settings');
                  onClose();
                }}
                className="p-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--primary)] hover:text-white transition-all"
                title="Settings"
              >
                <Gear size={20} weight="fill" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
