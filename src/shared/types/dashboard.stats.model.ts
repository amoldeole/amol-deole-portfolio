export interface DashboardStats {
  projects: { total: number; completed: number; inProgress: number; planning: number };
  certificates: { total: number; verified: number };
  skills: { total: number; core: number; featured: number };
  experience: { total: number; current: number };
  education: { total: number; current: number };
  testimonials: { total: number; featured: number };
  contacts: { pending: number; total: number };
  engagement: { totalViews: number; totalLikes: number };
}