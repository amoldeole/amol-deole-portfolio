export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  pagination?: PaginationMeta;
  meta?: PaginationMeta; // Alternative name some APIs use
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrev?: boolean;
  pages?: number; // Alternative name for totalPages
}

export interface PaginatedResponse<T> {
  items?: T[];
  // Backend specific response structure
  chats?: T[];
  messages?: T[];
  notifications?: T[];
  // Pagination info
  pagination?: PaginationMeta;
  unreadCount?: number;
}

export interface QueryOptions {
  page?: number;
  limit?: number;
  sort?: string;
  filter?: Record<string, any>;
  populate?: string | string[];
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}

// Re-export chat types for convenience
export * from './chat';