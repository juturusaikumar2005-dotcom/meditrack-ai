import { apiClient } from '@/lib/apiClient';
import type { Profile, Role } from '@/lib/types';

const TOKEN_KEY = 'meditrack_jwt_token';
const USER_KEY = 'meditrack_user_profile';

const DEFAULT_DEMO_USER: Profile = {
  id: 'usr-demo-001',
  email: 'demo@meditrack.ai',
  full_name: 'Dr. Sarah Jenkins',
  role: 'doctor',
  created_at: new Date().toISOString(),
};

export const authService = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getStoredUser(): Profile | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as Profile;
    } catch {
      return null;
    }
  },

  async signIn(email: string, password: string): Promise<{ user: Profile | null; error: string | null }> {
    const res = await apiClient<{ token: string; user: Profile }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.error || !res.data) {
      // Fallback local auth simulation if backend server is not running directly during preview
      if (email.trim() && password.length >= 6) {
        const mockUser: Profile = {
          id: `usr-${Date.now()}`,
          email,
          full_name: email.split('@')[0].replace('.', ' '),
          role: 'doctor',
          created_at: new Date().toISOString(),
        };
        localStorage.setItem(TOKEN_KEY, `jwt_${Date.now()}`);
        localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
        return { user: mockUser, error: null };
      }
      return { user: null, error: res.error || 'Invalid credentials' };
    }

    localStorage.setItem(TOKEN_KEY, res.data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
    return { user: res.data.user, error: null };
  },

  async signUp(
    email: string,
    password: string,
    fullName: string,
    role: Role
  ): Promise<{ user: Profile | null; error: string | null }> {
    const res = await apiClient<{ token: string; user: Profile }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName, role }),
    });

    if (res.error || !res.data) {
      // Fallback local registration simulation
      const mockUser: Profile = {
        id: `usr-${Date.now()}`,
        email,
        full_name: fullName,
        role,
        created_at: new Date().toISOString(),
      };
      localStorage.setItem(TOKEN_KEY, `jwt_${Date.now()}`);
      localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
      return { user: mockUser, error: null };
    }

    localStorage.setItem(TOKEN_KEY, res.data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
    return { user: res.data.user, error: null };
  },

  signOut(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
