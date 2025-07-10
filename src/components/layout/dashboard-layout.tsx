'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { CheckCircle, AlertCircle, Clock, Bell, Activity } from 'lucide-react';
import { useDashboardStats } from '@/hooks/useApi';

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardLayout({
  children,
  className = '',
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { data: stats } = useDashboardStats();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatColor = (color: string) => {
    const colorMap = {
      blue: 'text-blue-600 bg-blue-50',
      green: 'text-green-600 bg-green-50',
      yellow: 'text-yellow-600 bg-yellow-50',
      red: 'text-red-600 bg-red-50',
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  // クイック統計の動的生成
  const getQuickStats = () => {
    if (!stats) return [];

    return [
      {
        title: 'アクティブユーザー',
        value: stats.activeUsers?.toString() || '0',
        change: `+${((stats.activeUsers / Math.max(stats.totalUsers, 1)) * 100).toFixed(0)}%`,
        trend: 'up' as const,
        color: 'blue' as const,
      },
      {
        title: 'SaaS連携数',
        value: stats.totalSaasAccounts?.toString() || '0',
        change: `+${stats.activeSaasAccounts || 0}`,
        trend: 'up' as const,
        color: 'green' as const,
      },
      {
        title: '承認待ち',
        value: stats.pendingWorkflows?.toString() || '0',
        change: stats.pendingWorkflows > 0 ? '注意' : '問題なし',
        trend:
          stats.pendingWorkflows > 0 ? ('up' as const) : ('stable' as const),
        color:
          stats.pendingWorkflows > 0 ? ('yellow' as const) : ('green' as const),
      },
      {
        title: 'エラー',
        value: '0',
        change: '0',
        trend: 'stable' as const,
        color: 'green' as const,
      },
    ];
  };

  // 最近のアクティビティデータを整形
  const recentActivities = useMemo(() => {
    // データが存在しない場合は空配列を返す
    if (!stats) return [];

    // 仮のアクティビティデータを返す（データがない状態を処理）
    return [
      {
        id: '1',
        description: 'システム開始',
        time: '2分前',
        type: 'info',
      },
    ];
  }, [stats]);

  const getActivityType = (
    activityType: string
  ): 'user' | 'saas' | 'workflow' | 'error' => {
    if (activityType.includes('ユーザー')) return 'user';
    if (activityType.includes('SaaS') || activityType.includes('アカウント'))
      return 'saas';
    if (activityType.includes('ワークフロー')) return 'workflow';
    return 'error';
  };

  const quickStats = getQuickStats();
  const recentActivities = getRecentActivities();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuToggle={toggleSidebar} />

      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar isOpen={sidebarOpen} />

        <main className={`flex-1 overflow-auto ${className}`}>
          <div className="space-y-6 p-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {quickStats.map(stat => (
                <Card
                  key={stat.title}
                  className="transition-shadow hover:shadow-md"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </CardTitle>
                      <Badge
                        variant="secondary"
                        className={getStatColor(stat.color)}
                      >
                        {stat.change}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activities */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">
                      最近のアクティビティ
                    </CardTitle>
                    <Button variant="outline" size="sm">
                      <Bell className="mr-2 h-4 w-4" />
                      全て表示
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {recentActivities.length > 0 ? (
                    <div className="space-y-4">
                      {recentActivities.map((activity: any) => (
                        <div
                          key={activity.id}
                          className="text-sm text-muted-foreground"
                        >
                          {activity.description} - {activity.time}
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

              {/* Main Content Area */}
              <div className="space-y-6">{children}</div>
            </div>
          </div>
        </main>
      </div>

      <Toaster />
    </div>
  );
}
