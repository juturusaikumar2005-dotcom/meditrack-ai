const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: string | null }> {
  try {
    const token = localStorage.getItem('meditrack_jwt_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const result = await response.json();

    if (!response.ok) {
      return { data: null, error: result.error || 'API Request failed' };
    }

    return { data: result as T, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Network error connecting to API',
    };
  }
}
