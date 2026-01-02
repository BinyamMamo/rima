
import React, { useState } from 'react';
import { Project, Insight, Task } from '../types';
import { Wallet, HourglassMedium, ChartPieSlice, Hash, CaretRight, Sparkle, PlusCircle, Files, WarningCircle, CheckCircle, Receipt, ArrowSquareOut, ChartLineUp, ShieldCheck } from "@phosphor-icons/react";

interface WorkspaceDashboardProps {
  project: Project;
  onNavigateToChannel: (channelId: string) => void;
  onNavigateToRoom?: (projectId: string) => void; // New prop for sub-rooms
  onNewChannel: () => void;
  onGenerateReport: () => Promise<string | undefined>;
  projects?: Project[]; // All projects to find sub-rooms
}

const WorkspaceDashboard: React.FC<WorkspaceDashboardProps> = ({ 
  project, onNavigateToChannel, onNavigateToRoom, onNewChannel, onGenerateReport, projects = [] 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  // Find children of this room
  const subRooms = projects.filter(p => p.parentRoomId === project.id);

  const handleReport = async () => {
    setIsGenerating(true);
    const reportText = await onGenerateReport();
    if (reportText) {
      navigator.clipboard.writeText(reportText);
      alert('Rima intelligence report copied to clipboard!');
    }
    setIsGenerating(false);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[var(--bg-app)] animate-fade-in overflow-y-auto scrollbar-hide pb-32">
      <div className="w-full max-w-2xl mx-auto px-6 py-10 space-y-10">
        
        {/* Header Summary */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">Overview</h2>
            <button 
              onClick={handleReport}
              disabled={isGenerating}
              className="flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[var(--primary)]/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Files size={18} weight="fill" />
              )}
              {isGenerating ? 'Synthesizing...' : 'Generate Report'}
            </button>
          </div>
          <p className="text-sm text-[var(--text-secondary)] font-medium max-w-2xl leading-relaxed">{project.description}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <StatCard icon={<Wallet size={20} className="text-[var(--primary)]" />} label="Budget" value={project.budget || 'N/A'} />
          <StatCard icon={<HourglassMedium size={20} className="text-[var(--highlight)]" />} label="Deadline" value={project.deadline || 'Ongoing'} />
          <StatCard icon={<ChartLineUp size={20} className="text-[var(--secondary)]" />} label="Progress" value={`${project.progress}%`} />
        </div>

        {/* Rima Insights Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Sparkle size={18} weight="fill" className="text-amber-500" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Rima Smart Insights</h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {project.insights?.map((insight, idx) => (
              <div key={idx} className={`flex items-center gap-4 p-5 bg-[var(--bg-card)] border rounded-3xl shadow-sm animate-slide-up ${insight.text.includes('Roll-up') ? 'border-amber-500/30' : 'border-[var(--border-subtle)]'}`} style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="w-12 h-12 rounded-2xl bg-[var(--bg-surface)] flex items-center justify-center text-2xl">
                  {insight.icon}
                </div>
                <div className="flex-1">
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${getInsightColor(insight.category)} mb-1 inline-block`}>
                    {insight.category}
                  </span>
                  <p className="text-sm font-bold text-[var(--text-primary)]">{insight.text}</p>
                </div>
              </div>
            )) || (
              <div className="p-10 text-center opacity-40">
                <Sparkle size={32} className="mx-auto mb-2" />
                <p className="text-xs font-bold uppercase tracking-widest">Collecting data for insights...</p>
              </div>
            )}
          </div>
        </div>

        {/* Sub-rooms Section (Enterprise Focus) */}
        {subRooms.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Sub-Rooms & Scopes</h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {subRooms.map(room => (
                <button 
                  key={room.id}
                  onClick={() => onNavigateToRoom?.(room.id)}
                  className="flex items-center justify-between p-5 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--primary)] hover:shadow-lg transition-all group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-[var(--bg-surface)] flex items-center justify-center text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all">
                      <ShieldCheck size={22} weight="fill" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--text-primary)]">{room.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-12 h-1 bg-[var(--border-subtle)] rounded-full overflow-hidden">
                          <div className="h-full bg-[var(--primary)]" style={{ width: `${room.progress}%` }} />
                        </div>
                        <p className="text-[9px] text-[var(--text-muted)] uppercase font-black tracking-tighter">{room.progress}% Complete</p>
                      </div>
                    </div>
                  </div>
                  <CaretRight size={16} className="text-[var(--text-muted)]" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Finance / Spending Section */}
        {project.spending && project.spending.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <Receipt size={18} weight="fill" className="text-[var(--primary)]" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Finance & Spending</h3>
            </div>
            <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm space-y-4">
              {project.spending.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-[var(--border-subtle)] last:border-0">
                  <span className="text-sm font-medium text-[var(--text-secondary)]">{item.category}</span>
                  <span className="text-sm font-black text-[var(--text-primary)]">{item.amount}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress & Tasks Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <CheckCircle size={18} weight="fill" className="text-[var(--highlight)]" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Active Tasks</h3>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {project.tasks?.map((task, idx) => (
              <div key={task.id} className="flex items-center justify-between p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl group hover:border-[var(--primary)] transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-[var(--highlight)] border-[var(--highlight)] text-white' : 'border-[var(--border-subtle)] group-hover:border-[var(--primary)]'}`}>
                    {task.completed && <CheckCircle size={14} weight="bold" />}
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${task.completed ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text-primary)]'}`}>{task.title}</p>
                    <p className="text-[9px] font-black uppercase tracking-tight text-[var(--text-muted)]">{task.owner} • Due {task.dueDate}</p>
                  </div>
                </div>
                <ArrowSquareOut size={16} className="text-[var(--text-muted)]" />
              </div>
            )) || (
              <p className="text-xs text-[var(--text-muted)] text-center py-4">No tasks tracked in this workspace yet.</p>
            )}
          </div>
        </div>

        {/* Channels Section */}
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Channels</h3>
                <button 
                  onClick={onNewChannel}
                  className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[var(--primary)] hover:scale-110 transition-transform"
                >
                  <PlusCircle size={14} weight="bold" />
                  Add
                </button>
            </div>
            <div className="grid grid-cols-1 gap-3">
                {project.channels.map(channel => (
                    <button 
                      key={channel.id}
                      onClick={() => onNavigateToChannel(channel.id)}
                      className="flex items-center justify-between p-5 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:shadow-lg transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-[var(--bg-surface)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--primary)] transition-colors">
                               <Hash size={20} />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold text-[var(--text-primary)]">{channel.title}</p>
                                <p className="text-[10px] text-[var(--text-muted)] uppercase font-black tracking-tight">{channel.members.length} Members</p>
                            </div>
                        </div>
                        <CaretRight size={16} className="text-[var(--text-muted)]" />
                    </button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string; value: string }> = ({ icon, label, value }) => (
  <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm flex flex-col items-center justify-center text-center space-y-2">
    <div className="p-3 rounded-2xl bg-[var(--bg-surface)]">{icon}</div>
    <div className="text-lg font-black tracking-tight text-[var(--text-primary)]">{value}</div>
    <div className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">{label}</div>
  </div>
);

function getInsightColor(cat: Insight['category']) {
  switch (cat) {
    case 'finance': return 'bg-amber-100 text-amber-600';
    case 'risk': return 'bg-rose-100 text-rose-600';
    case 'planning': return 'bg-sky-100 text-sky-600';
    case 'social': return 'bg-emerald-100 text-emerald-600';
    default: return 'bg-zinc-100 text-zinc-600';
  }
}

export default WorkspaceDashboard;
