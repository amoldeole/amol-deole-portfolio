import { getCategoryConfig, CategoryConfig } from '../config/skills.config';

interface ApiSkill {
  _id: string;
  name: string;
  category: string;
  level: string;
  proficiency: number;
  yearsOfExperience: number;
  description: string;
  icon: string;
  color: string;
  isCore: boolean;
  isFeatured: boolean;
  endorsements: number;
  isPublic: boolean;
  order: number;
}

interface ApiResponse {
  success: boolean;
  data: ApiSkill[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface SkillCategory {
  title: string;
  skills: {
    name: string;
    level: number;
    icon: string;
    color?: string;
    description?: string;
    yearsOfExperience?: number;
    isCore?: boolean;
    isFeatured?: boolean;
  }[];
}

interface SkillsData {
  skills: SkillCategory[];
}

export class SkillsService {  protected baseUrl: string;

  constructor() {
    this.baseUrl = process.env.REACT_APP_BACKEND_API_URL || 'http://localhost:5000';
  }

  async getAllSkills(): Promise<SkillsData> {
    try {
      const response = await fetch(`${this.baseUrl}/api/skills?limit=100`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: ApiResponse = await response.json();
      
      if (!apiResponse.success) {
        throw new Error('API request was not successful');
      }

      return this.transformToSkillsFormat(apiResponse.data);
    } catch (error) {
      console.error('Error fetching skills from API:', error);
      
      try {
        const skillsData = await import('../assets/data/skills.json');
        return skillsData.default;
      } catch (fallbackError) {
        console.error('Error loading fallback skills data:', fallbackError);
        return { skills: [] };
      }
    }
  }

  protected transformToSkillsFormat(apiSkills: ApiSkill[]): SkillsData {
    const publicSkills = apiSkills
      .filter(skill => skill.isPublic)
      .sort((a, b) => a.order - b.order);

    const categoryMap = new Map<string, ApiSkill[]>();
    
    publicSkills.forEach(skill => {
      const categoryTitle = this.formatCategoryTitle(skill.category);
      if (!categoryMap.has(categoryTitle)) {
        categoryMap.set(categoryTitle, []);
      }
      categoryMap.get(categoryTitle)!.push(skill);
    });

    const categoryOrder = this.getCategoryOrder();
    
    const sortedCategories = Array.from(categoryMap.entries()).sort(([a], [b]) => {
      const aIndex = categoryOrder.indexOf(a);
      const bIndex = categoryOrder.indexOf(b);
      
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      
      return a.localeCompare(b);
    });

    const skills: SkillCategory[] = sortedCategories.map(([title, categorySkills]) => ({
      title,
      skills: categorySkills.map(skill => ({
        name: skill.name,
        level: skill.proficiency,
        icon: skill.icon,
        color: skill.color,
        description: skill.description,
        yearsOfExperience: skill.yearsOfExperience,
        isCore: skill.isCore,
        isFeatured: skill.isFeatured
      }))
    }));

    return { skills };
  }

  protected formatCategoryTitle(category: string): string {
    const categoryTitleMap: Record<string, string> = {
      'programming': 'Programming Languages',
      'framework': 'Frameworks & Libraries',
      'database': 'Databases',
      'cloud': 'Cloud & DevOps',
      'tool': 'Tools & IDEs',
      'design': 'Design & UI/UX',
      'soft-skill': 'Soft Skills',
      'other': 'Other Skills'
    };

    return categoryTitleMap[category.toLowerCase()] || this.toTitleCase(category);
  }

  protected toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  protected getCategoryOrder(): string[] {
    return [
      'Programming Languages',
      'Frameworks & Libraries', 
      'Databases',
      'Cloud & DevOps',
      'Tools & IDEs',
      'Design & UI/UX',
      'Soft Skills',
      'Other Skills'
    ];
  }
}

class DynamicSkillsService extends SkillsService {
  private categoryConfig: CategoryConfig;
  private cache: { data: SkillsData | null; timestamp: number } = { data: null, timestamp: 0 };
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    super();
    this.categoryConfig = getCategoryConfig();
  }

  async getAllSkills(): Promise<SkillsData> {
    // Check cache first
    const now = Date.now();
    if (this.cache.data && (now - this.cache.timestamp) < this.CACHE_DURATION) {
      console.log('Returning cached skills data');
      return this.cache.data;
    }

    try {
      console.log('Fetching fresh skills data from API');
      const response = await fetch(`${this.baseUrl}/api/skills?limit=100`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: ApiResponse = await response.json();
      
      if (!apiResponse.success) {
        throw new Error('API request was not successful');
      }

      const skillsData = this.transformToSkillsFormat(apiResponse.data);
      
      // Update cache
      this.cache = {
        data: skillsData,
        timestamp: now
      };

      return skillsData;
    } catch (error) {
      console.error('Error fetching skills from API:', error);
      
      // Return cached data if available, even if expired
      if (this.cache.data) {
        console.log('Returning expired cached data due to API error');
        return this.cache.data;
      }
      
      try {
        const skillsData = await import('../assets/data/skills.json');
        return skillsData.default;
      } catch (fallbackError) {
        console.error('Error loading fallback skills data:', fallbackError);
        return { skills: [] };
      }
    }
  }

  // Method to clear cache if needed
  clearCache(): void {
    this.cache = { data: null, timestamp: 0 };
  }

  protected formatCategoryTitle(category: string): string {
    const config = this.categoryConfig[category.toLowerCase()];
    return config?.title || this.toTitleCase(category);
  }

  protected getCategoryOrder(): string[] {
    return Object.values(this.categoryConfig)
      .sort((a, b) => a.order - b.order)
      .map(config => config.title);
  }

  // Method to update category configuration dynamically
  updateCategoryConfig(newConfig: CategoryConfig): void {
    this.categoryConfig = { ...this.categoryConfig, ...newConfig };
  }

  // Get category configuration
  getCategoryConfig(): CategoryConfig {
    return this.categoryConfig;
  }

  // Get category info for a specific category
  getCategoryInfo(category: string) {
    return this.categoryConfig[category.toLowerCase()];
  }

  // Additional methods for enhanced functionality
  async getFeaturedSkills(): Promise<ApiSkill[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/skills?featured=true&limit=20`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: ApiResponse = await response.json();
      return apiResponse.success ? apiResponse.data : [];
    } catch (error) {
      console.error('Error fetching featured skills:', error);
      return [];
    }
  }

  async getSkillsByCategory(category: string): Promise<ApiSkill[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/skills?category=${category}&limit=50`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: ApiResponse = await response.json();
      return apiResponse.success ? apiResponse.data : [];
    } catch (error) {
      console.error(`Error fetching skills for category ${category}:`, error);
      return [];
    }
  }

  async getCoreSkills(): Promise<ApiSkill[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/skills?limit=100`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: ApiResponse = await response.json();
      return apiResponse.success ? apiResponse.data.filter(skill => skill.isCore) : [];
    } catch (error) {
      console.error('Error fetching core skills:', error);
      return [];
    }
  }
}

export const dynamicSkillsService = new DynamicSkillsService();


// Export types for use in components
export type { SkillsData, SkillCategory, ApiSkill };