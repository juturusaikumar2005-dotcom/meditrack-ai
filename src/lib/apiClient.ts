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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const result = await response.json();

    if (!response.ok) {
      return { data: null, error: result.error || 'API Request failed' };
    }

    return { data: result as T, error: null };
  } catch (err) {
    const isAbort = err instanceof Error && err.name === 'AbortError';
    return {
      data: null,
      error: isAbort ? 'API Request timed out after 25 seconds' : err instanceof Error ? err.message : 'Network error connecting to API',
    };
  }
}
