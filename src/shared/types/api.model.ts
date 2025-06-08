export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ProjectsApiResponse {
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
  isFeatured: boolean;
  viewCount: number;
  likes: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}