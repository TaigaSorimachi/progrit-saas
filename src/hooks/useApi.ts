import { useState, useEffect } from 'react';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    total?: number;
    limit?: number;
    offset?: number;
    hasNext?: boolean;
  };
}

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// 汎用APIフック
export function useApi<T>(
  url: string,
  options: RequestInit = {}
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result.data || result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return { data, loading, error, refetch: fetchData };
}

// APIミューテーション用フック
export function useApiMutation<TRequest, TResponse>(
  url: string,
  options: RequestInit = {}
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (data: TRequest): Promise<TResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url, {
        method: 'POST',
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}

// 特定のAPIエンドポイント用フック
export function useUsers() {
  return useApi<any[]>('/api/users');
}

export function useSaasConnections() {
  return useApi<any[]>('/api/saas');
}

export function useWorkflows() {
  return useApi<any[]>('/api/workflows');
}

export function useDashboardStats() {
  return useApi<{
    totalUsers: number;
    activeUsers: number;
    totalSaasAccounts: number;
    activeSaasAccounts: number;
    totalWorkflows: number;
    pendingWorkflows: number;
    todayLogs: number;
    recentWorkflows: any[];
    saasProviderStats: Record<string, number>;
    departmentStats: Record<string, number>;
  }>('/api/dashboard/stats');
}

export function useAuditLogs(params?: {
  action?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}) {
  const searchParams = new URLSearchParams();

  if (params?.action) searchParams.append('action', params.action);
  if (params?.userId) searchParams.append('userId', params.userId);
  if (params?.startDate) searchParams.append('startDate', params.startDate);
  if (params?.endDate) searchParams.append('endDate', params.endDate);
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.offset) searchParams.append('offset', params.offset.toString());

  const url = `/api/logs${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  return useApi<any[]>(url);
}
