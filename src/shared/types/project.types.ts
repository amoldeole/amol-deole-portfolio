import { ProjectsApiResponse } from "./api.model";

export interface Project {
  _id: string;
  title: string;
  description: string;
  shortDescription: string;
  technologies: string[];
  category: string;
  status: string;
  priority: string;
  startDate: string;
  endDate?: string;
  demoUrl?: string;
  githubUrl?: string;
  images: string[];
  features: string[];
  challenges?: string;
  learnings?: string;
  teamSize?: number;
  role?: string;
  isPublic: boolean;
  featured: boolean;
  viewCount: number;
  likes: number;
  tags: string[];
  year: string;
  createdAt: string;
  updatedAt: string;
}

const mapApiProjectToProject = (apiProject: ProjectsApiResponse): Project => ({
  _id: apiProject._id,
  title: apiProject.title,
  description: apiProject.description,
  shortDescription: apiProject.shortDescription,
  technologies: apiProject.technologies,
  category: apiProject.category,
  status: apiProject.status,
  priority: apiProject.priority,
  startDate: apiProject.startDate,
  endDate: apiProject.endDate,
  demoUrl: apiProject.demoUrl,
  githubUrl: apiProject.githubUrl,
  images: apiProject.images,
  features: apiProject.features,
  challenges: apiProject.challenges,
  learnings: apiProject.learnings,
  teamSize: apiProject.teamSize,
  role: apiProject.role,
  isPublic: apiProject.isPublic,
  featured: apiProject.isFeatured,
  viewCount: apiProject.viewCount,
  likes: apiProject.likes,
  tags: apiProject.tags,
  year: new Date(apiProject.startDate).getFullYear().toString(),
  createdAt: apiProject.createdAt,
  updatedAt: apiProject.updatedAt
});


export {mapApiProjectToProject}