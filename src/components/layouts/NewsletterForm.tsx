'use client';

import { useState } from 'react';
import { submitEnquiry } from '@/services/enquiry.service';
import { CheckIcon } from '@/components/icons';
import { PRIMARY } from '@/lib/theme';

/** Footer newsletter signup — captured as a lead (mirrors the legacy fform). */
export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/.+@.+\..+/.test(email)) return;
    void submitEnquiry({ email, source: 'newsletter', message: 'Newsletter signup' });
    setDone(true);
    setEmail('');
  }

  return (
    <>
      <form
        className="flex flex-wrap rounded-(--r) border border-(--line-dark) bg-ink-2 p-1.5"
        onSubmit={onSubmit}
      >
        <input
          type="email"
          placeholder="Your email address"
          aria-label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-w-0 flex-1 border-none [background:none] px-3.5 py-2.5 [font:inherit] text-[14.5px] text-white outline-none placeholder:text-muted"
        />
        <button
          type="submit"
          className={`rounded-(--r-sm) ${PRIMARY} px-4.5 py-0 text-sm font-bold text-white`}
        >
          {done ? 'Subscribed ✓' : 'Subscribe'}
        </button>
      </form>
      {done ? (
        <div
          className="mt-3.5 flex items-center gap-2.25 rounded-[4px] bg-success-bg px-4 py-3.25 text-[14.5px] font-bold leading-[1.3] text-success"
          style={{ marginTop: 12 }}
        >
          <CheckIcon className="h-4.5 w-4.5 flex-none" /> You&apos;re subscribed — Himalayan stories
          headed your way.
        </div>
      ) : null}
    </>
  );
}
