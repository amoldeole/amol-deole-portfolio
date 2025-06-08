import { showToast } from '../utils/toastEvent';
import { LoginCredentials, AuthResponse } from '../types/auth.types';
import { User } from '../types/user.types';

const BASE_URL = process.env.REACT_APP_BACKEND_API_URL || 'http://localhost:5000';

class AuthService {
  private tokenKey = 'authToken';
  private userKey = 'authUser';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data: AuthResponse = await response.json();
      if (data.success && data.data) {
        showToast({ type: 'success', message: 'Login successfully!' });
        localStorage.setItem(this.tokenKey, data.data.token);
        localStorage.setItem(this.userKey, JSON.stringify(data.data.user));
      }
      return data;
    } catch (error) {
      showToast({ type: 'error', message: 'Login failed!' });
      return { success: false, message: 'Network error occurred' };
    }
  }

  async signup(userData: Partial<User>): Promise<AuthResponse> {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        credentials: 'include',
      });
      return await res.json();
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: 'Network error occurred' };
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!(this.getToken() && this.getUser());
  }

  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async verifyToken(token?: string): Promise<boolean> {
    try {
      const authToken = token || this.getToken();
      if (!authToken) return false;
      const response = await fetch(`${BASE_URL}/api/auth/verify`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) {
        this.logout();
        return false;
      }
      return true;
    } catch (error) {
      console.error('Token verification error:', error);
      this.logout();
      return false;
    }
  }
}

export const authService = new AuthService();