// src/components/RegisterModal.tsx
'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useForm } from 'react-hook-form';

type FormValues = {
  firstName: string;
  lastName: string;
  dialCode: string;
  phone: string;
  email: string;
  language: string;
  goldenVisa: boolean;
  consent: boolean;
};

export default function RegisterModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: { dialCode: '+971', language: '', goldenVisa: false, consent: false },
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    reset();
    onOpenChange(false);
  };

  const input =
    'h-10 w-full rounded-md border border-black/15 bg-white px-3 text-[13px] text-[#2B3119] placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-[#2B3119]/15';
  const label = 'text-[12px] font-medium text-[#2B3119]';
  const fieldWrap = 'space-y-1.5';

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/40" />
        <Dialog.Content
          aria-label="Register Interest"
          className="
            fixed left-1/2 top-1/2 z-[90]
            w-[560px] max-w-[92vw]
            -translate-x-1/2 -translate-y-1/2
            bg-white shadow-2xl border border-black/10 rounded-none
            focus:outline-none
          "
        >
          {/* Header */}
          <div className="flex items-start justify-between px-6 pt-6">
            <div>
              <Dialog.Title className="text-[22px] font-semibold text-[#2B3119]">
                Register Interest
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-[13px] text-neutral-600">
                Please Share the Details
              </Dialog.Description>
            </div>
            <Dialog.Close
              className="ml-3 inline-flex h-10 w-10 items-center justify-center rounded text-neutral-500 hover:bg-neutral-100 text-[22px] leading-none"
              aria-label="Close"
              title="Close"
            >
              ×
            </Dialog.Close>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-6 pt-5 space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className={fieldWrap}>
                <label className={label}>First name</label>
                <input {...register('firstName')} className={input} placeholder="Enter your first name" />
              </div>
              <div className={fieldWrap}>
                <label className={label}>Last name</label>
                <input {...register('lastName')} className={input} placeholder="Enter your last name" />
              </div>
            </div>

            <div className={fieldWrap}>
              <label className={label}>Phone number</label>
              <div className="flex items-center gap-2 rounded-md border border-black/15 px-2">
                <select
                  {...register('dialCode')}
                  className="h-9 w-[90px] bg-transparent text-[13px] outline-none"
                  aria-label="Country code"
                >
                  <option value="+971">+971</option>
                  <option value="+966">+966</option>
                  <option value="+974">+974</option>
                  <option value="+973">+973</option>
                  <option value="+965">+965</option>
                </select>
                <input
                  {...register('phone')}
                  className="h-9 w-full bg-transparent text-[13px] outline-none placeholder:text-neutral-400"
                  placeholder="000000000"
                  inputMode="tel"
                />
              </div>
            </div>

            <div className={fieldWrap}>
              <label className={label}>Email address</label>
              <input {...register('email')} type="email" className={input} placeholder="Enter your email" />
            </div>

            <div className={fieldWrap}>
              <label className={label}>Preferred Language</label>
              <div className="relative">
                <select {...register('language')} className={`${input} pr-9`} aria-label="Preferred Language">
                  <option value="">Select your language</option>
                  <option>English</option>
                  <option>Arabic</option>
                  <option>Russian</option>
                  <option>Hindi</option>
                  <option>Chinese</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
                  ▾
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <label className="flex items-start gap-2 text-[13px] text-[#2B3119]">
                <input type="checkbox" {...register('goldenVisa')} className="mt-0.5" />
                I&apos;m Interested in the Golden Visa
              </label>
              <label className="flex items-start gap-2 text-[13px] text-[#2B3119]">
                <input type="checkbox" {...register('consent')} className="mt-0.5" />
                I Consent to the Privacy Policy &amp; Terms and Conditions
              </label>
            </div>

            <div className="mt-4 flex items-center justify-end gap-3">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="h-9 rounded px-3 text-[13px] text-neutral-700 hover:bg-neutral-100"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                className="h-9 rounded bg-[#2B3119] px-4 text-[13px] font-medium text-white hover:opacity-90"
              >
                Submit
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
