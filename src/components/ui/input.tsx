import * as React from 'react';
import { cn } from '@/lib/utils';
import { RADIUS_SM, TEXT } from '@/lib/theme';

/** Text input styled with the site's form-field tokens. */
export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = 'text', ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        `w-full ${RADIUS_SM} border border-line bg-paper px-[15px] py-[13px] text-[15px] ${TEXT}`,
        'outline-none transition-colors placeholder:text-muted/70 focus:border-gold',
        className,
      )}
      {...props}
    />
  );
});
Input.displayName = 'Input';
