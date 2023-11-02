import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { ProjectRoutes } from '../modules/project/project.route';
const router = Router();

const moduleRoutes = [
  {
    route: UserRoutes,
  },
  {
    route: AuthRoutes,
  },
  {
    route: ProjectRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.route));

export default router;
