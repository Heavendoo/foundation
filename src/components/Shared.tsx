import React from 'react';

/**
 * Shared Logo Component for consistency
 */
export const Logo = ({ className = "w-10 h-10", textClassName = "" }: { className?: string, textClassName?: string }) => (
  <div className="flex items-center gap-3 cursor-pointer group">
    <img 
      src="/logo.svg" 
      alt="Heavendoo Foundation" 
      className={`rounded-full shadow-lg shadow-green-primary/10 ${className}`} 
    />
    <div className={`leading-none ${textClassName}`}>
      <div className="font-sans font-bold text-lg tracking-tight text-dark-base uppercase">HEAVENDOO</div>
      <span className="block text-[10px] tracking-[2px] font-serif italic text-green-primary lowercase font-medium mt-[-2px]">foundation</span>
    </div>
  </div>
);

export const SectionLabel = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4 ${className}`}>
    {children}
  </div>
);

export const SectionTitle = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <h2 className={`text-5xl md:text-6xl font-serif font-normal leading-[1.1] text-dark-base mb-8 ${className}`}>
    {children}
  </h2>
);

export const SectionDesc = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <p className={`text-lg text-dark-muted max-w-2xl leading-relaxed font-normal ${className}`}>
    {children}
  </p>
);
