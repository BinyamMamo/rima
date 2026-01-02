import React from 'react';

const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none theme-transition overflow-hidden">
      {/* Dynamic Theme Background */}
      <div className="absolute inset-0 bg-app transition-colors duration-700" />

      {/* Playful Soft Blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--primary)]/5 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-[var(--primary-accent)]/5 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[30%] right-[-10%] w-[30%] h-[30%] bg-[var(--primary)]/5 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '4s' }} />

      {/* Subtle Grain Texture */}
      <div className="absolute inset-0 opacity-[0.015] contrast-125 brightness-125" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }}></div>

      {/* Modern Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(to right, var(--text-primary) 1px, transparent 1px), linear-gradient(to bottom, var(--text-primary) 1px, transparent 1px)',
        backgroundSize: '80px 80px'
      }}></div>
    </div>
  );
};

export default Background;
