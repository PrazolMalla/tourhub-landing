'use client';

import { cn } from '@/lib/utils';
import * as LabelPrimitive from '@radix-ui/react-label';
import * as React from 'react';

/** Form label styled like the site's mono uppercase field labels. */
export const Label = React.forwardRef<
  React.ComponentRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(` text-[10.5px] uppercase tracking-[0.12em] text-black`, className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;
