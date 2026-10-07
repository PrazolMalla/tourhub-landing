import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Typography components derived from the site's existing type styles
 * (serif display headings, mono eyebrow, muted lead paragraph).
 */

export function Eyebrow({
  className,
  center,
  onDark,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { center?: boolean; onDark?: boolean }) {
  return (
    <span
      className={cn('eyebrow', center && 'center', onDark && 'on-dark', className)}
      {...props}
    />
  );
}

export function SectionHeading({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('font-serif', className)} {...props} />;
}

export function Lead({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('lead', className)} {...props} />;
}

/** A standard section header block (eyebrow + heading + optional lead). */
export function SectionHead({
  eyebrow,
  title,
  lead,
  dark,
  className,
}: {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  lead?: React.ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('shead reveal', dark && 'dark', className)} suppressHydrationWarning>
      <div>
        <Eyebrow onDark={dark}>{eyebrow}</Eyebrow>
        <h2>{title}</h2>
      </div>
      {lead ? <p className="lead">{lead}</p> : null}
    </div>
  );
}
