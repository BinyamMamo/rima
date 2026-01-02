'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // No user logged in - redirect to welcome
        router.push('/welcome');
      } else {
        // User is logged in - redirect to dashboard
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, router]);

  // Loading state
  return (
    <div className="flex items-center justify-center h-screen bg-app">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-secondary font-branding text-lg">Loading RIMA...</p>
      </div>
    </div>
  );
}
