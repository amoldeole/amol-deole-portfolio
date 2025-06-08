import { ApiResponse } from '../types/api.model';
import { User } from '../types/user.types';

const BASE_URL = process.env.REACT_APP_BACKEND_API_URL || 'http://localhost:5000';

export class UserService {

  // User login
  async login(credentials: { email: string; password: string }): Promise<ApiResponse> {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      credentials: 'include',
    });
    return res.json();
  }

  // Get all users (Admin only)
  async getUsers(params: string = ''): Promise<ApiResponse> {
    const res = await fetch(`${BASE_URL}/api/auth/users${params}`, {
      credentials: 'include',
    });
    return res.json();
  }

  // Get user by ID
  async getUserById(id: string): Promise<ApiResponse> {
    const res = await fetch(`${BASE_URL}/api/auth/users/${id}`, {
      credentials: 'include',
    });
    return res.json();
  }

  // Update user by ID
  async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse> {
    const res = await fetch(`${BASE_URL}/api/auth/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
      credentials: 'include',
    });
    return res.json();
  }

  // Delete user by ID
  async deleteUser(id: string): Promise<ApiResponse> {
    const res = await fetch(`${BASE_URL}/api/auth/users/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return res.json();
  }

  // Toggle user active/inactive status
  async toggleUserStatus(id: string): Promise<ApiResponse> {
    const res = await fetch(`${BASE_URL}/api/auth/users/${id}/toggle-status`, {
      method: 'PATCH',
      credentials: 'include',
    });
    return res.json();
  }

  // Change user password
  async changeUserPassword(id: string, password: string): Promise<ApiResponse> {
    const res = await fetch(`${BASE_URL}/api/auth/users/${id}/change-password`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
      credentials: 'include',
    });
    return res.json();
  }

  // Verify JWT token
  async verifyToken(): Promise<ApiResponse> {
    const res = await fetch(`${BASE_URL}/api/auth/verify`, {
      credentials: 'include',
    });
    return res.json();
  }

  // Get current user info
  async getMe(): Promise<ApiResponse> {
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      credentials: 'include',
    });
    return res.json();
  }

  // Update current user profile
  async updateProfile(profileData: Partial<User>): Promise<ApiResponse> {
    const res = await fetch(`${BASE_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
      credentials: 'include',
    });
    return res.json();
  }

  // Get user statistics
  async getStats(): Promise<ApiResponse> {
    const res = await fetch(`${BASE_URL}/api/auth/stats`, {
      credentials: 'include',
    });
    return res.json();
  }
}

export const userService = new UserService();