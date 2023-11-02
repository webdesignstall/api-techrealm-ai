import { IProject } from './project.interface';
import { Project } from './project.model';

const createProject = async (payload: IProject) => {
  const result = await Project.create(payload);

  return result;
};

const getProjectsByAuthUser = async (
  userId: string
): Promise<IProject[] | null> => {
  return Project.find({ userId });
};
const getProjectsByLocalStorageProjectIds = async (
  ids: string
): Promise<IProject[] | null> => {
  return Project.find({ _id: { $in: ids } });
};

const getSingleProject = async (link: string): Promise<IProject | null> => {
  return Project.findOne({ link: link });
};

export const ProjectService = {
  createProject,
  getProjectsByAuthUser,
  getSingleProject,
  getProjectsByLocalStorageProjectIds,
};
