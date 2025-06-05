import { Project } from './../types/project.types';
import Projects from '../assets/data/projects.json';

const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL || 'http://localhost:5000';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  message?: string;
}

interface ProjectsApiResponse {
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

// Map API response to frontend Project type
const mapApiProjectToProject = (apiProject: ProjectsApiResponse): Project => ({
  id: apiProject._id,
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

export const ProjectsService = {
  getAllProjects: async (): Promise<Project[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects?page=1&limit=100`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<ProjectsApiResponse[]> = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch projects');
      }
      
      return result.data.map(mapApiProjectToProject);
    } catch (error) {
      console.error('Error fetching projects:', error);
      return Projects.data.map(mapApiProjectToProject); // Fallback to local data
    }
  },
  
  getFeaturedProjects: async (): Promise<Project[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects?featured=true&page=1&limit=100`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<ProjectsApiResponse[]> = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch featured projects');
      }
      
      return result.data.map(mapApiProjectToProject);
    } catch (error) {
      console.error('Error fetching featured projects:', error);
      throw error;
    }
  },
    
  getProjectsByYear: async (year: string): Promise<Project[]> => {
    try {
      const allProjects = await ProjectsService.getAllProjects();
      return allProjects.filter(project => project.year === year);
    } catch (error) {
      console.error('Error fetching projects by year:', error);
      throw error;
    }
  },
    
  getProjectsByTechnology: async (tech: string): Promise<Project[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects?technology=${encodeURIComponent(tech)}&page=1&limit=100`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<ProjectsApiResponse[]> = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch projects by technology');
      }
      
      return result.data.map(mapApiProjectToProject);
    } catch (error) {
      console.error('Error fetching projects by technology:', error);
      throw error;
    }
  },
    
  getProjectByTitle: async (title: string): Promise<Project | undefined> => {
    try {
      const allProjects = await ProjectsService.getAllProjects();
      return allProjects.find(project => 
        project.title.toLowerCase() === title.toLowerCase()
      );
    } catch (error) {
      console.error('Error fetching project by title:', error);
      throw error;
    }
  },

  getProjectById: async (id: string): Promise<Project | undefined> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return undefined;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<ProjectsApiResponse> = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch project');
      }
      
      return mapApiProjectToProject(result.data);
    } catch (error) {
      console.error('Error fetching project by ID:', error);
      throw error;
    }
  }
};