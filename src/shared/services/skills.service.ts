import { ApiResponse } from '../types/api.model';
import { ApiSkill, SkillCategory, SkillsData } from '../types/skills.model';

class SkillsService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.REACT_APP_BACKEND_API_URL || 'http://localhost:5000';
  }

  async getAllSkills(): Promise<SkillsData> {
    try {
      // Fetch all skills without pagination limit
      const response = await fetch(`${this.baseUrl}/api/skills?limit=100`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: ApiResponse = await response.json();
      
      if (!apiResponse.success) {
        throw new Error('API request was not successful');
      }

      // Transform API data to dynamic categories format
      return this.transformToSkillsFormat(apiResponse.data);
    } catch (error) {
      console.error('Error fetching skills from API:', error);
      
      // Fallback to local data if API fails
      try {
        const skillsData = await import('../../assets/data/skills.json');
        return skillsData.default;
      } catch (fallbackError) {
        console.error('Error loading fallback skills data:', fallbackError);
        return { skills: [] };
      }
    }
  }

  private transformToSkillsFormat(apiSkills: ApiSkill[]): SkillsData {
    // Filter only public skills and sort by order
    const publicSkills = apiSkills
      .filter(skill => skill.isPublic)
      .sort((a, b) => a.order - b.order);

    // Group skills by category dynamically
    const categoryMap = new Map<string, ApiSkill[]>();
    
    publicSkills.forEach(skill => {
      const categoryTitle = this.formatCategoryTitle(skill.category);
      if (!categoryMap.has(categoryTitle)) {
        categoryMap.set(categoryTitle, []);
      }
      categoryMap.get(categoryTitle)!.push(skill);
    });

    // Define category order for consistent display
    const categoryOrder = this.getCategoryOrder();
    
    // Sort categories based on predefined order, then alphabetically
    const sortedCategories = Array.from(categoryMap.entries()).sort(([a], [b]) => {
      const aIndex = categoryOrder.indexOf(a);
      const bIndex = categoryOrder.indexOf(b);
      
      // If both categories are in the predefined order
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      
      // If only one category is in the predefined order
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      
      // If neither category is in the predefined order, sort alphabetically
      return a.localeCompare(b);
    });

    // Transform to skills.json format
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

  private formatCategoryTitle(category: string): string {
    // Convert category to title case and handle special cases
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

  private toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  private getCategoryOrder(): string[] {
    // Define the preferred order of categories for display
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

  // Get unique categories from API
  async getSkillCategories(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/skills/categories`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();
      return apiResponse.success ? apiResponse.data : [];
    } catch (error) {
      console.error('Error fetching skill categories:', error);
      return [];
    }
  }

  // Additional methods for more specific data fetching
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
      return apiResponse.success ? apiResponse.data.filter((skill: { isCore: any; }) => skill.isCore) : [];
    } catch (error) {
      console.error('Error fetching core skills:', error);
      return [];
    }
  }

  // Get skills grouped by level
  async getSkillsByLevel(): Promise<Record<string, ApiSkill[]>> {
    try {
      const allSkills = await this.getAllSkills();
      const skillsByLevel: Record<string, ApiSkill[]> = {};
      
      allSkills.skills.forEach(category => {
        category.skills.forEach(skill => {
          const level = this.getLevelFromProficiency(skill.level);
          if (!skillsByLevel[level]) {
            skillsByLevel[level] = [];
          }
          skillsByLevel[level].push(skill as any);
        });
      });

      return skillsByLevel;
    } catch (error) {
      console.error('Error grouping skills by level:', error);
      return {};
    }
  }

  private getLevelFromProficiency(proficiency: number): string {
    if (proficiency >= 90) return 'Expert';
    if (proficiency >= 75) return 'Advanced';
    if (proficiency >= 60) return 'Intermediate';
    return 'Beginner';
  }
}

export const skillsService = new SkillsService();

// Maintain backward compatibility
export const SkillsServiceLegacy = {
  getAllSkills: () => skillsService.getAllSkills()
};
// Export types for use in components
export type { SkillsData, SkillCategory, ApiSkill };