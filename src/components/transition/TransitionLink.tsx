// components/transition/TransitionLink.tsx
'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';
import { usePageTransition } from './TransitionProvider';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: string };

export default function TransitionLink({ href, onClick, children, ...rest }: Props) {
  const { navigate } = usePageTransition();

  return (
    <Link
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        // let cmd/ctrl/shift-click and middle-click behave normally
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        navigate(href);
      }}
    >
      {children}
    </Link>
  );
}
