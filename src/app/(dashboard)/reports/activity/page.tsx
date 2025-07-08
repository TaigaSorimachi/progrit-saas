'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/common/empty-state';
import {
  Search,
  Activity,
  Filter,
  AlertTriangle,
  Loader2,
  Calendar,
  User,
  FileText,
  Download,
  Eye,
  Clock,
  BarChart3,
} from 'lucide-react';
import { useAuditLogs } from '@/hooks/useApi';

interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  metadata: any;
  timestamp: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function ActivityReportPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0], // 7日前
    endDate: new Date().toISOString().split('T')[0], // 今日
  });

  const {
    data: logs,
    loading,
    error,
    refetch,
  } = useAuditLogs({
    action: selectedAction !== 'all' ? selectedAction : undefined,
    userId: selectedUser !== 'all' ? selectedUser : undefined,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    limit: 100,
  });

  // フィルタリング
  const filteredLogs =
    logs?.filter((log: AuditLog) => {
      const matchesSearch =
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user?.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    }) || [];

  // 統計データ
  const totalLogs = logs?.length || 0;
  const uniqueUsers = [
    ...new Set(logs?.map((log: AuditLog) => log.userId) || []),
  ].length;
  const actions = [...new Set(logs?.map((log: AuditLog) => log.action) || [])];
  const users = [
    ...new Set(
      logs?.map((log: AuditLog) => log.user?.name).filter(Boolean) || []
    ),
  ];

  // アクション別統計
  const actionStats = actions.reduce(
    (acc, action) => {
      acc[action] =
        logs?.filter((log: AuditLog) => log.action === action).length || 0;
      return acc;
    },
    {} as Record<string, number>
  );

  const getActionBadge = (action: string) => {
    const configs = {
      USER_CREATED: { variant: 'default', color: 'text-green-600' },
      USER_UPDATED: { variant: 'secondary', color: 'text-blue-600' },
      USER_DELETED: { variant: 'destructive', color: 'text-red-600' },
      SAAS_ACCOUNT_CREATED: { variant: 'default', color: 'text-green-600' },
      SAAS_ACCOUNT_DELETED: { variant: 'destructive', color: 'text-red-600' },
      WORKFLOW_CREATED: { variant: 'secondary', color: 'text-purple-600' },
      LOGIN: { variant: 'outline', color: 'text-gray-600' },
      LOGOUT: { variant: 'outline', color: 'text-gray-600' },
    };

    const config = configs[action as keyof typeof configs] || {
      variant: 'outline',
      color: 'text-gray-600',
    };

    return (
      <Badge variant={config.variant as any} className={config.color}>
        {action}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handleExport = () => {
    if (!logs || logs.length === 0) {
      alert('エクスポートするデータがありません');
      return;
    }

    const csvContent = [
      ['日時', 'ユーザー', 'アクション', 'リソース', 'メタデータ'].join(','),
      ...logs.map((log: AuditLog) =>
        [
          log.timestamp,
          log.user?.name || 'システム',
          log.action,
          log.resource,
          JSON.stringify(log.metadata || {}),
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `activity-log-${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="space-y-6 p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">アクティビティレポート</h1>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {[...Array(10)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
                <div className="mb-4 h-4 w-1/2 rounded bg-gray-200"></div>
                <div className="h-8 w-1/4 rounded bg-gray-200"></div>
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
          <h1 className="text-3xl font-bold">アクティビティレポート</h1>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">
                アクティビティログの読み込みに失敗しました
              </span>
            </div>
            <p className="mt-2 text-red-600">{error}</p>
            <Button onClick={refetch} className="mt-4" variant="outline">
              再試行
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      {/* ページヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">アクティビティレポート</h1>
          <p className="text-gray-600">
            {totalLogs} 件のアクティビティログ（{dateRange.startDate} ～{' '}
            {dateRange.endDate}）
          </p>
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          CSVエクスポート
        </Button>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              総アクティビティ数
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLogs}</div>
            <p className="text-xs text-muted-foreground">
              選択期間内の全アクティビティ
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              アクティブユーザー数
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueUsers}</div>
            <p className="text-xs text-muted-foreground">
              アクションを実行したユーザー
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              アクション種別数
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{actions.length}</div>
            <p className="text-xs text-muted-foreground">
              実行されたアクションの種類
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              平均日次アクティビティ
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                totalLogs /
                  Math.max(
                    1,
                    Math.ceil(
                      (new Date(dateRange.endDate).getTime() -
                        new Date(dateRange.startDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )
                  )
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              1日あたりのアクティビティ数
            </p>
          </CardContent>
        </Card>
      </div>

      {/* アクション別統計 */}
      {Object.keys(actionStats).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">アクション別統計</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {Object.entries(actionStats).map(([action, count]) => (
                <div
                  key={action}
                  className="flex items-center justify-between rounded-md bg-gray-50 p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{action}</p>
                    <p className="text-2xl font-bold">{count}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {((count / totalLogs) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 検索・フィルター */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder="アクション、リソース、ユーザー名で検索..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedAction}
            onChange={e => setSelectedAction(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm"
          >
            <option value="all">全てのアクション</option>
            {actions.map(action => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
          <select
            value={selectedUser}
            onChange={e => setSelectedUser(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm"
          >
            <option value="all">全てのユーザー</option>
            {users.map(user => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={dateRange.startDate}
            onChange={e =>
              setDateRange(prev => ({ ...prev, startDate: e.target.value }))
            }
            className="rounded-md border px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={dateRange.endDate}
            onChange={e =>
              setDateRange(prev => ({ ...prev, endDate: e.target.value }))
            }
            className="rounded-md border px-3 py-2 text-sm"
          />
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            フィルター
          </Button>
        </div>
      </div>

      {/* アクティビティログ一覧 */}
      {filteredLogs.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="アクティビティログが見つかりません"
          description={
            totalLogs === 0
              ? '選択した期間にアクティビティログがありません。期間を変更してください。'
              : '検索条件に一致するアクティビティログが見つかりません。'
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredLogs.map((log: AuditLog) => (
            <Card key={log.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <Activity className="h-4 w-4 text-blue-600" />
                      {getActionBadge(log.action)}
                      <span className="text-sm text-gray-500">
                        {formatDate(log.timestamp)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <span className="text-gray-600">ユーザー:</span>
                          <p className="font-medium">
                            {log.user?.name || 'システム'}
                          </p>
                          {log.user?.email && (
                            <p className="text-xs text-gray-500">
                              {log.user.email}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <div>
                          <span className="text-gray-600">リソース:</span>
                          <p className="font-mono text-xs font-medium">
                            {log.resource}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <div>
                          <span className="text-gray-600">タイムスタンプ:</span>
                          <p className="text-xs font-medium">
                            {formatDate(log.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <div className="mt-3 rounded-md bg-gray-50 p-3">
                        <div className="mb-2 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-600">
                            メタデータ:
                          </span>
                        </div>
                        <pre className="overflow-x-auto text-xs text-gray-600">
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>

                  <div className="ml-4 flex gap-2">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
