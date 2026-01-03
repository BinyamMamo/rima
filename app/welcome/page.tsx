'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppleLogo, GoogleLogo, EnvelopeSimple, Sun, Moon } from '@phosphor-icons/react';
import Logo from '@/components/Logo';
import Background from '@/components/Background';
import { useAuth, useUI } from '@/contexts';

export default function WelcomePage() {
  const router = useRouter();
  const { skipSignIn } = useAuth();
  const { darkMode, toggleDarkMode } = useUI();
  const [showAuth, setShowAuth] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'signup'>('signup');

  const handleGetStarted = () => {
    setAuthType('signup');
    setShowAuth(true);
  };

  const handleLogin = () => {
    setAuthType('login');
    setShowAuth(true);
  };

  const handleSkip = () => {
    skipSignIn();
    router.push('/dashboard');
  };

  if (showAuth) {
    return <AuthSection type={authType} onBack={() => setShowAuth(false)} />;
  }

  return (
    <>
      <Background />
      <div className="relative z-10 w-full h-screen flex flex-col items-center bg-transparent transition-colors duration-300 overflow-y-auto scrollbar-hide">
        {/* Theme Toggle Button - Top Left */}
        <button
          onClick={toggleDarkMode}
          className="absolute top-6 left-6 p-2.5 rounded-full bg-surface text-primary hover:scale-110 active:scale-95 transition-all z-50 shadow-sm border border-subtle"
        >
          {darkMode ? <Sun size={20} weight="bold" /> : <Moon size={20} weight="bold" />}
        </button>

        {/* Skip Button - Top Right */}
        <button
          onClick={handleSkip}
          className="absolute top-6 right-6 px-4 py-2 rounded-full bg-surface/50 backdrop-blur-md border border-subtle text-sm font-bold text-primary hover:bg-surface hover:scale-105 transition-all z-50 shadow-sm"
        >
          Skip
        </button>

        {/* Branding Section - Logo center at 22-25% height */}
        <div className="flex-shrink-0 flex flex-col items-center pt-[22vh] text-center px-10 mb-8 w-full">
          <div className="animate-fade-in flex justify-center">
            <Logo size={120} />
          </div>

          {/* Spacing: 32px logo -> headline; 14px headline -> subtext */}
          <div className="mt-[32px] animate-slide-up" style={{ animationDelay: '100ms' }}>
            <h2 className="text-[26px] md:text-[28px] font-semibold leading-[1.3] text-primary">
              Welcome to RIMA
            </h2>
            <p className="mt-[14px] text-[15px] md:text-[16px] text-secondary font-normal max-w-[340px] mx-auto leading-relaxed">
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
            onClick={handleGetStarted}
          />

          <div className="flex items-center py-2">
            <div className="flex-grow border-t border-[#E5E7EB] dark:border-white/10"></div>
            <span className="mx-4 text-[13px] font-medium uppercase tracking-[0.2em] text-[#9CA3AF]">OR</span>
            <div className="flex-grow border-t border-[#E5E7EB] dark:border-white/10"></div>
          </div>

          <button
            onClick={handleLogin}
            className="w-full h-[56px] rounded-[20px] bg-[#6C30FF] text-white font-semibold text-base transition-all hover:brightness-110 hover:translate-y-[-2px] active:scale-95 shadow-lg shadow-[#6C30FF]/15"
          >
            Log in
          </button>

          <div className="pt-2 text-center">
            <p className="text-[15px] text-secondary">
              Don&apos;t have an account?{' '}
              <button onClick={handleGetStarted} className="text-[#6C30FF] font-semibold hover:underline">
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

const AuthButton: React.FC<{ icon: React.ReactNode; label: string; onClick?: () => void }> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full h-[56px] bg-[var(--btn-social-bg)] text-[var(--btn-social-text)] border border-[#E5E7EB] dark:border-white/10 rounded-[20px] flex items-center justify-center gap-3 font-semibold transition-all hover:brightness-95 active:scale-95 shadow-sm"
  >
    {icon}
    <span className="text-[15px]">{label}</span>
  </button>
);

// Auth Section Component
function AuthSection({ type, onBack }: { type: 'login' | 'signup'; onBack: () => void }) {
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  const { darkMode, toggleDarkMode } = useUI();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [authType, setAuthType] = useState(type);
  const isLogin = authType === 'login';

  const canContinue = isLogin
    ? email.includes('@') && email.length > 3
    : email.includes('@') && name.length > 1 && password.length > 5 && acceptedTerms;

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(name, email, password);
      }
      router.push('/dashboard');
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  return (
    <>
      <Background />
      <div className="relative z-10 w-full h-screen flex flex-col bg-transparent transition-colors duration-300 animate-fade-in overflow-y-auto scrollbar-hide">
        {/* Top Header Navigation */}
        <div className="flex-shrink-0 p-6 flex items-center justify-between sticky top-0 z-50 bg-[var(--bg-app)]/80 backdrop-blur-md">
          <button onClick={onBack} className="p-2 text-secondary hover:text-[#6C30FF] transition-colors rounded-full hover:bg-surface">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-full bg-surface text-primary hover:scale-110 active:scale-95 transition-all shadow-sm border border-subtle"
          >
            {darkMode ? <Sun size={20} weight="bold" /> : <Moon size={20} weight="bold" />}
          </button>
        </div>

        <div className="flex-grow flex flex-col items-center px-8 pt-[2vh] max-w-[420px] mx-auto w-full pb-32">
          {/* Branding */}
          <div className="mb-[32px] animate-fade-in flex justify-center w-full">
            <Logo size={100} />
          </div>

          {/* Content Section */}
          <div className="w-full">
            {/* Heading */}
            <div className="text-center animate-slide-up">
              <h2 className="text-[26px] md:text-[28px] font-semibold leading-[1.3] text-primary">
                Welcome to RIMA
              </h2>
              <p className="mt-[14px] text-[15px] md:text-[16px] text-secondary font-normal leading-relaxed">
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
                    className="w-full auth-input-underline py-3 px-3 text-[16px] text-primary placeholder:text-[#B0B0B0]/40 font-medium"
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
                  className="w-full auth-input-underline py-3 px-3 text-[16px] text-primary placeholder:text-[#B0B0B0]/40 font-medium"
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
                      className="w-full auth-input-underline py-3 px-3 text-[16px] text-primary placeholder:text-[#B0B0B0]/40 font-medium pr-10"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6C30FF] p-2"
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
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
                  <p className="text-[13px] text-secondary leading-snug">
                    I agree to the <span className="text-[#6C30FF] font-semibold">Terms</span> and <span className="text-[#6C30FF] font-semibold">Privacy Policy</span>.
                  </p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={!canContinue}
                className="w-full h-[56px] rounded-[20px] bg-[#6C30FF] text-white font-semibold text-base transition-all hover:brightness-110 active:scale-95 shadow-lg shadow-[#6C30FF]/15 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {isLogin ? 'Log in' : 'Create account'}
              </button>

              <div className="text-center pt-2">
                <p className="text-[15px] text-secondary">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                  <button onClick={() => setAuthType(isLogin ? 'signup' : 'login')} className="text-[#6C30FF] font-bold hover:underline">
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
    </>
  );
}

const SocialButton: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <button className="w-full h-[56px] bg-[var(--btn-social-bg)] text-[var(--btn-social-text)] border border-[#E5E7EB] dark:border-white/10 rounded-[20px] flex items-center justify-center gap-3 font-semibold transition-all hover:brightness-95 active:scale-95 shadow-sm">
    {icon}
    <span className="text-[15px]">{label}</span>
  </button>
);
