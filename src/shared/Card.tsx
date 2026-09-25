import type { HTMLAttributes, ReactNode } from 'react';

export type CardVariant = 'panel' | 'raised' | 'subtle';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: CardVariant;
}

const VARIANT_CLASSES: Record<CardVariant, string> = {
  panel: 'ui-card--panel',
  raised: 'ui-card--raised',
  subtle: 'ui-card--subtle'
};

export default function Card({ children, variant = 'panel', className = '', ...props }: CardProps) {
  return (
    <div className={`ui-card ${VARIANT_CLASSES[variant]} ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}
