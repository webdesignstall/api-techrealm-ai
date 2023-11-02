import { z } from 'zod';
import { strongPasswordRegex } from '../user/user.constant';

const loginZodValidation = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required!' }).email(),
    password: z.string({ required_error: 'Password is required!' }),
  }),
});

const refreshTokenZodValidation = z.object({
  cookies: z.object({
    refresh_token: z.string({ required_error: 'Refresh token is required!' }),
  }),
});
const otpVerifyZodValidation = z.object({
  params: z.object({
    email: z.string({ required_error: 'Email is required!' }).email(),
    otp: z.string({ required_error: 'OTP is required!' }).length(6),
  }),
});
const resendOtpZodValidation = z.object({
  params: z.object({
    email: z.string({ required_error: 'Email is required!' }).email(),
  }),
});

const createNewPasswordZodValidation = z.object({
  body: z
    .object({
      token: z.string({ required_error: 'Token is required!' }),
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

const changePasswordZodSchema = z.object({
  body: z
    .object({
      oldPassword: z
        .string({ required_error: 'Old Password is required' })
        .trim(),
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

const resetPasswordZodSchema = z.object({
  body: z
    .object({
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

export const AuthValidation = {
  loginZodValidation,
  refreshTokenZodValidation,
  changePasswordZodSchema,
  otpVerifyZodValidation,
  resendOtpZodValidation,
  createNewPasswordZodValidation,
  resetPasswordZodSchema,
};
