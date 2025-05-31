import { Project } from './../types/project.types';
import projectsData from '../assets/data/projects.json';

export const ProjectsService = {
  getAllProjects: (): Project[] => projectsData.experience,
  
  getFeaturedProjects: (): Project[] => 
    projectsData.experience.filter(experience => experience.featured),
    
  getProjectsByYear: (year: string): Project[] => 
    projectsData.experience.filter(experience => experience.year === year),
    
  getProjectsByTechnology: (tech: string): Project[] =>
    projectsData.experience.filter(experience => 
      experience.technologies.includes(tech)
    ),
    
  getProjectByTitle: (title: string): Project | undefined =>
    projectsData.experience.find(experience => 
      experience.title.toLowerCase() === title.toLowerCase()
    )
};