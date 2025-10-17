// src/components/RegisterModal.tsx
'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

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

type SubmitState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string };

const input =
  'h-10 w-full rounded-md border border-black/15 bg-white px-3 text-[13px] text-[#2B3119] placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-[#2B3119]/15';
const label = 'text-[12px] font-medium text-[#2B3119]';
const fieldWrap = 'space-y-1.5';

export default function RegisterModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      dialCode: '+971',
      language: '',
      goldenVisa: false,
      consent: false,
    },
    mode: 'onSubmit',
  });

  const [submitState, setSubmitState] = useState<SubmitState>({
    status: 'idle',
  });

  // Auto-close after success (optional)
  useEffect(() => {
    if (submitState.status === 'success') {
      const t = setTimeout(() => onOpenChange(false), 1600);
      return () => clearTimeout(t);
    }
  }, [submitState, onOpenChange]);

  async function onSubmit(data: FormValues) {
    if (!data.consent) {
      setSubmitState({
        status: 'error',
        message: 'Please accept the Privacy Policy & Terms to proceed.',
      });
      return;
    }

    setSubmitState({ status: 'submitting' });

    try {
      const endpoint = '/api/lead';

      const payload = {
        ...data,
        fullPhone: `${data.dialCode} ${data.phone}`.trim(),
        path: typeof window !== 'undefined' ? window.location.pathname : '',
        timestamp: new Date().toISOString(),
      };

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        // Try to surface server message if present
        let serverMsg = '';
        try {
          const t = await res.text();
          serverMsg = t;
        } catch {
          /* ignore */
        }
        throw new Error(serverMsg || `Lead endpoint returned ${res.status}`);
      }

      // --- New: read Bitrix status from API response
      type ApiResponse = {
        ok: boolean;
        bitrixOk?: boolean;
        bitrixLeadId?: number | null;
      };
      let bitrixOk = true;
      try {
        const json: ApiResponse = await res.json();
        bitrixOk = typeof json.bitrixOk === 'boolean' ? json.bitrixOk : true;
      } catch {
        // If parsing fails, keep normal success UX
        bitrixOk = true;
      }

      setSubmitState({
        status: 'success',
        message: bitrixOk
          ? 'Thanks! Your details were submitted successfully.'
          : 'Thanks! Saved. (Heads-up: CRM sync will retry shortly.)',
      });

      reset({
        dialCode: '+971',
        language: '',
        goldenVisa: false,
        consent: false,
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
      });
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : 'Something went wrong. Please try again in a moment.';
      setSubmitState({
        status: 'error',
        message:
          msg.includes('The user aborted a request') || msg.includes('aborted')
            ? 'Request timed out. Please try again.'
            : `Could not submit your details. ${msg}`,
      });
    }
  }

  const disabled = submitState.status === 'submitting';

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(o) => {
        if (!disabled) onOpenChange(o);
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/40" />
        <Dialog.Content
          aria-label="Register Interest"
          className="fixed top-1/2 left-1/2 z-[90] w-[560px] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 rounded-none border border-black/10 bg-white shadow-2xl focus:outline-none"
        >
          {/* Header */}
          <div className="flex items-start justify-between px-6 pt-6">
            <div>
              <Dialog.Title className="text-[22px] font-semibold text-[#2B3119]">
                Register Interest
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-[13px] text-neutral-600">
                Please share your details and we’ll get back to you shortly.
              </Dialog.Description>
            </div>

            <Dialog.Close
              className="ml-3 grid h-10 w-10 place-items-center rounded text-neutral-500 hover:bg-neutral-100 disabled:opacity-50"
              aria-label="Close"
              title="Close"
              disabled={disabled}
            >
              {/* Centered X icon */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </Dialog.Close>
          </div>

          {/* Status banner */}
          {submitState.status === 'error' && (
            <div className="mx-6 mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">
              {submitState.message}
            </div>
          )}
          {submitState.status === 'success' && (
            <div className="mx-6 mt-4 rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-[12px] text-emerald-700">
              {submitState.message}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 px-6 pt-5 pb-6"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className={fieldWrap}>
                <label className={label}>First name</label>
                <input
                  {...register('firstName', { required: true })}
                  className={input}
                  placeholder="Enter your first name"
                  disabled={disabled}
                />
              </div>
              <div className={fieldWrap}>
                <label className={label}>Last name</label>
                <input
                  {...register('lastName', { required: true })}
                  className={input}
                  placeholder="Enter your last name"
                  disabled={disabled}
                />
              </div>
            </div>

            <div className={fieldWrap}>
              <label className={label}>Phone number</label>
              <div className="flex items-center gap-2 rounded-md border border-black/15 px-2">
                <select
                  {...register('dialCode', { required: true })}
                  className="h-9 w-[90px] bg-transparent text-[13px] outline-none"
                  aria-label="Country code"
                  disabled={disabled}
                >
                  <option value="+971">+971</option>
                  <option value="+966">+966</option>
                  <option value="+974">+974</option>
                  <option value="+973">+973</option>
                  <option value="+965">+965</option>
                </select>
                <input
                  {...register('phone', { required: true, minLength: 5 })}
                  className="h-9 w-full bg-transparent text-[13px] outline-none placeholder:text-neutral-400"
                  placeholder="000000000"
                  inputMode="tel"
                  disabled={disabled}
                />
              </div>
            </div>

            <div className={fieldWrap}>
              <label className={label}>Email address</label>
              <input
                {...register('email', {
                  required: true,
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                })}
                type="email"
                className={input}
                placeholder="Enter your email"
                disabled={disabled}
              />
            </div>

            <div className={fieldWrap}>
              <label className={label}>Preferred Language</label>
              <div className="relative">
                <select
                  {...register('language')}
                  className={`${input} pr-9`}
                  aria-label="Preferred Language"
                  disabled={disabled}
                >
                  <option value="">Select your language</option>
                  <option>English</option>
                  <option>Arabic</option>
                  <option>Russian</option>
                  <option>Hindi</option>
                  <option>Chinese</option>
                </select>
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-neutral-500">
                  ▾
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <label className="flex items-start gap-2 text-[13px] text-[#2B3119]">
                <input
                  type="checkbox"
                  {...register('goldenVisa')}
                  className="mt-0.5"
                  disabled={disabled}
                />
                I&apos;m Interested in the Golden Visa
              </label>
              <label className="flex items-start gap-2 text-[13px] text-[#2B3119]">
                <input
                  type="checkbox"
                  {...register('consent', { required: true })}
                  className="mt-0.5"
                  disabled={disabled}
                />
                I Consent to the Privacy Policy &amp; Terms and Conditions
              </label>
            </div>

            <div className="mt-4 flex items-center justify-end gap-3">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="h-9 rounded px-3 text-[13px] text-neutral-700 hover:bg-neutral-100 disabled:opacity-50"
                  disabled={disabled}
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                className="inline-flex h-9 items-center gap-2 rounded bg-[#2B3119] px-4 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-60"
                disabled={disabled}
              >
                {submitState.status === 'submitting' ? (
                  <>
                    <span className="inline-block h-3 w-3 animate-spin rounded-full border border-white/60 border-t-transparent" />
                    Submitting…
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
