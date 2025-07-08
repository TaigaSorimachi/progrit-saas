'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Users,
  Link,
  GitBranch,
  AlertTriangle,
  TrendingUp,
  Activity,
  CheckCircle,
  Clock,
  User,
} from 'lucide-react';
import { useDashboardStats } from '@/hooks/useApi';

export default function DashboardPage() {
  const { data: stats, loading, error } = useDashboardStats();

  if (loading) {
    return (
      <div className="space-y-6 p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">ダッシュボード</h1>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
                <div className="h-8 w-1/2 rounded bg-gray-200"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">ダッシュボード</h1>
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
    );
  }

  if (!stats) {
    return (
      <div className="p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">ダッシュボード</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500">データが見つかりません</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // システムヘルスの表示用設定
  const getHealthBadge = (health: any) => {
    const colors = {
      excellent: 'bg-green-100 text-green-800',
      good: 'bg-blue-100 text-blue-800',
      warning: 'bg-yellow-100 text-yellow-800',
      critical: 'bg-red-100 text-red-800',
    };

    const labels = {
      excellent: '優秀',
      good: '良好',
      warning: '注意',
      critical: '危険',
    };

    return (
      <Badge className={colors[health.status as keyof typeof colors]}>
        {labels[health.status as keyof typeof labels]} ({health.score}%)
      </Badge>
    );
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">ダッシュボード</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">システムヘルス:</span>
          {getHealthBadge(stats.systemHealth)}
        </div>
      </div>

      {/* メイン統計カード */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              アクティブユーザー
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              総ユーザー数: {stats.totalUsers}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SaaS連携数</CardTitle>
            <Link className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSaasAccounts}</div>
            <p className="text-xs text-muted-foreground">
              アクティブ: {stats.activeSaasAccounts}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">承認待ち</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingWorkflows}</div>
            <p className="text-xs text-muted-foreground">
              総ワークフロー: {stats.totalWorkflows}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">エラー</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              今日のアクティビティ: {stats.todayLogs}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 最近のアクティビティ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">最近のアクティビティ</CardTitle>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Activity className="h-4 w-4" />
            <span>全て表示</span>
          </div>
        </CardHeader>
        <CardContent>
          {stats.recentActivity && stats.recentActivity.length > 0 ? (
            <div className="space-y-4">
              {stats.recentActivity.map((activity: any) => (
                <div key={activity.id} className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {activity.status === 'success' && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    {activity.status === 'warning' && (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    )}
                    {activity.status === 'error' && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                    {activity.status === 'info' && (
                      <Clock className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.type}</p>
                    <p className="text-xs text-gray-500">
                      {activity.description}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleString('ja-JP', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              <Activity className="mx-auto mb-2 h-8 w-8" />
              <p>最近のアクティビティがありません</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ステータス表示テスト */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">ステータス表示テスト</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="text-sm">成功</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm">警告</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <span className="text-sm">エラー</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              <span className="text-sm">同期中</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-gray-500"></div>
              <span className="text-sm">終了済み</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">準備完了</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 最近のユーザー */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              最近のユーザー
            </CardTitle>
            <div className="cursor-pointer text-sm text-gray-500 hover:text-blue-600">
              すべて表示
            </div>
          </CardHeader>
          <CardContent>
            {stats.recentUsers && stats.recentUsers.length > 0 ? (
              <div className="space-y-4">
                {stats.recentUsers.map((user: any) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{user.name}</p>
                        <Badge
                          variant={
                            user.status === 'active' ? 'default' : 'secondary'
                          }
                          className="text-xs"
                        >
                          {user.status === 'active'
                            ? 'アクティブ'
                            : 'マネージャー'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{user.department}</span>
                        <span>{user.position}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>SaaS連携: {user.saasAccountCount}個</span>
                        <span>最終ログイン: {user.lastLoginTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                <User className="mx-auto mb-2 h-8 w-8" />
                <p>最近のユーザーがありません</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* SaaS連携状況 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Link className="h-5 w-5" />
              SaaS連携状況
            </CardTitle>
            <div className="cursor-pointer text-sm text-gray-500 hover:text-blue-600">
              連携管理
            </div>
          </CardHeader>
          <CardContent>
            {stats.saasProviderStats && stats.saasProviderStats.length > 0 ? (
              <div className="space-y-4">
                {stats.saasProviderStats.map((provider: any) => (
                  <div
                    key={provider.provider}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                        <span className="text-xs font-medium">
                          {provider.provider.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {provider.provider}
                        </p>
                        <p className="text-xs text-gray-500">
                          {provider.count}個のアカウント
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{provider.count}</div>
                      <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full bg-green-500"
                          style={{
                            width: `${Math.min(provider.count * 20, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                <Link className="mx-auto mb-2 h-8 w-8" />
                <p>SaaS連携がまだありません</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
