'use client';

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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { ArrowRightIcon } from '@/components/icons';
import { useEnquiry } from '@/hooks/useEnquiry';
import { TEXT_MUTED } from '@/lib/theme';
import { Select } from '../ui/form-select';
import { EnquiryResultDialog } from './EnquiryResultDialog';

const schema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  phone: z.string().min(5, 'Please enter a phone number'),
  email: z.string().optional(),
  vehicle: z.string(),
  pickup: z.string().min(2, 'Where should we pick you up?'),
  destination: z.string().min(2, 'Where are you headed?'),
  passengers: z.string().optional(),
  date: z.string().optional(),
  days: z.string().optional(),
  luggage: z.string().optional(),
  message: z.string().optional(),
});

type HireValues = z.infer<typeof schema>;

const VEHICLES = [
  'Car (Sedan)',
  'SUV / 4WD',
  'Jeep (Scorpio)',
  'Hiace Van',
  'Tourist Bus / Coaster',
  'Not sure — advise me',
];

interface HireFormProps {
  /** Pre-select a vehicle (e.g. from a vehicle detail page). */
  defaultVehicle?: string;
  /** Lead source tag sent with the enquiry. */
  source?: string;
}

/** Vehicle-hire request form — RHF + Zod, submits via the enquiry hook. */
export function HireForm({ defaultVehicle, source = 'hire-a-vehicle' }: HireFormProps = {}) {
  const { status, submit, reset } = useEnquiry();
  // Ensure a pre-selected vehicle is always present in the dropdown.
  const vehicleOptions =
    defaultVehicle && !VEHICLES.includes(defaultVehicle) ? [defaultVehicle, ...VEHICLES] : VEHICLES;
  const defaultValues: HireValues = {
    name: '',
    phone: '',
    email: '',
    vehicle: defaultVehicle ?? vehicleOptions[0],
    pickup: '',
    destination: '',
    passengers: '',
    date: '',
    days: '',
    luggage: '',
    message: '',
  };
  const form = useForm<HireValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = (values: HireValues) => submit({ ...values, source });

  const handleDismiss = () => {
    const wasSuccess = status === 'done';
    reset();
    if (wasSuccess) form.reset(defaultValues);
  };

  return (
    <div
      className="reveal rounded-(--r-lg) border border-line/40 bg-white p-[clamp(26px,3vw,40px)]"
      style={{ maxWidth: 780, margin: '0 auto' }}
      suppressHydrationWarning
    >
      <span className="eyebrow center">Request a vehicle</span>
      <h3 className="mb-1.5 text-[26px]" style={{ marginTop: 10 }}>
        Tell us your route &amp; dates
      </h3>
      <p className={`mb-6 text-[15px] ${TEXT_MUTED}`}>
        We reply within 1–2 hours with an all-inclusive quote. No advance payment to enquire.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <div className="mb-4 grid grid-cols-2 gap-4 max-[520px]:grid-cols-1">
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
                  <FormLabel>Phone / WhatsApp</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+977 ..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4 max-[520px]:grid-cols-1">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@email.com" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vehicle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle type</FormLabel>
                  <FormControl>
                    <Select {...field}>
                      {vehicleOptions.map((v) => (
                        <option key={v}>{v}</option>
                      ))}
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4 max-[520px]:grid-cols-1">
            <FormField
              control={form.control}
              name="pickup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pickup location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Kathmandu Airport" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination / route</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Pokhara" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4 max-[520px]:grid-cols-1">
            <FormField
              control={form.control}
              name="passengers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passengers</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} placeholder="2" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pickup date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4 max-[520px]:grid-cols-1">
            <FormField
              control={form.control}
              name="days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No. of days</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} placeholder="1" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="luggage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Luggage / extras</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 2 large bags" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Anything else?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Itinerary, stops, timing, special requests..."
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <button
            className="btn btn-gold"
            type="submit"
            style={{ width: '100%' }}
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? (
              <>
                <Spinner className="size-4 border-2 border-white/40 border-t-white" /> Sending...
              </>
            ) : (
              <>
                {status === 'done' ? 'Sent ✓' : 'Request my vehicle'}{' '}
                <ArrowRightIcon strokeWidth={2.2} />
              </>
            )}
          </button>
        </form>
      </Form>

      {(status === 'done' || status === 'error') && (
        <EnquiryResultDialog status={status} open onDismiss={handleDismiss} />
      )}
    </div>
  );
}
