import { cn } from '@/lib/utils';
import { RADIUS_FULL } from '@/lib/theme';

/** Loading spinner using the brand accent colour. */
export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        `inline-block size-7 animate-spin ${RADIUS_FULL} border-[3px] border-line border-t-green-btn`,
        className,
      )}
    />
  );
}
