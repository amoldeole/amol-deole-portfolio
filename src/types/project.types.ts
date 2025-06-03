export interface Project {
  id: string;
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