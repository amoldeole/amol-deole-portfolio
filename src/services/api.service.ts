import { authService } from './auth.service';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.REACT_APP_BACKEND_API_URL || 'http://localhost:5000';
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const token = authService.getToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const url = `${this.baseUrl}/api${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token might be expired, clear it and redirect
          authService.logout();
          window.location.href = '/admin/login';
          throw new Error('Authentication failed. Please login again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async requestWithFormData<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const token = authService.getToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const url = `${this.baseUrl}/api${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...authService.getAuthHeaders(),
        },
        body: formData,
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          authService.logout();
          window.location.href = '/admin/login';
          throw new Error('Authentication failed. Please login again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request with form data failed:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }
}

export const apiService = new ApiService();
