'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { List, CaretLeft, Moon, Sun, User as UserIcon, Info, SignOut } from '@phosphor-icons/react';
import { useAuth, useUI } from '@/contexts';
import Background from '@/components/Background';
import Sidebar from '@/components/Sidebar';
import { Edit2Icon, Edit3Icon } from 'lucide-react';

export default function SettingsPage() {
  const { user, isLoading: authLoading, signOut } = useAuth();
  const { darkMode, toggleDarkMode } = useUI();
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/welcome');
    }
    if (user) {
      setDisplayName(user.name);
    }
  }, [user, authLoading, router]);

  const handleSaveName = () => {
    // TODO: Update user name in DataContext (Actual backend integration needed)
    setIsEditing(false);
  };

  const handleLogout = () => {
    signOut();
    router.push('/welcome');
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-app">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Background />

      <div className="relative z-10 h-screen flex flex-col overflow-hidden bg-app/50 backdrop-blur-sm">
        {/* Header */}
        <div className="flex-shrink-0 h-16 flex items-center justify-between px-4 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-3 -ml-2 rounded-full text-secondary hover:text-primary hover:bg-surface/50 transition-all shrink-0"
            >
              <CaretLeft size={24} weight="bold" />
            </button>
            <h1 className="text-xl font-branding font-bold text-primary leading-tight">
              Settings
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-8 scrollbar-hide pb-24">

          {/* Section: Profile */}
          <div className="space-y-4">
            {/* Profile Card */}
            <div className="flex flex-col items-center gap-4 py-6">
              <div className={`relative w-24 h-24 rounded-full ${user?.avatarColor || 'bg-[var(--primary)]'} flex items-center justify-center text-primary dark:text-white text-4xl font-bold shadow border-4 border-surface`}>
                {user?.name.slice(0, 2) || 'U'}
                <div className="absolute bottom-0 right-0 p-2 bg-surface rounded-full shadow-md border border-subtle text-primary cursor-pointer hover:scale-110 transition-transform">
                  <Edit3Icon size={16} weight="bold" />
                </div>
              </div>

              <div className="flex-1 min-w-0 w-full max-w-xs flex flex-col items-center gap-1">
                {isEditing ? (
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full text-center text-xl font-bold bg-transparent border-b-2 border-[var(--primary)] focus:outline-none text-primary pb-1"
                    autoFocus
                    onBlur={handleSaveName}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                  />
                ) : (
                  <h2
                    onClick={() => setIsEditing(true)}
                    className="text-2xl font-bold text-primary cursor-pointer hover:opacity-80 truncate w-full text-center"
                  >
                    {displayName}
                  </h2>
                )}
                <p className="text-secondary text-sm">{user?.email || 'No email'}</p>
              </div>
            </div>
          </div>

          {/* Section: Appearance (Theme Cards) */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-secondary uppercase tracking-wider px-1">Appearance</h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Light Mode Card */}
              <button
                onClick={() => !darkMode || toggleDarkMode()}
                className={`group relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 ${!darkMode ? 'border-[var(--primary)] bg-[var(--primary)]/5' : 'border-subtle bg-surface/50 hover:bg-surface/80'}`}
              >
                <div className="relative w-full aspect-video bg-gray-100 rounded-xl overflow-hidden shadow-inner border border-gray-200">
                  {/* UI Mockup Light */}
                  <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white shadow-sm" />
                  <div className="absolute top-2 right-2 w-16 h-2 rounded bg-white shadow-sm" />
                  <div className="absolute top-12 left-2 right-2 h-1 bg-gray-200 rounded" />
                  <div className="absolute top-14 left-2 right-8 h-1 bg-gray-200 rounded" />
                </div>
                <span className={`text-sm font-medium ${!darkMode ? 'text-[var(--primary)]' : 'text-secondary'}`}>Light</span>
                {!darkMode && <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-[var(--primary)] flex items-center justify-center text-white"><span className="block w-1.5 h-1.5 bg-white rounded-full" /></div>}
              </button>

              {/* Dark Mode Card */}
              <button
                onClick={() => darkMode || toggleDarkMode()}
                className={`group relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 ${darkMode ? 'border-[var(--primary)] bg-[var(--primary)]/5' : 'border-subtle bg-surface/50 hover:bg-surface/80'}`}
              >
                <div className="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-inner border border-gray-800">
                  {/* UI Mockup Dark */}
                  <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-gray-800 shadow-sm" />
                  <div className="absolute top-2 right-2 w-16 h-2 rounded bg-gray-800 shadow-sm" />
                  <div className="absolute top-12 left-2 right-2 h-1 bg-gray-800 rounded" />
                  <div className="absolute top-14 left-2 right-8 h-1 bg-gray-800 rounded" />
                </div>
                <span className={`text-sm font-medium ${darkMode ? 'text-[var(--primary)]' : 'text-secondary'}`}>Dark</span>
                {darkMode && <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-[var(--primary)] flex items-center justify-center text-white"><span className="block w-1.5 h-1.5 bg-white rounded-full" /></div>}
              </button>
            </div>
          </div>

          {/* Section: Settings List */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-secondary uppercase tracking-wider px-1">More</h3>
            <div className="bg-surface/30 backdrop-blur-md rounded-2xl overflow-hidden border border-subtle divide-y divide-subtle/50">

              {/* About Item */}
              <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-surface/50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg group-hover:scale-110 transition-transform">
                    <Info size={20} weight="fill" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary">About RIMA</p>
                    <p className="text-xs text-secondary">Version 1.0.0</p>
                  </div>
                </div>
                <CaretLeft size={16} className="rotate-180 text-secondary" weight="bold" />
              </div>

              {/* Sign Out Item */}
              <button
                onClick={handleLogout}
                className="w-full p-4 flex items-center justify-between cursor-pointer hover:bg-rose-500/5 transition-colors group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-500/10 text-rose-500 rounded-lg group-hover:scale-110 transition-transform">
                    <SignOut size={20} weight="fill" />
                  </div>
                  <span className="text-sm font-medium text-rose-500">Log Out</span>
                </div>
              </button>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}
