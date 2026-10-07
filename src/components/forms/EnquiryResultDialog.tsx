'use client';

import { CheckIcon } from '@/components/icons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TEXT_ACCENT } from '@/lib/theme';

interface EnquiryResultDialogProps {
  /** Only "done" (success) or "error" ever render this dialog — pass `open` to control visibility. */
  status: 'done' | 'error';
  open: boolean;
  /** Fires on the OK button, the X button, an outside click, or Escape — treat them all the same. */
  onDismiss: () => void;
}

/** Shared success/failure confirmation shown after an enquiry form submits. */
export function EnquiryResultDialog({ status, open, onDismiss }: EnquiryResultDialogProps) {
  const isSuccess = status === 'done';
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onDismiss()}>
      <DialogContent className="text-center sm:max-w-[440px]">
        <DialogHeader className="flex flex-col items-center text-center">
          <div
            className={`mb-3 flex size-12 items-center justify-center rounded-full ${
              isSuccess ? 'bg-green-btn/10' : 'bg-red-50'
            }`}
          >
            {isSuccess ? (
              <CheckIcon className={`size-6 ${TEXT_ACCENT}`} />
            ) : (
              <span className="text-xl font-bold text-red-600">!</span>
            )}
          </div>
          <DialogTitle>{isSuccess ? 'Request submitted' : 'Submission failed'}</DialogTitle>
          <DialogDescription>
            {isSuccess
              ? 'Thank you for reaching out. Your request has been submitted, and one of our travel experts will follow up with you within 1–2 hours.'
              : "We couldn't submit your request right now. Please check your connection and try again, or reach us directly on WhatsApp."}
          </DialogDescription>
        </DialogHeader>
        <button type="button" className="btn btn-gold w-full justify-center" onClick={onDismiss}>
          OK
        </button>
      </DialogContent>
    </Dialog>
  );
}
