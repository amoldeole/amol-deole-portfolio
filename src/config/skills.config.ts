export interface CategoryConfig {
  [key: string]: {
    title: string;
    order: number;
    icon?: string;
    color?: string;
  };
}

export const defaultCategoryConfig: CategoryConfig = {
  'programming': {
    title: 'Programming Languages',
    order: 1,
    icon: '💻',
    color: '#4A90E2'
  },
  'framework': {
    title: 'Frameworks & Libraries',
    order: 2,
    icon: '🚀',
    color: '#50C878'
  },
  'database': {
    title: 'Databases',
    order: 3,
    icon: '🗄️',
    color: '#FF6B35'
  },
  'cloud': {
    title: 'Cloud & DevOps',
    order: 4,
    icon: '☁️',
    color: '#FF9500'
  },
  'tool': {
    title: 'Tools & IDEs',
    order: 5,
    icon: '🛠️',
    color: '#8E44AD'
  },
  'design': {
    title: 'Design & UI/UX',
    order: 6,
    icon: '🎨',
    color: '#E74C3C'
  },
  'soft-skill': {
    title: 'Soft Skills',
    order: 7,
    icon: '🤝',
    color: '#2ECC71'
  },
  'other': {
    title: 'Other Skills',
    order: 8,
    icon: '🔧',
    color: '#95A5A6'
  }
};

// You can override this config via environment variables or external config
export const getCategoryConfig = (): CategoryConfig => {
  // You could load this from an API endpoint or environment variables
  // For now, return the default configuration
  return defaultCategoryConfig;
};