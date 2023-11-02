import { z } from 'zod';
import { strongPasswordRegex } from './user.constant';

const createAccountZodSchema = z.object({
  body: z
    .object({
      email: z
        .string({ required_error: 'Email is required' })
        .email({ message: 'Invalid email address' }),
      name: z.object({
        firstName: z
          .string({ required_error: 'First Name is required' })
          .min(2)
          .max(100),
        lastName: z
          .string({ required_error: 'Last Name is required' })
          .min(2)
          .max(100),
      }),
      password: z
        .string({ required_error: 'Password is required' })
        .regex(strongPasswordRegex, {
          message:
            'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&).',
        }),
      confirmPassword: z.string({
        required_error: 'Confirm Password is required',
      }),
    })
    .refine(data => data.password === data.confirmPassword, {
      message: 'Password does not match!',
    }),
});

export const UserValidation = {
  createAccountZodSchema,
};
