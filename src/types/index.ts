// ユーザー関連型
export interface User {
  id: string;
  employeeId?: string;
  name: string;
  email: string;
  avatar?: string;
  department: string;
  position: string;
  role?: UserRole;
  status: UserStatus;
  hireDate: string;
  terminationDate?: string | null;
  lastActive?: string;
  lastLoginAt?: string;
  manager?: string | null;
  saasConnections?: number;
  saasAccounts?: SaaSAccount[];
  phone?: string;
  location?: string;
  permissions?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export type UserRole = 'admin' | 'manager' | 'user';
export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';

// SaaS アカウント関連型
export interface SaaSAccount {
  id: string;
  saasId: string;
  accountId: string;
  status: 'active' | 'inactive' | 'suspended';
}

// SaaS関連型
export interface SaaSConnection {
  id: string;
  name: string;
  type: string;
  provider?: SaaSProvider;
  status: SaaSStatus;
  lastSync?: string;
  lastSyncAt: string;
  syncStatus: 'success' | 'error' | 'warning';
  userCount: number;
  totalUsers: number;
  errorCount: number;
  licenseCount?: number;
  usagePercentage?: number;
  monthlyActive?: number;
  apiHealth?: ApiHealth;
  features?: string[];
  setupDate?: string;
  config: {
    [key: string]: any;
  };
  healthStatus: {
    status: ApiHealth;
    responseTime: number;
    uptime: number;
    lastCheck: string;
  };
  usage: {
    requestCount: number;
    errorRate: number;
    avgResponseTime: number;
  };
}

export type SaaSProvider =
  | 'google'
  | 'microsoft'
  | 'slack'
  | 'github'
  | 'zoom'
  | 'salesforce'
  | 'aws'
  | 'azure';

export type SaaSStatus =
  | 'connected'
  | 'disconnected'
  | 'error'
  | 'syncing'
  | 'warning'
  | 'online'
  | 'offline';
export type ApiHealth = 'healthy' | 'degraded' | 'down';

// Status関連型
export type StatusType =
  | 'healthy'
  | 'degraded'
  | 'down'
  | 'warning'
  | 'error'
  | 'success'
  | 'active'
  | 'inactive'
  | 'pending';

// ワークフロー関連型
export interface WorkflowRequest {
  id: string;
  title: string;
  description?: string;
  type: WorkflowType;
  status: WorkflowStatus;
  requester: string;
  requestDate: string;
  approver?: string;
  approvalDate?: string;
  targetUser?: string;
  targetService?: string;
  priority?: 'low' | 'medium' | 'high';
  data?: Record<string, any>;
}

export type WorkflowType =
  | 'account_creation'
  | 'account_deletion'
  | 'permission_change'
  | 'service_access'
  | 'other';
export type WorkflowStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'completed'
  | 'cancelled';

// ログ関連型
export interface LogEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
  service?: string;
  status: 'success' | 'error' | 'warning';
  ipAddress?: string;
  userAgent?: string;
}

// API関連型
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    [key: string]: any;
  };
  links?: {
    next?: string;
    prev?: string;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp?: string;
}
