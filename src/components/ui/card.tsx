import * as React from 'react';
import { cn } from '@/lib/utils';
import { RADIUS } from '@/lib/theme';

/** Generic surface card matching the site's bordered, rounded panels. */
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        `${RADIUS} border border-line bg-white shadow-[var(--shadow-card-sm)]`,
        className,
      )}
      {...props}
    />
  );
}

export function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6', className)} {...props} />;
}
