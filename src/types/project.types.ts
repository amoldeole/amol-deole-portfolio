export interface Project {
  title: string;
  company: string;
  period: string;
  location: string;
  description: string;
  image: string;
  technologies: string[];
  highlights: string;
  responsibilities: string[];
  featured: boolean;
  year: string;
  urls?: {
    ios?: string;
    admin?: string;
    web?: string;
  };
  features?: {
    core: string[];
  };
  architecture?: {
    components: string[];
  };
}