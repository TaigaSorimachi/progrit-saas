'use client';

import { useState } from 'react';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { Toaster } from '@/components/ui/toaster';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

interface QuickStat {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  color: 'blue' | 'green' | 'yellow' | 'red';
}

const quickStats: QuickStat[] = [
  {
    title: 'アクティブユーザー',
    value: '127',
    change: '+12%',
    trend: 'up',
    color: 'blue',
  },
  {
    title: 'SaaS連携数',
    value: '8',
    change: '+2',
    trend: 'up',
    color: 'green',
  },
  {
    title: '承認待ち',
    value: '3',
    change: '-1',
    trend: 'down',
    color: 'yellow',
  },
  {
    title: 'エラー',
    value: '0',
    change: '0',
    trend: 'stable',
    color: 'green',
  },
];

interface RecentActivity {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'user' | 'saas' | 'workflow' | 'error';
  status: 'success' | 'warning' | 'error' | 'info';
}

const recentActivities: RecentActivity[] = [
  {
    id: '1',
    title: 'ユーザー追加',
    description: '田中太郎さんがGoogle Workspaceに追加されました',
    time: '2分前',
    type: 'user',
    status: 'success',
  },
  {
    id: '2',
    title: 'ワークフロー承認',
    description: '山田花子さんのSlackアカウント作成が承認されました',
    time: '15分前',
    type: 'workflow',
    status: 'success',
  },
  {
    id: '3',
    title: 'SaaS連携エラー',
    description: 'GitHub APIの接続でエラーが発生しました',
    time: '1時間前',
    type: 'saas',
    status: 'error',
  },
  {
    id: '4',
    title: 'ユーザー権限変更',
    description: '佐藤次郎さんの権限が管理者に変更されました',
    time: '2時間前',
    type: 'user',
    status: 'info',
  },
];

export function DashboardLayout({
  children,
  className = '',
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
                  <div className="space-y-4">
                    {recentActivities.map(activity => (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-3"
                      >
                        <div className="mt-1">
                          {getStatusIcon(activity.status)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-sm font-medium text-gray-900">
                            {activity.title}
                          </h4>
                          <p className="mt-1 text-sm text-gray-500">
                            {activity.description}
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
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
