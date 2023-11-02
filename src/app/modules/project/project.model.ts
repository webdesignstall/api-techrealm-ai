import { Schema, model } from 'mongoose';
import { IProject, IProjectModel } from './project.interface';

const projectSchema = new Schema<IProject>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    projectName: {
      type: String,
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    projectType: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      // unique: true,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
  }
);

export const Project = model<IProject, IProjectModel>('Project', projectSchema);
