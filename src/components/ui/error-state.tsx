'use client';

import { TEXT, TEXT_MUTED } from '@/lib/theme';
import { Button } from './button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

/** Generic error panel with an optional retry action. */
export function ErrorState({
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="py-16 text-center">
      <p className={`font-serif text-3xl ${TEXT}`}>{title}</p>
      <p className={`mx-auto mt-3 max-w-md ${TEXT_MUTED}`}>{description}</p>
      {onRetry ? (
        <div className="mt-6 flex justify-center">
          <Button variant="destructive" onClick={onRetry}>
            Try again
          </Button>
        </div>
      ) : null}
    </div>
  );
}
