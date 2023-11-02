import { Request, Response, Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
import { AuthController } from './auth.controller';
import limiterHelper from '../../../helpers/limiterHelper';
import { AuthMiddleware } from '../../middlewares/authMiddleware';
const router = Router();

router.get(
  '/auth/auth-check',
  AuthMiddleware.authVerify,
  (req: Request, res: Response) => {
    res.status(200).json({ ok: true });
  }
);

router.post(
  '/login',
  // limiterHelper(20, 5),
  validateRequest(AuthValidation.loginZodValidation),
  AuthController.loginUser
);

router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenZodValidation),
  AuthController.refreshToken
);

router.get(
  '/otp/:email/:otp',
  validateRequest(AuthValidation.otpVerifyZodValidation),
  AuthController.otpVerify
);

router.get(
  '/resend-otp/:email',
  limiterHelper(30, 10),
  validateRequest(AuthValidation.resendOtpZodValidation),
  AuthController.sendResendOtp
);
router.post(
  '/change-password',
  validateRequest(AuthValidation.changePasswordZodSchema),
  AuthMiddleware.authVerify,
  AuthController.changePassword
);

router.post(
  '/passwords',
  validateRequest(AuthValidation.createNewPasswordZodValidation),
  AuthController.setNewPassword
);
router.patch(
  '/passwords',
  validateRequest(AuthValidation.resetPasswordZodSchema),
  AuthController.resetPassword
);
export const AuthRoutes = router;
