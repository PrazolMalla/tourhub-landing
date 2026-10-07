'use client';

import { ArrowRightIcon } from '@/components/icons';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/form-select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  downloadSchoolTripChecklist,
  type SchoolTripChecklistOption,
} from '@/services/schoolTripChecklist.service';

const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_BASE_URL || 'http://localhost:3000';
const assetUrl = (url: string) => (url.startsWith('http') ? url : `${ASSET_BASE}${url}`);

// International-friendly: optional leading +, 7-18 digits, spaces/dashes allowed.
const PHONE_REGEX = /^\+?[0-9](?:[0-9\s-]{5,17})[0-9]$/;

const schema = z.object({
  checklistId: z.string().min(1, 'Please choose a checklist type'),
  name: z.string().trim().min(2, 'Please enter your name'),
  phone: z.string().trim().regex(PHONE_REGEX, 'Enter a valid phone number'),
});

type Values = z.infer<typeof schema>;

export interface SchoolTripChecklistDialogProps {
  options: SchoolTripChecklistOption[];
  loadingOptions: boolean;
  /** Pre-select a checklist — used when the dialog was opened from a shared `?checklist=<slug>` link. */
  defaultChecklistId?: string;
}

export function SchoolTripChecklistDialog({
  options,
  loadingOptions,
  defaultChecklistId,
}: SchoolTripChecklistDialogProps) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      checklistId: '',
      name: '',
      phone: '',
    },
  });

  // `options` (and therefore a matching `defaultChecklistId`) arrive async —
  // apply it once it's known instead of only at the form's initial mount.
  useEffect(() => {
    if (defaultChecklistId) form.setValue('checklistId', defaultChecklistId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultChecklistId]);

  const noOptions = !loadingOptions && options.length === 0;

  const onSubmit = async (values: Values) => {
    setError(null);
    setDownloading(true);
    try {
      const pdfUrl = await downloadSchoolTripChecklist(
        values.checklistId,
        values.name,
        values.phone,
      );
      const link = document.createElement('a');
      link.href = assetUrl(pdfUrl);
      link.target = '_blank';
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="checklistId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Checklist type</FormLabel>
              <FormControl>
                <Select {...field} disabled={loadingOptions || noOptions}>
                  <option value="" disabled>
                    {loadingOptions
                      ? 'Loading checklist types…'
                      : noOptions
                        ? 'No checklists available yet'
                        : 'Select a checklist type'}
                  </option>
                  {options.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.type}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="+977..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="btn btn-gold w-full disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={downloading || noOptions}
        >
          {downloading ? 'Downloading…' : 'Submit & Download'}
          {!downloading && <ArrowRightIcon strokeWidth={2.2} />}
        </button>
      </form>
    </Form>
  );
}
