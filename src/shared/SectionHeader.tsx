import type { ReactNode } from 'react';

interface SectionHeaderProps {
  eyebrow: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
  spacing?: 'standard' | 'compact';
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  children,
  className = '',
  spacing = 'standard'
}: SectionHeaderProps) {
  const spacingClass = spacing === 'compact' ? 'mb-10 sm:mb-12' : 'mb-12 sm:mb-16';

  return (
    <header className={`section-heading text-center max-w-3xl mx-auto ${spacingClass} space-y-3 ${className}`.trim()}>
      <div className="section-kicker inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs font-mono uppercase tracking-widest">
        {eyebrow}
      </div>
      <h2 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-zinc-950 tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="section-description text-zinc-600 text-sm sm:text-base md:text-lg font-normal leading-relaxed">
          {description}
        </p>
      )}
      {children}
    </header>
  );
}
