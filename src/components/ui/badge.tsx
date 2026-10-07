import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { RADIUS_FULL, PRIMARY, TEXT } from '@/lib/theme';

const badgeVariants = cva(
  `inline-flex items-center gap-1.5 ${RADIUS_FULL} font-mono text-[10.5px] font-bold uppercase tracking-[0.1em]`,
  {
    variants: {
      variant: {
        gold: `${PRIMARY} px-[11px] py-[6px] text-white`,
        light: `bg-white/90 px-[11px] py-[6px] ${TEXT}`,
        outline: `px-[13px] py-[7px] ${TEXT} shadow-[inset_0_0_0_1px_var(--line)]`,
      },
    },
    defaultVariants: { variant: 'gold' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

/** Small pill/tag badge (trek badges, blog category chips). */
export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
