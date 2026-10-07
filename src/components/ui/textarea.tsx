import * as React from 'react';
import { cn } from '@/lib/utils';
import { RADIUS_SM, TEXT } from '@/lib/theme';

/** Multi-line text input styled with the site's form-field tokens. */
export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        `min-h-[120px] w-full resize-y ${RADIUS_SM} border border-line bg-paper px-[15px] py-[13px] text-[15px] ${TEXT}`,
        'outline-none transition-colors placeholder:text-muted/70 focus:border-gold',
        className,
      )}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';
