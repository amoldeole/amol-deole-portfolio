import { mapApiProjectToProject, Project } from '../types/project.types';
import Projects from '../../assets/data/projects.json';
import { ApiResponse, ProjectsApiResponse } from '../types/api.model';

const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL;


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
      
      return result.data ? result.data.map(mapApiProjectToProject) : [];
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
      
      return result.data ? result.data.map(mapApiProjectToProject) : [];
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
      
      return result.data ? result.data.map(mapApiProjectToProject) : [];
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
      
      return result.data ? mapApiProjectToProject(result.data) : undefined;
    } catch (error) {
      console.error('Error fetching project by ID:', error);
      throw error;
    }
  }
};