import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCard } from '@/components/common/user-card';
import { SaaSConnectionCard } from '@/components/common/saas-connection-card';
import { StatusIndicator } from '@/components/common/status-indicator';
import { SearchBar } from '@/components/common/search-bar';
import { EmptyState } from '@/components/common/empty-state';
import { Button } from '@/components/ui/button';
import { Plus, Users, Zap, BarChart3 } from 'lucide-react';
import type { User, SaaSConnection } from '@/types';

// サンプルデータ
const sampleUsers: User[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    name: '田中太郎',
    email: 'tanaka@example.com',
    department: 'エンジニアリング',
    position: 'シニアエンジニア',
    role: 'user',
    status: 'active',
    hireDate: '2023-04-01',
    lastActive: '2時間前',
    saasConnections: 5,
    createdAt: '2023-04-01T00:00:00Z',
    updatedAt: '2024-12-19T00:00:00Z',
  },
  {
    id: '2',
    employeeId: 'EMP002',
    name: '山田花子',
    email: 'yamada@example.com',
    department: 'マーケティング',
    position: 'マネージャー',
    role: 'manager',
    status: 'active',
    hireDate: '2022-08-15',
    lastActive: '30分前',
    saasConnections: 8,
    createdAt: '2022-08-15T00:00:00Z',
    updatedAt: '2024-12-19T00:00:00Z',
  },
];

const sampleSaaSConnections: SaaSConnection[] = [
  {
    id: '1',
    name: 'Google Workspace',
    type: 'google',
    provider: 'google',
    status: 'connected',
    lastSyncAt: '2024-01-15T10:30:00Z',
    syncStatus: 'success',
    userCount: 127,
    totalUsers: 150,
    errorCount: 0,
    licenseCount: 150,
    usagePercentage: 85,
    monthlyActive: 119,
    apiHealth: 'healthy',
    features: ['Email', 'Drive', 'Calendar', 'Meet'],
    setupDate: '2023-01-15',
    config: {
      domain: 'company.com',
      adminEmail: 'admin@company.com',
    },
    healthStatus: {
      status: 'healthy',
      responseTime: 120,
      uptime: 99.9,
      lastCheck: '2024-01-15T10:25:00Z',
    },
    usage: {
      requestCount: 1250,
      errorRate: 0.1,
      avgResponseTime: 145,
    },
  },
  {
    id: '2',
    name: 'Microsoft 365',
    type: 'microsoft',
    provider: 'microsoft',
    status: 'connected',
    lastSyncAt: '2024-01-15T09:45:00Z',
    syncStatus: 'success',
    userCount: 95,
    totalUsers: 100,
    errorCount: 0,
    licenseCount: 100,
    usagePercentage: 95,
    monthlyActive: 87,
    apiHealth: 'healthy',
    features: ['Outlook', 'OneDrive', 'Teams', 'SharePoint'],
    setupDate: '2023-02-20',
    config: {
      tenantId: 'tenant-id-123',
    },
    healthStatus: {
      status: 'healthy',
      responseTime: 98,
      uptime: 99.8,
      lastCheck: '2024-01-15T10:20:00Z',
    },
    usage: {
      requestCount: 980,
      errorRate: 0.05,
      avgResponseTime: 110,
    },
  },
  {
    id: '3',
    name: 'Slack',
    type: 'slack',
    provider: 'slack',
    status: 'error',
    lastSyncAt: '2024-01-14T18:30:00Z',
    syncStatus: 'error',
    userCount: 78,
    totalUsers: 100,
    errorCount: 3,
    licenseCount: 100,
    usagePercentage: 78,
    monthlyActive: 65,
    apiHealth: 'degraded',
    features: ['Messaging', 'Channels', 'Apps'],
    setupDate: '2023-03-10',
    config: {
      workspaceId: 'T1234567890',
    },
    healthStatus: {
      status: 'degraded',
      responseTime: 450,
      uptime: 98.5,
      lastCheck: '2024-01-15T10:15:00Z',
    },
    usage: {
      requestCount: 2100,
      errorRate: 2.1,
      avgResponseTime: 380,
    },
  },
];

export default function Home() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* ページヘッダー */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              SaaS アカウント管理システム
            </h1>
            <p className="mt-1 text-gray-600">
              企業のSaaSアカウントを一元管理・自動化
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新規ユーザー
          </Button>
        </div>

        {/* 検索バー */}
        <div className="rounded-lg border p-4 text-center text-gray-500">
          <p>検索バー - 動作中（インタラクション機能は実装後に表示）</p>
        </div>

        {/* ステータス表示テスト */}
        <Card>
          <CardHeader>
            <CardTitle>ステータス表示テスト</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <StatusIndicator status="success" text="成功" />
              <StatusIndicator status="warning" text="警告" />
              <StatusIndicator status="error" text="エラー" />
              <StatusIndicator status="syncing" text="同期中" />
              <StatusIndicator status="connected" variant="compact" />
              <StatusIndicator status="active" variant="icon-only" />
            </div>
          </CardContent>
        </Card>

        {/* ユーザーカード */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center text-lg font-semibold text-gray-900">
              <Users className="mr-2 h-5 w-5" />
              最近のユーザー
            </h2>
            <Button variant="outline" size="sm">
              すべて表示
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {sampleUsers.map(user => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        </div>

        {/* SaaS連携カード */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center text-lg font-semibold text-gray-900">
              <Zap className="mr-2 h-5 w-5" />
              SaaS連携状況
            </h2>
            <Button variant="outline" size="sm">
              連携管理
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {sampleSaaSConnections.map(connection => (
              <SaaSConnectionCard key={connection.id} connection={connection} />
            ))}
          </div>
        </div>

        {/* Empty State テスト */}
        <div>
          <h2 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
            <BarChart3 className="mr-2 h-5 w-5" />
            空状態テスト
          </h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <EmptyState type="no-users" />
            <EmptyState type="no-saas" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
