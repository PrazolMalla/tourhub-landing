'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import { CloseIcon } from '@/components/icons';
import { RADIUS, RADIUS_SM, TEXT, TEXT_MUTED } from '@/lib/theme';

/** Accessible modal dialog (Radix) styled to the brand. */
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-1/2 top-1/2 z-[110] w-[min(520px,92vw)] -translate-x-1/2 -translate-y-1/2',
        `${RADIUS} border border-line bg-white p-7 shadow-[var(--shadow-card)]`,
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close
        className={`absolute right-4 top-4 flex size-9 items-center justify-center ${RADIUS_SM} ${TEXT} transition-colors hover:bg-paper`}
        aria-label="Close"
      >
        <CloseIcon className="size-5" />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
DialogContent.displayName = 'DialogContent';

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-4', className)} {...props} />;
}

export const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(`font-serif text-2xl ${TEXT}`, className)}
    {...props}
  />
));
DialogTitle.displayName = 'DialogTitle';

export const DialogDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn(`mt-1 text-[15px] ${TEXT_MUTED}`, className)}
    {...props}
  />
));
DialogDescription.displayName = 'DialogDescription';
