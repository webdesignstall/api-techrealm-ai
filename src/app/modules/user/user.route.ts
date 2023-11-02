import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';
import { UserController } from './user.controller';
import { AuthMiddleware } from '../../middlewares/authMiddleware';
const router = Router();

router.post(
  '/register',
  validateRequest(UserValidation.createAccountZodSchema),
  UserController.register
);

router.get('/users/:id', AuthMiddleware.authVerify, UserController.getSingle);

router.patch(
  '/users/:id',
  AuthMiddleware.authVerify,
  UserController.employeeUpdate
);

export const UserRoutes = router;
