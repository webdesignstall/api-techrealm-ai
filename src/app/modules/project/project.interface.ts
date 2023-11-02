import { Model } from 'mongoose';

export type IProject = {
  userId?: string;
  projectName: string;
  prompt: string;
  projectType: string;
  link: string;
  image: string;
};

export type IProjectModel = Model<IProject, Record<string, unknown>>;

export type IProjectFilters = {
  searchTerm?: string;
  projectName?: string;
  projectType?: string;
};
