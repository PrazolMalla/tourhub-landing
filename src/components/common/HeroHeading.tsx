import { ReactNode } from 'react';

interface HeroHeadingProps {
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
  subtitleClassName?: string;
  maxWords?: number;
}

export function HeroHeading({
  title,
  subtitle,
  className = '',
  subtitleClassName = '',
  maxWords = 6,
}: HeroHeadingProps) {
  const limitedTitle =
    typeof title === 'string'
      ? title.split(/\s+/).slice(0, maxWords).join(' ') +
        (title.trim().split(/\s+/).length > maxWords ? '…' : '')
      : title;

  return (
    <div className="flex flex-col items-center">
      <h1
        className={`max-w-[800px] text-[clamp(48px,5.5vw,76px)] leading-[1] ${className} text-center `}
      >
        {limitedTitle}
      </h1>

      {subtitle ? (
        <p
          className={`mt-[18px] max-w-[56ch] text-[clamp(12px,1.4vw,14px)] text-center text-[rgba(255,255,255,0.85)] ${subtitleClassName}`}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
