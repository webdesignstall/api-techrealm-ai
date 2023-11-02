import { z } from 'zod';

const createProjectZodSchema = z.object({
  body: z.object({
    projectName: z.string({ required_error: 'Project Name is required' }),
    prompt: z.string({
      required_error: 'Project Description / Prompt is required',
    }),
    projectType: z.string({
      required_error: 'Project type is required',
    }),
  }),
});

export const ProjectValidation = {
  createProjectZodSchema,
};
