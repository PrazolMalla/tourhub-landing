import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';

type NavigationProps = {
  center?: ReactNode;

  onPrevious?: () => void;
  onNext?: () => void;

  previousDisabled?: boolean;
  nextDisabled?: boolean;

  onDark?: boolean;
};

const NAV_BTN =
  'flex h-[44px] w-[44px] items-center justify-center rounded-full border transition-all duration-200 hover:border-gold hover:bg-gold-deep hover:text-white disabled:pointer-events-none disabled:opacity-30';

export function Navigation({
  center,
  onPrevious,
  onNext,
  previousDisabled = false,
  nextDisabled = false,
  onDark = false,
}: NavigationProps) {
  return (
    <div className="mt-[10px] flex items-center justify-center gap-[24px]">
      <button
        type="button"
        onClick={onPrevious}
        disabled={previousDisabled}
        aria-label="Previous"
        className={`${NAV_BTN} ${
          onDark ? 'border-white/30 text-white' : 'border-black/15 text-ink'
        }`}
      >
        <ChevronLeft size={18} strokeWidth={2} aria-hidden="true" />
      </button>

      {center}

      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        aria-label="Next"
        className={`${NAV_BTN} ${
          onDark ? 'border-white/30 text-white' : 'border-black/15 text-ink'
        }`}
      >
        <ChevronRight size={18} strokeWidth={2} aria-hidden="true" />
      </button>
    </div>
  );
}
