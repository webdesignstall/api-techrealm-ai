import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { ProjectValidation } from './project.validation';
import { ProjectController } from './project.controller';
import { AuthMiddleware } from '../../middlewares/authMiddleware';
const router = Router();

router.post(
  '/projects',
  validateRequest(ProjectValidation.createProjectZodSchema),
  ProjectController.createProject
);

router.get(
  '/projects/:link',
  AuthMiddleware.authVerify,
  ProjectController.getSingleProject
);

router.get(
  '/projects',
  AuthMiddleware.authVerify,
  ProjectController.getAllProject
);
router.get(
  '/projects-byids/:ids',
  ProjectController.getProjectsByLocalStorageProjectIds
);

export const ProjectRoutes = router;
