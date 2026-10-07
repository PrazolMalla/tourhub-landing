import { RADIUS_SM, TEXT } from '@/lib/theme';
import { cn } from '@/lib/utils';
import * as React from 'react';

/**
 * Native `<select>` styled to match the form fields. Native is intentional:
 * it's accessible, faithful to the original site, and works in forms without
 * extra state. For richer popovers use a Radix-based select where needed.
 */
export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        `w-full appearance-none ${RADIUS_SM} border border-line bg-paper px-[15px] py-[13px] text-[15px] font-semibold ${TEXT}`,
        'outline-none transition-colors focus:border-gold',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
});
Select.displayName = 'Select';
