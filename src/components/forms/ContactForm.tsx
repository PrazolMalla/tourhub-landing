'use client';

import { ShieldCheckIcon } from '@/components/icons';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useEnquiry } from '@/hooks/useEnquiry';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { z } from 'zod';
import { Select } from '../ui/form-select';
import { EnquiryResultDialog } from './EnquiryResultDialog';

const schema = z.object({
  fullName: z.string().min(2, 'Please enter your full name'),
  email: z.email('Enter a valid email address'),
  phone: z.string().optional(),
  people: z.string().optional(),
  trip: z.string(),
  date: z.string().optional(),
  message: z.string().optional(),
});

type ContactValues = z.infer<typeof schema>;

const TRIP_OPTIONS = [
  'Trekking',
  'Adventure Tour',
  'Religious / Cultural Tour',
  'Helicopter Tour',
  'City & Night Stay',
  'Custom / Not sure yet',
];

const ROW = ' grid grid-cols-2 gap-4 max-[520px]:grid-cols-1';
const FIELD = 'bg-white';

/** Contact / quote-request form — frosted glass shell, RHF + Zod, submits via the enquiry hook. */
export function ContactForm() {
  const { status, submit, reset } = useEnquiry();
  const defaultValues: ContactValues = {
    fullName: '',
    email: '',
    phone: '',
    people: '',
    trip: TRIP_OPTIONS[0],
    date: '',
    message: '',
  };
  const form = useForm<ContactValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = ({ fullName, ...rest }: ContactValues) =>
    submit({ ...rest, name: fullName, source: 'contact-page' });

  const handleDismiss = () => {
    const wasSuccess = status === 'done';
    reset();
    if (wasSuccess) form.reset(defaultValues);
  };

  return (
    <div
      className="reveal mx-auto w-full max-w-[680px] rounded-[28px] border border-white/40 bg-white/25 p-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] backdrop-blur-xl"
      suppressHydrationWarning
    >
      <div className="rounded-[22px] bg-white/95 p-[clamp(22px,3vw,36px)]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <div className={ROW}>
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">Full Name</FormLabel>
                    <FormControl>
                      <Input className={FIELD} placeholder="Your full name" {...field} />
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
                    <FormLabel>Phone / WhatsApp</FormLabel>
                    <FormControl>
                      <PhoneInput
                        international
                        defaultCountry="NP"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Enter phone number"
                        className="flex h-10 w-full rounded-md border border-input bg-white text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className={ROW}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input
                        className={FIELD}
                        type="email"
                        placeholder="you@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="trip"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Trip / trek interested in</FormLabel>
                    <FormControl>
                      <Select {...field}>
                        {TRIP_OPTIONS.map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className={ROW}>
              <FormField
                control={form.control}
                name="people"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No. of travellers</FormLabel>
                    <FormControl>
                      <Input className={FIELD} type="number" min={1} placeholder="2" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred date</FormLabel>
                    <FormControl>
                      <Input className={FIELD} type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      className={FIELD}
                      placeholder="Tell us about the trip you have in mind — dates, group, pace, must-sees..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="inline-flex w-full h-[44px] items-center justify-center gap-2 rounded-sm bg-gold px-6 py-4 text-[15px] font-semibold text-white transition hover:brightness-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === 'submitting' ? (
                <>
                  <Spinner className="size-4 border-2 border-black/30 border-t-black" /> Sending...
                </>
              ) : (
                <>{status === 'done' ? 'Sent ✓' : 'Submit inquiry'}</>
              )}
            </button>

            <div className={`mt-3.5 flex items-center justify-center gap-2 text-[13px] text-black`}>
              <ShieldCheckIcon className={`h-[15px] w-[15px] text-gold`} />
              We never share your details. No spam, ever.
            </div>
          </form>
        </Form>
      </div>

      {(status === 'done' || status === 'error') && (
        <EnquiryResultDialog status={status} open onDismiss={handleDismiss} />
      )}
    </div>
  );
}
