import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TEXT, TEXT_MUTED } from '@/lib/theme';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/** Empty-state placeholder (e.g. no trips match the filters). */
export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('py-16 text-center', className)}>
      <p className={`font-serif text-2xl ${TEXT}`}>{title}</p>
      {description ? <p className={`mx-auto mt-3 max-w-md ${TEXT_MUTED}`}>{description}</p> : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
