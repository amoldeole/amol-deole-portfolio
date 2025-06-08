import { getCategoryConfig, CategoryConfig } from '../../config/skills.config';
import { ApiResponse } from '../types/api.model';
import { ApiSkill, SkillCategory, SkillsData } from '../types/skills.model';
const REACT_APP_BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;

export class SkillsService {
  async getAllSkills(): Promise<SkillsData> {
    try {
      const response = await fetch(`${REACT_APP_BACKEND_API_URL}/api/skills?limit=100`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const apiResponse: ApiResponse = await response.json();
      if (!apiResponse.success) {
        throw new Error('API request was not successful');
      }
      return this.transformToSkillsFormat((apiResponse.data as unknown as ApiSkill[]) || []);
    } catch (error) {
      console.error('Error fetching skills from API:', error);
      try {
        const skillsData = await import('../../assets/data/skills.json');
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
    const now = Date.now();
    if (this.cache.data && (now - this.cache.timestamp) < this.CACHE_DURATION) {
      console.log('Returning cached skills data');
      return this.cache.data;
    }
    try {
      console.log('Fetching fresh skills data from API');
      const response = await fetch(`${REACT_APP_BACKEND_API_URL}/api/skills?limit=100`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const apiResponse: ApiResponse = await response.json();
      if (!apiResponse.success) {
        throw new Error('API request was not successful');
      }
      const skillsData = this.transformToSkillsFormat(apiResponse.data || []);
      this.cache = {
        data: skillsData,
        timestamp: now
      };
      return skillsData;
    } catch (error) {
      console.error('Error fetching skills from API:', error);
      if (this.cache.data) {
        console.log('Returning expired cached data due to API error');
        return this.cache.data;
      }
      try {
        const skillsData = await import('../../assets/data/skills.json');
        return skillsData.default;
      } catch (fallbackError) {
        console.error('Error loading fallback skills data:', fallbackError);
        return { skills: [] };
      }
    }
  }

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

  updateCategoryConfig(newConfig: CategoryConfig): void {
    this.categoryConfig = { ...this.categoryConfig, ...newConfig };
  }

  getCategoryConfig(): CategoryConfig {
    return this.categoryConfig;
  }

  getCategoryInfo(category: string) {
    return this.categoryConfig[category.toLowerCase()];
  }

  async getFeaturedSkills(): Promise<ApiSkill[]> {
    try {
      const response = await fetch(`${REACT_APP_BACKEND_API_URL}/api/skills?featured=true&limit=20`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const apiResponse: ApiResponse = await response.json();
      return apiResponse.success ? apiResponse.data || [] : [];
    } catch (error) {
      console.error('Error fetching featured skills:', error);
      return [];
    }
  }

  async getSkillsByCategory(category: string): Promise<ApiSkill[]> {
    try {
      const response = await fetch(`${REACT_APP_BACKEND_API_URL}/api/skills?category=${category}&limit=50`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const apiResponse: ApiResponse = await response.json();
      return apiResponse.success ? apiResponse.data || [] : [];
    } catch (error) {
      console.error(`Error fetching skills for category ${category}:`, error);
      return [];
    }
  }

  async getCoreSkills(): Promise<ApiSkill[]> {
    try {
      const response = await fetch(`${REACT_APP_BACKEND_API_URL}/api/skills?limit=100`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const apiResponse: ApiResponse = await response.json();
      return apiResponse.success ? (apiResponse.data as ApiSkill[] || []).filter((skill: ApiSkill) => skill.isCore) : [];
    } catch (error) {
      console.error('Error fetching core skills:', error);
      return [];
    }
  }
}

export const dynamicSkillsService = new DynamicSkillsService();