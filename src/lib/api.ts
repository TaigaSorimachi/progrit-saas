import { ApiResponse } from '@/types';

// APIクライアントの基本設定
export class ApiClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.headers,
          ...options?.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'APIエラーが発生しました');
      }

      return {
        success: true,
        data: data.data,
        meta: data.meta,
        links: data.links,
      };
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: {
          code: 'API_ERROR',
          message:
            error instanceof Error ? error.message : 'APIエラーが発生しました',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Set authorization header
  setAuthToken(token: string) {
    this.headers['Authorization'] = `Bearer ${token}`;
  }

  // Remove authorization header
  removeAuthToken() {
    delete this.headers['Authorization'];
  }
}

// Export default instance
export const apiClient = new ApiClient();

// Helper functions for common API operations
export const api = {
  users: {
    list: () => apiClient.get('/users'),
    get: (id: string) => apiClient.get(`/users/${id}`),
    create: (data: any) => apiClient.post('/users', data),
    update: (id: string, data: any) => apiClient.patch(`/users/${id}`, data),
    delete: (id: string) => apiClient.delete(`/users/${id}`),
  },

  saas: {
    list: () => apiClient.get('/saas'),
    get: (id: string) => apiClient.get(`/saas/${id}`),
    connect: (provider: string, config: any) =>
      apiClient.post(`/saas/connect/${provider}`, config),
    disconnect: (id: string) => apiClient.delete(`/saas/${id}`),
    sync: (id: string) => apiClient.post(`/saas/${id}/sync`),
  },

  workflows: {
    list: () => apiClient.get('/workflows'),
    get: (id: string) => apiClient.get(`/workflows/${id}`),
    create: (data: any) => apiClient.post('/workflows', data),
    approve: (id: string) => apiClient.post(`/workflows/${id}/approve`),
    reject: (id: string) => apiClient.post(`/workflows/${id}/reject`),
  },

  logs: {
    list: (params?: any) =>
      apiClient.get(`/logs${params ? `?${new URLSearchParams(params)}` : ''}`),
    get: (id: string) => apiClient.get(`/logs/${id}`),
  },
};
