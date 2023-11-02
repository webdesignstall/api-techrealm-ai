import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { OtpValidation } from './otp.validation';
import { OtpController } from './otp.controller';
const router = Router();

router.post(
  '/samples',
  validateRequest(OtpValidation.createSampleZodSchema),
  OtpController.createSample
);

router.get('/samples/:id', OtpController.getSingleSample);

router.get('/samples', OtpController.getAllSamples);
router.patch(
  '/samples/:id',
  validateRequest(OtpValidation.createSampleZodSchema),
  OtpController.updateSample
);

router.delete('/samples/:id', OtpController.deleteSample);

export const SampleRoutes = router;
