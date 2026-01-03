
import React, { useState } from 'react';
import { X, House, PlusCircle, Gear, CaretDown, CaretRight, Hash, Folders, Briefcase, User, GraduationCap, UsersThree } from "@phosphor-icons/react";
import { ViewType, Project, Profile } from '../types';
import { PROFILES } from '../constants';
import Logo from './Logo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  projects: Project[];
  activeProfileId: string;
  onProfileChange: (id: string) => void;
  onCreateProject: () => void;
  onCreateChannel: (projectId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, onClose, currentView, onNavigate, projects, activeProfileId, onProfileChange, onCreateProject, onCreateChannel 
}) => {
  const [expandedRooms, setExpandedRooms] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const toggleExpand = (id: string) => {
    const next = new Set(expandedRooms);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedRooms(next);
  };

  const filteredProjects = activeProfileId === 'all' 
    ? projects 
    : projects.filter(p => p.profileId === activeProfileId);

  const rootProjects = filteredProjects.filter(p => !p.parentRoomId);

  const getProfileIcon = (id: string) => {
    switch (id) {
      case 'p_work': return <Briefcase size={16} weight="bold" />;
      case 'p_life': return <User size={16} weight="bold" />;
      case 'p_edu': return <GraduationCap size={16} weight="bold" />;
      default: return <Folders size={16} weight="bold" />;
    }
  };

  const renderProjectItem = (project: Project, depth: number = 0) => {
    const isActive = currentView.projectId === project.id;
    const children = filteredProjects.filter(p => p.parentRoomId === project.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedRooms.has(project.id);

    return (
      <div key={project.id} className="animate-fade-in">
        <div 
          className={`flex items-center gap-2 group cursor-pointer transition-all duration-200 rounded-2xl px-3 py-3 mb-1 ${
            isActive 
              ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20' 
              : 'text-[var(--text-secondary)] hover:bg-[var(--border-subtle)] hover:text-[var(--text-primary)]'
          }`}
          style={{ marginLeft: depth * 12 }}
          onClick={() => { onNavigate({ type: 'project', projectId: project.id }); onClose(); }}
        >
          {hasChildren ? (
            <button 
              onClick={(e) => { e.stopPropagation(); toggleExpand(project.id); }}
              className="p-1 hover:bg-white/10 rounded-md transition-transform duration-300"
              style={{ transform: isExpanded ? 'rotate(90deg)' : 'none' }}
            >
              <CaretRight size={14} weight="bold" />
            </button>
          ) : (
            <div className="w-5" />
          )}
          <span className={`text-sm ${isActive ? 'font-bold' : 'font-semibold'} truncate flex-1`}>
            {project.title}
          </span>
          <button 
            onClick={(e) => { e.stopPropagation(); onCreateChannel(project.id); }}
            className={`opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-opacity ${isActive ? 'hover:bg-white/20' : 'hover:bg-[var(--bg-app)]'}`}
          >
            <PlusCircle size={14} weight="bold" />
          </button>
        </div>

        {hasChildren && isExpanded && (
          <div className="border-l-2 border-[var(--border-subtle)] ml-4 pl-1">
            {children.map(child => renderProjectItem(child, depth + 1))}
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
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => { onNavigate({ type: 'home' }); onClose(); }}>
             <Logo size={44} className="group-hover:rotate-12" />
             <span className="text-xl font-branding font-black tracking-tight text-[var(--text-primary)]">RIMA</span>
          </div>
          <button onClick={onClose} className="p-2 text-[var(--text-secondary)] hover:bg-[var(--border-subtle)] rounded-xl transition-colors">
            <X size={24} weight="bold" />
          </button>
        </div>

        {/* Global Navigation */}
        <div className="px-4 py-2 flex flex-col gap-1">
          <button 
            onClick={() => { onNavigate({ type: 'home' }); onClose(); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${currentView.type === 'home' ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-app)]'}`}
          >
            <House size={20} weight="bold" />
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => { onNavigate({ type: 'people' }); onClose(); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${currentView.type === 'people' ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-app)]'}`}
          >
            <UsersThree size={20} weight="bold" />
            <span>People</span>
          </button>
        </div>

        {/* Profile Filter "Chips" */}
        <div className="px-6 py-4 flex gap-2 overflow-x-auto scrollbar-hide">
          {PROFILES.map(profile => (
            <button
              key={profile.id}
              onClick={() => onProfileChange(profile.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-xs font-bold transition-all ${
                activeProfileId === profile.id 
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
                <button onClick={onCreateProject} className="text-[var(--primary)] hover:scale-110 transition-transform">
                  <PlusCircle size={18} weight="fill" />
                </button>
            </div>
            <div className="space-y-1">
              {rootProjects.length > 0 ? rootProjects.map(project => renderProjectItem(project)) : (
                <div className="px-4 py-10 text-center space-y-2 opacity-40">
                  <Folders size={32} className="mx-auto" />
                  <p className="text-xs font-bold">No rooms matching filter</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Settings */}
        <div className="p-6 border-t border-[var(--border-subtle)]">
            <div className="flex items-center justify-between p-4 rounded-3xl bg-[var(--bg-app)] border border-[var(--border-subtle)] shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[var(--highlight)] flex items-center justify-center text-white font-bold shadow-lg shadow-[var(--highlight)]/20">S</div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-[var(--text-primary)]">Sara</span>
                        <span className="text-[10px] text-[var(--primary)] font-black uppercase tracking-widest">Admin</span>
                    </div>
                </div>
                <button 
                  onClick={() => { onNavigate({ type: 'settings' }); onClose(); }} 
                  className="p-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--primary)] hover:text-white transition-all"
                >
                    <Gear size={24} weight="bold" />
                </button>
            </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
