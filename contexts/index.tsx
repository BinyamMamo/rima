'use client';

import { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { DataProvider } from './DataContext';
import { ThemeProvider } from './ThemeContext';
import { UIProvider } from './UIContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <UIProvider>
        <AuthProvider>
          <DataProvider>
            {children}
          </DataProvider>
        </AuthProvider>
      </UIProvider>
    </ThemeProvider>
  );
}

export { useAuth } from './AuthContext';
export { useWorkspaceData } from './DataContext';
export { useUI } from './UIContext';
export { useTheme } from './ThemeContext';
