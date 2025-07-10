'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCard } from '@/components/common/user-card';
import { SaaSConnectionCard } from '@/components/common/saas-connection-card';
import { StatusIndicator } from '@/components/common/status-indicator';
import { SearchBar } from '@/components/common/search-bar';
import { EmptyState } from '@/components/common/empty-state';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Users,
  Zap,
  BarChart3,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { useUsers, useSaasConnections } from '@/hooks/useApi';
import type { User, SaaSConnection } from '@/types';

export default function Home() {
  const { data: users, loading: usersLoading, error: usersError } = useUsers();
  const {
    data: saasConnections,
    loading: saasLoading,
    error: saasError,
  } = useSaasConnections();

  // 最新の5名のユーザーを取得
  const recentUsers = users?.slice(0, 5) || [];

  // SaaS連携を形式変換（データベースの形式からUIの形式へ）
  const formattedSaasConnections =
    saasConnections?.map(account => ({
      id: account.id,
      name: getProviderName(account.provider),
      type: account.provider,
      provider: account.provider,
      status: account.status === 'ACTIVE' ? 'connected' : 'error',
      lastSyncAt: account.updatedAt,
      syncStatus: account.status === 'ACTIVE' ? 'success' : 'error',
      userCount: 0, // 実際のカウントは別途計算が必要
      totalUsers: 0,
      errorCount: 0,
      licenseCount: 0,
      usagePercentage: 0,
      monthlyActive: 0,
      apiHealth: account.status === 'ACTIVE' ? 'healthy' : 'degraded',
      features: getProviderFeatures(account.provider),
      setupDate: account.createdAt,
      config: account.metadata || {},
      healthStatus: {
        status: account.status === 'ACTIVE' ? 'healthy' : 'degraded',
        responseTime: null, // 実際のAPI監視データは別途実装
        uptime: null, // 実際のアップタイムデータは別途実装
        lastCheck: account.updatedAt,
      },
      usage: {
        requestCount: null, // 実際のAPI使用量データは別途実装
        errorRate: null, // 実際のエラー率データは別途実装
        avgResponseTime: null, // 実際のレスポンス時間データは別途実装
      },
    })) || [];

  // プロバイダー名の取得
  function getProviderName(provider: string): string {
    const names: { [key: string]: string } = {
      google: 'Google Workspace',
      google_workspace: 'Google Workspace',
      microsoft: 'Microsoft 365',
      microsoft_365: 'Microsoft 365',
      slack: 'Slack',
      github: 'GitHub',
      zoom: 'Zoom',
      aws_iam: 'AWS IAM',
      gitlab: 'GitLab',
      salesforce: 'Salesforce',
    };
    return names[provider] || provider;
  }

  // プロバイダーの機能取得
  function getProviderFeatures(provider: string): string[] {
    const features: { [key: string]: string[] } = {
      google: ['Email', 'Drive', 'Calendar', 'Meet'],
      google_workspace: ['Email', 'Drive', 'Calendar', 'Meet'],
      microsoft: ['Outlook', 'OneDrive', 'Teams', 'SharePoint'],
      microsoft_365: ['Outlook', 'OneDrive', 'Teams', 'SharePoint'],
      slack: ['Messaging', 'Channels', 'Apps'],
      github: ['Repositories', 'Issues', 'Actions'],
      zoom: ['Meetings', 'Webinars', 'Phone'],
      aws_iam: ['Access Management', 'Policies', 'Roles'],
      gitlab: ['Git', 'CI/CD', 'Issues'],
      salesforce: ['CRM', 'Sales', 'Marketing'],
    };
    return features[provider] || [];
  }

  const loading = usersLoading || saasLoading;
  const error = usersError || saasError;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                SaaS アカウント管理システム
              </h1>
              <p className="mt-1 text-gray-600">
                企業のSaaSアカウントを一元管理・自動化
              </p>
            </div>
            <Button disabled>
              <Plus className="mr-2 h-4 w-4" />
              新規ユーザー
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
                  <div className="h-16 w-full rounded bg-gray-200"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
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

          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">
                  データの読み込みに失敗しました
                </span>
              </div>
              <p className="mt-2 text-red-600">{error}</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

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
            {recentUsers.length > 0 ? (
              recentUsers.map((user: User) => (
                <UserCard key={user.id} user={user} />
              ))
            ) : (
              <EmptyState
                title="ユーザーがいません"
                description="最初のユーザーを追加してアカウント管理を開始しましょう。"
              />
            )}
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
            {formattedSaasConnections.length > 0 ? (
              formattedSaasConnections.map((connection: SaaSConnection) => (
                <SaaSConnectionCard
                  key={connection.id}
                  connection={connection}
                />
              ))
            ) : (
              <EmptyState
                title="SaaS連携がありません"
                description="SaaSサービスとの連携を開始して、アカウント管理を自動化しましょう。"
              />
            )}
          </div>
        </div>

        {/* Empty State テスト */}
        <div>
          <h2 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
            <BarChart3 className="mr-2 h-5 w-5" />
            空状態テスト
          </h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <EmptyState
              title="ユーザーがいません"
              description="最初のユーザーを追加してアカウント管理を開始しましょう。"
            />
            <EmptyState
              title="SaaS連携がありません"
              description="SaaSサービスとの連携を開始して、アカウント管理を自動化しましょう。"
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
