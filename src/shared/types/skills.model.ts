// API skill as received from backend
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

// Normalized skill for frontend use
interface Skill {
  name: string;
  level: number;
  icon: string;
  color?: string;
  description?: string;
  yearsOfExperience?: number;
  isCore?: boolean;
  isFeatured?: boolean;
}

// Category of skills
interface SkillCategory {
  title: string;
  skills: Skill[];
}

// Skills data structure
interface SkillsData {
  skills: SkillCategory[];
}

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

export type { ApiSkill, Skill, SkillCategory, SkillsData };