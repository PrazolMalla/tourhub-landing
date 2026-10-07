'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { LinkIcon, CheckIcon as CopiedIcon } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons';
import { RADIUS, RADIUS_FULL, TEXT_MUTED } from '@/lib/theme';
import { CHECKLIST_QUERY_PARAM, checklistShareUrl, whatsappShareHref } from '@/lib/checklistShare';
import {
  listSchoolTripChecklists,
  type SchoolTripChecklistOption,
} from '@/services/schoolTripChecklist.service';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { SchoolTripChecklistDialog } from './SchoolTripChecklistDialog';

/** Small "copy link" button with inline copied-state feedback (no toast system on this app). */
function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (very old browser / non-HTTPS) — nothing sensible to do.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy checklist link"
      title={copied ? 'Copied!' : 'Copy link'}
      className={`inline-flex h-8 w-8 items-center justify-center ${RADIUS_FULL} border border-line bg-white text-ink-2 transition-colors hover:bg-paper-2`}
    >
      {copied ? (
        <CopiedIcon className="h-[15px] w-[15px] text-emerald-600" />
      ) : (
        <LinkIcon className="h-[15px] w-[15px]" />
      )}
    </button>
  );
}

/** One shareable row for a single checklist type. */
function ChecklistShareRow({ option }: { option: SchoolTripChecklistOption }) {
  const url = checklistShareUrl(option.slug);
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line py-2.5 last:border-b-0">
      <span className="truncate text-[14px] font-semibold text-ink-2">{option.type}</span>
      <div className="flex flex-none items-center gap-2">
        <a
          href={whatsappShareHref(option.type, option.slug)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share ${option.type} checklist on WhatsApp`}
          title="Share on WhatsApp"
          className={`inline-flex h-8 w-8 items-center justify-center ${RADIUS_FULL} bg-[#25D366] text-white transition-opacity hover:opacity-90`}
        >
          <WhatsAppIcon className="h-[15px] w-[15px]" />
        </a>
        <CopyLinkButton url={url} />
      </div>
    </div>
  );
}

/**
 * Client-side island for the homepage "Trip Checklist" section:
 *   - Renders the existing "Download the Checklist" dialog (unchanged flow).
 *   - Renders a per-checklist share list (WhatsApp + copy-link), each linking
 *     to `?checklist=<slug>#trip-checklist`.
 *   - When a page loads with that query param (someone opened a shared
 *     link), auto-opens the dialog pre-set to that checklist — the bare
 *     `#trip-checklist` hash alone already scrolls the browser here natively.
 */
export function TripChecklistCta() {
  const searchParams = useSearchParams();
  const [options, setOptions] = useState<SchoolTripChecklistOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [open, setOpen] = useState(false);
  const [defaultChecklistId, setDefaultChecklistId] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    listSchoolTripChecklists().then((opts) => {
      if (cancelled) return;
      setOptions(opts);
      setLoadingOptions(false);

      const sharedSlug = searchParams.get(CHECKLIST_QUERY_PARAM);
      const shared = sharedSlug ? opts.find((o) => o.slug === sharedSlug) : undefined;
      if (shared) {
        setDefaultChecklistId(shared.id);
        setOpen(true);
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mt-3">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="btn btn-ink">Download the Checklist</button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Download Trip Checklist</DialogTitle>
          </DialogHeader>

          <SchoolTripChecklistDialog
            options={options}
            loadingOptions={loadingOptions}
            defaultChecklistId={defaultChecklistId}
          />
        </DialogContent>
      </Dialog>

      {options.length > 0 && (
        <div className={`mt-5 ${RADIUS} border border-line bg-white p-4`}>
          <p className={`mb-1.5 text-[11px] font-bold uppercase tracking-[0.08em] ${TEXT_MUTED}`}>
            Share a checklist
          </p>
          {options.map((o) => (
            <ChecklistShareRow key={o.id} option={o} />
          ))}
        </div>
      )}
    </div>
  );
}
