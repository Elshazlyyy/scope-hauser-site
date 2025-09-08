import { z } from 'zod';

export const leadSchema = z.object({
  name: z.string().min(2, 'Please enter your full name.'),
  email: z.string().email('Enter a valid email.'),
  phone: z.string().min(6, 'Enter a valid phone number.'),
  message: z.string().optional().default(''),
  consent: z
    .boolean()
    .refine((v) => v === true, { message: 'Consent is required.' }),
  page: z.string().optional(),
  project: z.string().optional(),
  // 2-arg overload avoids the zod typing warning
  utm: z.record(z.string(), z.unknown()).optional()
});

export type LeadInput = z.infer<typeof leadSchema>;
