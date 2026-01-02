
import React from 'react';
import { AppleLogo, GoogleLogo, EnvelopeSimple, Sun, Moon } from "@phosphor-icons/react";
import Logo from './Logo.tsx';

interface WelcomePageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  darkMode: boolean;
  onToggleTheme: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onGetStarted, onLogin, darkMode, onToggleTheme }) => {
  return (
    <div className="w-full h-full flex flex-col items-center bg-[var(--bg-auth)] relative transition-colors duration-300 overflow-y-auto scrollbar-hide">
      {/* Theme Toggle Button - Top Right */}
      <button 
        onClick={onToggleTheme}
        className="absolute top-6 right-6 p-2.5 rounded-full bg-[var(--bg-surface)] text-[var(--text-primary)] hover:scale-110 active:scale-95 transition-all z-50 shadow-sm border border-[var(--border-subtle)]"
      >
        {darkMode ? <Sun size={20} weight="bold" /> : <Moon size={20} weight="bold" />}
      </button>

      {/* Branding Section - Logo center at 22-25% height */}
      <div className="flex-shrink-0 flex flex-col items-center pt-[22vh] text-center px-10 mb-8 w-full">
        <div className="animate-fade-in flex justify-center">
           <Logo />
        </div>
        
        {/* Spacing: 32px logo -> headline; 14px headline -> subtext */}
        <div className="mt-[32px] animate-slide-up" style={{ animationDelay: '100ms' }}>
          <h2 className="text-[26px] md:text-[28px] font-semibold leading-[1.3] text-[var(--text-primary)]">
            Welcome to RIMA
          </h2>
          <p className="mt-[14px] text-[15px] md:text-[16px] text-[var(--text-secondary)] font-normal max-w-[340px] mx-auto leading-relaxed">
            Join RIMA and turn everyday conversations into clarity.
          </p>
        </div>
      </div>

      {/* Button Stack */}
      <div className="w-full max-w-[380px] px-8 pb-20 flex flex-col gap-4 animate-slide-up mt-6" style={{ animationDelay: '200ms' }}>
        <AuthButton icon={<AppleLogo weight="fill" size={24} />} label="Continue with Apple" />
        <AuthButton icon={<GoogleLogo weight="bold" size={24} className="text-[#EA4335]" />} label="Continue with Google" />
        <AuthButton 
          icon={<EnvelopeSimple weight="bold" size={24} />} 
          label="Sign up with email" 
          onClick={onGetStarted}
        />
        
        <div className="flex items-center py-2">
          <div className="flex-grow border-t border-[#E5E7EB] dark:border-white/10"></div>
          <span className="mx-4 text-[13px] font-medium uppercase tracking-[0.2em] text-[#9CA3AF]">OR</span>
          <div className="flex-grow border-t border-[#E5E7EB] dark:border-white/10"></div>
        </div>

        <button 
          onClick={onLogin}
          className="w-full h-[56px] rounded-[20px] bg-[#6C30FF] text-white font-semibold text-base transition-all hover:brightness-110 hover:translate-y-[-2px] active:scale-95 shadow-lg shadow-[#6C30FF]/15"
        >
          Log in
        </button>

        <div className="pt-2 text-center">
          <p className="text-[15px] text-[var(--text-secondary)]">
            Don't have an account?{' '}
            <button onClick={onGetStarted} className="text-[#6C30FF] font-semibold hover:underline">
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const AuthButton: React.FC<{ icon: React.ReactNode; label: string; onClick?: () => void }> = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full h-[56px] bg-[var(--btn-social-bg)] text-[var(--btn-social-text)] border border-[#E5E7EB] dark:border-white/10 rounded-[20px] flex items-center justify-center gap-3 font-semibold transition-all hover:brightness-95 active:scale-95 shadow-sm"
  >
    {icon}
    <span className="text-[15px]">{label}</span>
  </button>
);

export default WelcomePage;
