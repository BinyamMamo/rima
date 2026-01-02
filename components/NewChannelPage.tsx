import React, { useState } from 'react';
import { Project } from '../types';
import { Hash, Lock, PlusCircle } from "@phosphor-icons/react";

interface NewChannelPageProps {
  project: Project;
  onCreate: (title: string) => void;
}

const NewChannelPage: React.FC<NewChannelPageProps> = ({ project, onCreate }) => {
  const [title, setTitle] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  return (
    <div className="w-full max-w-lg px-6 flex flex-col gap-10 py-10 animate-fade-in">
      <div className="text-center space-y-2">
        <p className="text-zinc-500 font-light text-lg">Add a new line of communication to {project.title}</p>
      </div>

      <div className="space-y-8">
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Channel Name</label>
          <div className="relative">
            <Hash size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
            <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. surveys-log"
                className="w-full bg-[#141416] border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-zinc-800"
            />
          </div>
        </div>

        <div 
          onClick={() => setIsPrivate(!isPrivate)}
          className={`flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer ${isPrivate ? 'bg-amber-500/5 border-amber-500/20' : 'bg-[#141416] border-white/5'}`}
        >
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${isPrivate ? 'bg-amber-500 text-black' : 'bg-white/5 text-zinc-600'}`}>
                    <Lock size={20} weight={isPrivate ? "fill" : "regular"} />
                </div>
                <div>
                    <p className="text-sm font-bold text-white">Private Channel</p>
                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-tight">Only invited members can view</p>
                </div>
            </div>
            <div className={`w-10 h-5 rounded-full p-1 transition-colors ${isPrivate ? 'bg-amber-500' : 'bg-zinc-800'}`}>
                <div className={`w-3 h-3 bg-white rounded-full transition-transform ${isPrivate ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
        </div>

        <button 
          disabled={!title.trim()}
          onClick={() => onCreate(title)}
          className="w-full h-16 bg-stone-200 text-black rounded-3xl font-black text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-3 disabled:opacity-20 transition-all hover:bg-white active:scale-95 mt-6"
        >
          <PlusCircle size={20} weight="fill" />
          Create Channel
        </button>
      </div>
    </div>
  );
};

export default NewChannelPage;