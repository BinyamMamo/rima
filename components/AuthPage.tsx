
import React, { useState } from 'react';
import { AppleLogo, GoogleLogo, CaretLeft, Sun, Moon, Eye, EyeSlash } from "@phosphor-icons/react";
import Logo from './Logo.tsx';

interface AuthPageProps {
  type: 'login' | 'signup';
  onSuccess: () => void;
  onToggle: () => void;
  onBack: () => void;
  darkMode: boolean;
  onToggleTheme: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ type, onSuccess, onToggle, onBack, darkMode, onToggleTheme }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const isLogin = type === 'login';

  const canContinue = isLogin 
    ? email.includes('@') && email.length > 3
    : email.includes('@') && name.length > 1 && password.length > 5 && acceptedTerms;

  return (
    <div className="w-full h-full flex flex-col bg-[var(--bg-auth)] relative transition-colors duration-300 animate-fade-in overflow-y-auto scrollbar-hide">
      {/* Top Header Navigation */}
      <div className="flex-shrink-0 p-6 flex items-center justify-between sticky top-0 z-50 bg-[var(--bg-auth)]/80 backdrop-blur-md">
        <button onClick={onBack} className="p-2 text-[var(--text-secondary)] hover:text-[#6C30FF] transition-colors rounded-full hover:bg-[var(--bg-surface)]">
          <CaretLeft size={24} weight="bold" />
        </button>
        <button 
          onClick={onToggleTheme}
          className="p-2.5 rounded-full bg-[var(--bg-surface)] text-[var(--text-primary)] hover:scale-110 active:scale-95 transition-all shadow-sm border border-[var(--border-subtle)]"
        >
          {darkMode ? <Sun size={20} weight="bold" /> : <Moon size={20} weight="bold" />}
        </button>
      </div>

      <div className="flex-grow flex flex-col items-center px-8 pt-[2vh] max-w-[420px] mx-auto w-full pb-32">
        {/* Branding - Spaced ~22% from top */}
        <div className="mb-[32px] animate-fade-in flex justify-center w-full">
          <Logo />
        </div>

        {/* Content Section */}
        <div className="w-full">
          {/* Heading standardized to brand greeting */}
          <div className="text-center animate-slide-up">
            <h2 className="text-[26px] md:text-[28px] font-semibold leading-[1.3] text-[var(--text-primary)]">
              Welcome to RIMA
            </h2>
            <p className="mt-[14px] text-[15px] md:text-[16px] text-[var(--text-secondary)] font-normal leading-relaxed">
              {isLogin 
                ? 'Sign in to continue with RIMA.' 
                : 'Join RIMA and turn everyday conversations into clarity.'}
            </p>
          </div>

          <div className="space-y-6 mt-[32px] animate-slide-up" style={{ animationDelay: '100ms' }}>
            {!isLogin && (
              <div className="space-y-1.5 px-1">
                <label className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.2em] ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full auth-input-underline py-3 px-3 text-[16px] text-[var(--text-primary)] placeholder:text-[#B0B0B0]/40 font-medium"
                />
              </div>
            )}

            <div className="space-y-1.5 px-1">
              <label className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.2em] ml-1">Email address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full auth-input-underline py-3 px-3 text-[16px] text-[var(--text-primary)] placeholder:text-[#B0B0B0]/40 font-medium"
              />
            </div>

            {!isLogin && (
              <div className="space-y-1.5 px-1 relative">
                <label className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.2em] ml-1">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full auth-input-underline py-3 px-3 text-[16px] text-[var(--text-primary)] placeholder:text-[#B0B0B0]/40 font-medium pr-10"
                  />
                  <button 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6C30FF] p-2"
                  >
                    {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {!isLogin && (
              <div className="flex items-center gap-3 px-1 py-2">
                <button 
                  onClick={() => setAcceptedTerms(!acceptedTerms)}
                  className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center shrink-0 ${acceptedTerms ? 'bg-[#6C30FF] border-[#6C30FF]' : 'border-[#E5E7EB] dark:border-white/10'}`}
                >
                  {acceptedTerms && <div className="w-3 h-3 bg-white rounded-full" />}
                </button>
                <p className="text-[13px] text-[var(--text-secondary)] leading-snug">
                  I agree to the <span className="text-[#6C30FF] font-semibold">Terms</span> and <span className="text-[#6C30FF] font-semibold">Privacy Policy</span>.
                </p>
              </div>
            )}

            <button 
              onClick={onSuccess}
              disabled={!canContinue}
              className="w-full h-[56px] rounded-[20px] bg-[#6C30FF] text-white font-semibold text-base transition-all hover:brightness-110 active:scale-95 shadow-lg shadow-[#6C30FF]/15 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isLogin ? 'Log in' : 'Create account'}
            </button>

            <div className="text-center pt-2">
              <p className="text-[15px] text-[var(--text-secondary)]">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                <button onClick={onToggle} className="text-[#6C30FF] font-bold hover:underline">
                  {isLogin ? 'Sign up' : 'Log in'}
                </button>
              </p>
            </div>
          </div>

          <div className="relative flex py-2 items-center px-4 animate-slide-up mt-8" style={{ animationDelay: '150ms' }}>
            <div className="flex-grow border-t border-[#E5E7EB] dark:border-white/10"></div>
            <span className="mx-4 text-[13px] font-medium uppercase tracking-[0.2em] text-[#9CA3AF]">OR</span>
            <div className="flex-grow border-t border-[#E5E7EB] dark:border-white/10"></div>
          </div>

          <div className="space-y-4 animate-slide-up mt-6" style={{ animationDelay: '200ms' }}>
            <SocialButton icon={<GoogleLogo weight="bold" size={22} className="text-[#EA4335]" />} label="Continue with Google" />
            <SocialButton icon={<AppleLogo weight="fill" size={22} />} label="Continue with Apple" />
          </div>
        </div>
      </div>
    </div>
  );
};

const SocialButton: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <button className="w-full h-[56px] bg-[var(--btn-social-bg)] text-[var(--btn-social-text)] border border-[#E5E7EB] dark:border-white/10 rounded-[20px] flex items-center justify-center gap-3 font-semibold transition-all hover:brightness-95 active:scale-95 shadow-sm">
    {icon}
    <span className="text-[15px]">{label}</span>
  </button>
);

export default AuthPage;
