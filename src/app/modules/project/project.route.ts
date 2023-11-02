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

router.get('/projects/:link', ProjectController.getSingleProject);

router.get(
  '/projects',
  AuthMiddleware.authVerify,
  ProjectController.getAllProject
);
router.get(
  '/projects-byids/:ids',
  ProjectController.getProjectsByLocalStorageProjectIds
);

router.patch('/projects-update', ProjectController.updateProject);

export const ProjectRoutes = router;
