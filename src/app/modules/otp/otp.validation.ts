import { z } from 'zod';

const createOtpZodSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }),
    otp: z.string({ required_error: 'Otp is required' }),
  }),
});

export const OtpValidation = {
  createOtpZodSchema,
};
