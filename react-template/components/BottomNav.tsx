import React from 'react';
import { Home, Calendar, CheckSquare, Settings, Plus } from 'lucide-react';

const BottomNav: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-slate-900/80 backdrop-blur-md border-t border-slate-800 flex items-center justify-around px-4 z-50 pb-2">
      <button className="flex flex-col items-center justify-center text-cyan-400 transition-colors">
        <Home size={26} strokeWidth={2.5} />
      </button>
      
      <button className="flex flex-col items-center justify-center text-slate-500 hover:text-slate-300 transition-colors">
        <Calendar size={26} strokeWidth={2} />
      </button>

      {/* Floating Action Button for Add */}
      <button className="relative -top-5 bg-gradient-to-b from-cyan-300 to-cyan-600 w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.5)] border-4 border-slate-900 hover:scale-105 transition-transform">
        <Plus size={32} color="white" strokeWidth={3} />
      </button>

      <button className="flex flex-col items-center justify-center text-slate-500 hover:text-slate-300 transition-colors">
        <CheckSquare size={26} strokeWidth={2} />
      </button>

      <button className="flex flex-col items-center justify-center text-slate-500 hover:text-slate-300 transition-colors">
        <Settings size={26} strokeWidth={2} />
      </button>
    </div>
  );
};

export default BottomNav;
