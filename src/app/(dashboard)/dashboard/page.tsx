'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusIndicator } from '@/components/common/status-indicator';
import {
  Plus,
  Users,
  Zap,
  Activity,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3,
  Settings,
  Bell,
  RefreshCw,
} from 'lucide-react';

// 統計データの型定義
interface DashboardStats {
  activeUsers: { value: number; change: number; trend: 'up' | 'down' };
  saasConnections: { value: number; change: number; trend: 'up' | 'down' };
  pendingApprovals: { value: number; change: number; trend: 'up' | 'down' };
  systemErrors: { value: number; change: number; trend: 'up' | 'down' };
}

// アクティビティログの型定義
interface ActivityLog {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
}

// SaaS健全性の型定義
interface SaaSHealth {
  id: string;
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  uptime: number;
  lastCheck: string;
}

// サンプルデータ
const dashboardStats: DashboardStats = {
  activeUsers: { value: 127, change: 12, trend: 'up' },
  saasConnections: { value: 8, change: 2, trend: 'up' },
  pendingApprovals: { value: 3, change: -1, trend: 'down' },
  systemErrors: { value: 0, change: 0, trend: 'down' },
};

const recentActivities: ActivityLog[] = [
  {
    id: '1',
    type: 'success',
    title: 'ユーザー追加',
    description: '田中太郎さん がGoogle Workspaceに追加されました',
    timestamp: '2分前',
    user: '管理者',
  },
  {
    id: '2',
    type: 'success',
    title: 'ワークフロー承認',
    description: '山田花子さんのSlackアカウント作成が承認されました',
    timestamp: '15分前',
    user: '人事部',
  },
  {
    id: '3',
    type: 'error',
    title: 'SaaS連携エラー',
    description: 'GitHub APIの接続でエラーが発生しました',
    timestamp: '1時間前',
  },
  {
    id: '4',
    type: 'info',
    title: 'ユーザー権限変更',
    description: '佐藤次郎さんの権限が管理者に変更されました',
    timestamp: '2時間前',
    user: 'システム管理者',
  },
];

const saasHealthStatus: SaaSHealth[] = [
  {
    id: '1',
    name: 'Google Workspace',
    status: 'healthy',
    responseTime: 120,
    uptime: 99.9,
    lastCheck: '1分前',
  },
  {
    id: '2',
    name: 'Microsoft 365',
    status: 'healthy',
    responseTime: 98,
    uptime: 99.8,
    lastCheck: '2分前',
  },
  {
    id: '3',
    name: 'Slack',
    status: 'degraded',
    responseTime: 450,
    uptime: 98.5,
    lastCheck: '3分前',
  },
  {
    id: '4',
    name: 'GitHub',
    status: 'down',
    responseTime: 0,
    uptime: 95.2,
    lastCheck: '1時間前',
  },
];

export default function DashboardPage() {
  const getStatIcon = (type: string) => {
    switch (type) {
      case 'users':
        return <Users className="h-4 w-4" />;
      case 'saas':
        return <Zap className="h-4 w-4" />;
      case 'approvals':
        return <Clock className="h-4 w-4" />;
      case 'errors':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'info':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSaaSHealthColor = (status: SaaSHealth['status']) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'down':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* ページヘッダー */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
          <p className="text-gray-600">SaaS アカウント管理システムの概要</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            更新
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            新規ユーザー
          </Button>
        </div>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  アクティブユーザー
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardStats.activeUsers.value}
                </p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                {getStatIcon('users')}
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {dashboardStats.activeUsers.trend === 'up' ? (
                <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span
                className={
                  dashboardStats.activeUsers.trend === 'up'
                    ? 'text-green-600'
                    : 'text-red-600'
                }
              >
                {dashboardStats.activeUsers.change > 0 ? '+' : ''}
                {dashboardStats.activeUsers.change}
              </span>
              <span className="ml-1 text-gray-500">先月比</span>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">SaaS連携数</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardStats.saasConnections.value}
                </p>
              </div>
              <div className="rounded-full bg-purple-100 p-3">
                {getStatIcon('saas')}
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {dashboardStats.saasConnections.trend === 'up' ? (
                <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span
                className={
                  dashboardStats.saasConnections.trend === 'up'
                    ? 'text-green-600'
                    : 'text-red-600'
                }
              >
                {dashboardStats.saasConnections.change > 0 ? '+' : ''}
                {dashboardStats.saasConnections.change}
              </span>
              <span className="ml-1 text-gray-500">新規追加</span>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">承認待ち</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardStats.pendingApprovals.value}
                </p>
              </div>
              <div className="rounded-full bg-yellow-100 p-3">
                {getStatIcon('approvals')}
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {dashboardStats.pendingApprovals.trend === 'up' ? (
                <TrendingUp className="mr-1 h-4 w-4 text-red-500" />
              ) : (
                <TrendingDown className="mr-1 h-4 w-4 text-green-500" />
              )}
              <span
                className={
                  dashboardStats.pendingApprovals.trend === 'up'
                    ? 'text-red-600'
                    : 'text-green-600'
                }
              >
                {dashboardStats.pendingApprovals.change > 0 ? '+' : ''}
                {dashboardStats.pendingApprovals.change}
              </span>
              <span className="ml-1 text-gray-500">前日比</span>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  システムエラー
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardStats.systemErrors.value}
                </p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                {getStatIcon('errors')}
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-600">正常稼働中</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* メインコンテンツエリア */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 最近のアクティビティ */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">
              最近のアクティビティ
            </CardTitle>
            <Button variant="outline" size="sm">
              <Bell className="mr-2 h-4 w-4" />
              全て表示
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map(activity => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="mt-1">{getActivityIcon(activity.type)}</div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-medium text-gray-900">
                      {activity.title}
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">
                      {activity.description}
                    </p>
                    <div className="mt-1 flex items-center space-x-2 text-xs text-gray-400">
                      <span>{activity.timestamp}</span>
                      {activity.user && (
                        <>
                          <span>•</span>
                          <span>{activity.user}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SaaS健全性モニタリング */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">SaaS健全性</CardTitle>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              設定
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {saasHealthStatus.map(saas => (
                <div
                  key={saas.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center space-x-3">
                    <StatusIndicator status={saas.status} variant="compact" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {saas.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        最終チェック: {saas.lastCheck}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {saas.uptime}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {saas.responseTime}ms
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* クイックアクション */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            クイックアクション
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto flex-col space-y-2 p-4">
              <Users className="h-6 w-6" />
              <span className="text-sm">新規ユーザー追加</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col space-y-2 p-4">
              <Zap className="h-6 w-6" />
              <span className="text-sm">SaaS連携追加</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col space-y-2 p-4">
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">レポート生成</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col space-y-2 p-4">
              <Settings className="h-6 w-6" />
              <span className="text-sm">システム設定</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
