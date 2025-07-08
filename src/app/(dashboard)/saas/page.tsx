'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SaaSConnectionCard } from '@/components/common/saas-connection-card';
import { StatusIndicator } from '@/components/common/status-indicator';
import { EmptyState } from '@/components/common/empty-state';
import { SaaSConnection } from '@/types';
import {
  Plus,
  Search,
  Settings,
  RefreshCw,
  Zap,
  Shield,
  Clock,
  Users,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Activity,
  Database,
  Key,
  Link,
  Bell,
  BarChart3,
  Download,
  Upload,
  Play,
  Pause,
  RotateCw,
  AlertTriangle,
  Info,
} from 'lucide-react';

// SaaS連携のサンプルデータ
const sampleSaaSConnections: SaaSConnection[] = [
  {
    id: '1',
    name: 'Google Workspace',
    type: 'google',
    status: 'connected',
    lastSyncAt: '2024-01-15T10:30:00Z',
    syncStatus: 'success',
    userCount: 45,
    totalUsers: 50,
    errorCount: 0,
    config: {
      domain: 'company.com',
      adminEmail: 'admin@company.com',
      syncInterval: 3600,
      features: ['user_provisioning', 'group_sync', 'sso'],
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
    status: 'connected',
    lastSyncAt: '2024-01-15T09:45:00Z',
    syncStatus: 'success',
    userCount: 38,
    totalUsers: 50,
    errorCount: 0,
    config: {
      tenantId: 'tenant-id-123',
      applicationId: 'app-id-456',
      syncInterval: 7200,
      features: [
        'user_provisioning',
        'license_management',
        'teams_integration',
      ],
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
    status: 'warning',
    lastSyncAt: '2024-01-14T18:30:00Z',
    syncStatus: 'warning',
    userCount: 42,
    totalUsers: 50,
    errorCount: 3,
    config: {
      workspaceId: 'T1234567890',
      botToken: 'xoxb-****',
      syncInterval: 1800,
      features: ['user_provisioning', 'channel_management', 'notifications'],
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
  {
    id: '4',
    name: 'GitHub',
    type: 'github',
    status: 'error',
    lastSyncAt: '2024-01-13T14:22:00Z',
    syncStatus: 'error',
    userCount: 28,
    totalUsers: 35,
    errorCount: 12,
    config: {
      organization: 'company-org',
      personalAccessToken: 'ghp_****',
      syncInterval: 3600,
      features: ['user_provisioning', 'team_management', 'repository_access'],
    },
    healthStatus: {
      status: 'down',
      responseTime: 0,
      uptime: 95.2,
      lastCheck: '2024-01-15T08:30:00Z',
    },
    usage: {
      requestCount: 150,
      errorRate: 8.7,
      avgResponseTime: 0,
    },
  },
  {
    id: '5',
    name: 'Salesforce',
    type: 'salesforce',
    status: 'connected',
    lastSyncAt: '2024-01-15T11:15:00Z',
    syncStatus: 'success',
    userCount: 25,
    totalUsers: 30,
    errorCount: 0,
    config: {
      instanceUrl: 'https://company.salesforce.com',
      apiVersion: '58.0',
      syncInterval: 14400,
      features: ['user_provisioning', 'profile_management', 'permission_sets'],
    },
    healthStatus: {
      status: 'healthy',
      responseTime: 200,
      uptime: 99.5,
      lastCheck: '2024-01-15T11:10:00Z',
    },
    usage: {
      requestCount: 450,
      errorRate: 0.2,
      avgResponseTime: 180,
    },
  },
];

// フィルター状態
interface SaaSFilters {
  search: string;
  status: string;
  type: string;
}

export default function SaaSPage() {
  const [filters, setFilters] = useState<SaaSFilters>({
    search: '',
    status: '',
    type: '',
  });
  const [selectedSaaS, setSelectedSaaS] = useState<SaaSConnection | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // フィルタリングされたSaaS一覧
  const filteredConnections = sampleSaaSConnections.filter(saas => {
    const matchesSearch =
      saas.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      saas.type.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus =
      !filters.status ||
      filters.status === 'all' ||
      saas.status === filters.status;
    const matchesType =
      !filters.type || filters.type === 'all' || saas.type === filters.type;

    return matchesSearch && matchesStatus && matchesType;
  });

  // ユニークなタイプとステータス
  const uniqueTypes = [
    ...new Set(sampleSaaSConnections.map(saas => saas.type)),
  ];
  const uniqueStatuses = [
    ...new Set(sampleSaaSConnections.map(saas => saas.status)),
  ];

  const handleSaaSAction = (saas: SaaSConnection, action: string) => {
    setSelectedSaaS(saas);
    switch (action) {
      case 'view':
        setIsDetailsOpen(true);
        break;
      case 'configure':
        setIsConfigOpen(true);
        break;
      case 'sync':
        console.log('同期開始:', saas.name);
        break;
      case 'pause':
        console.log('同期停止:', saas.name);
        break;
      case 'delete':
        if (confirm(`${saas.name}の連携を削除しますか？`)) {
          console.log('削除:', saas.name);
        }
        break;
      default:
        console.log(`${action}:`, saas);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            接続済み
          </Badge>
        );
      case 'warning':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            警告
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            エラー
          </Badge>
        );
      case 'disconnected':
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            未接続
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSyncStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'syncing':
        return <RotateCw className="h-4 w-4 animate-spin text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ja-JP');
  };

  const getUsageColor = (rate: number) => {
    if (rate < 1) return 'text-green-600';
    if (rate < 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6 p-6">
      {/* ページヘッダー */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SaaS連携管理</h1>
          <p className="text-gray-600">
            外部SaaSサービスとの連携を管理します ({filteredConnections.length}/
            {sampleSaaSConnections.length}サービス)
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            全て同期
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            レポート出力
          </Button>
          <Button size="sm" onClick={() => setIsAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            新規連携
          </Button>
        </div>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">総連携数</p>
                <p className="text-2xl font-bold">
                  {sampleSaaSConnections.length}
                </p>
              </div>
              <Zap className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">正常稼働中</p>
                <p className="text-2xl font-bold text-green-600">
                  {
                    sampleSaaSConnections.filter(s => s.status === 'connected')
                      .length
                  }
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">警告・エラー</p>
                <p className="text-2xl font-bold text-red-600">
                  {
                    sampleSaaSConnections.filter(
                      s => s.status === 'warning' || s.status === 'error'
                    ).length
                  }
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">総ユーザー数</p>
                <p className="text-2xl font-bold">
                  {sampleSaaSConnections.reduce(
                    (sum, s) => sum + s.userCount,
                    0
                  )}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 検索・フィルター */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  placeholder="SaaS名、タイプで検索..."
                  value={filters.search}
                  onChange={e =>
                    setFilters(prev => ({ ...prev, search: e.target.value }))
                  }
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select
                value={filters.status}
                onValueChange={value =>
                  setFilters(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="ステータス" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全て</SelectItem>
                  {uniqueStatuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status === 'connected'
                        ? '接続済み'
                        : status === 'warning'
                          ? '警告'
                          : status === 'error'
                            ? 'エラー'
                            : '未接続'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters.type}
                onValueChange={value =>
                  setFilters(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="タイプ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全て</SelectItem>
                  {uniqueTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setFilters({ search: '', status: 'all', type: 'all' })
                }
              >
                クリア
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SaaS連携一覧 */}
      {filteredConnections.length === 0 ? (
        <EmptyState
          type="no-saas"
          title="SaaS連携が見つかりません"
          description="検索条件に一致するSaaS連携がありません。フィルターを変更するか、新しい連携を追加してください。"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredConnections.map(saas => (
            <Card
              key={saas.id}
              className="overflow-hidden transition-shadow hover:shadow-md"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                      <Zap className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {saas.name}
                      </h3>
                      <p className="text-sm text-gray-500">{saas.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(saas.status)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleSaaSAction(saas, 'view')}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          詳細表示
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleSaaSAction(saas, 'configure')}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          設定
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleSaaSAction(saas, 'sync')}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          同期実行
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleSaaSAction(saas, 'delete')}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          削除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {/* 同期ステータス */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getSyncStatusIcon(saas.syncStatus)}
                      <span className="text-sm text-gray-600">最終同期</span>
                    </div>
                    <span className="text-sm font-medium">
                      {formatDate(saas.lastSyncAt)}
                    </span>
                  </div>

                  {/* ユーザー数 */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">ユーザー数</span>
                    <span className="text-sm font-medium">
                      {saas.userCount} / {saas.totalUsers}
                    </span>
                  </div>

                  {/* ヘルスステータス */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">ヘルス</span>
                    <div className="flex items-center space-x-2">
                      <StatusIndicator
                        status={saas.healthStatus.status}
                        variant="compact"
                      />
                      <span className="text-sm font-medium">
                        {saas.healthStatus.uptime}%
                      </span>
                    </div>
                  </div>

                  {/* エラー率 */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">エラー率</span>
                    <span
                      className={`text-sm font-medium ${getUsageColor(saas.usage.errorRate)}`}
                    >
                      {saas.usage.errorRate}%
                    </span>
                  </div>

                  {/* プログレスバー */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>利用率</span>
                      <span>
                        {Math.round((saas.userCount / saas.totalUsers) * 100)}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{
                          width: `${(saas.userCount / saas.totalUsers) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* アクションボタン */}
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleSaaSAction(saas, 'view')}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    詳細
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleSaaSAction(saas, 'sync')}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    同期
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleSaaSAction(saas, 'configure')}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    設定
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 詳細ダイアログ */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>SaaS連携詳細</DialogTitle>
          </DialogHeader>
          {selectedSaaS && (
            <div className="space-y-6">
              {/* 基本情報 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">基本情報</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">サービス名</span>
                      <span className="font-medium">{selectedSaaS.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">タイプ</span>
                      <span className="font-medium">{selectedSaaS.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ステータス</span>
                      {getStatusBadge(selectedSaaS.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">最終同期</span>
                      <span className="font-medium">
                        {formatDate(selectedSaaS.lastSyncAt)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">ヘルス状況</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">稼働率</span>
                      <span className="font-medium">
                        {selectedSaaS.healthStatus.uptime}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">応答時間</span>
                      <span className="font-medium">
                        {selectedSaaS.healthStatus.responseTime}ms
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">エラー率</span>
                      <span
                        className={`font-medium ${getUsageColor(selectedSaaS.usage.errorRate)}`}
                      >
                        {selectedSaaS.usage.errorRate}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">リクエスト数</span>
                      <span className="font-medium">
                        {selectedSaaS.usage.requestCount}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 設定情報 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">設定情報</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {Object.entries(selectedSaaS.config).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-600">{key}</span>
                        <span className="font-medium">
                          {Array.isArray(value)
                            ? value.join(', ')
                            : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* アクションボタン */}
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDetailsOpen(false)}
                >
                  閉じる
                </Button>
                <Button
                  onClick={() => handleSaaSAction(selectedSaaS, 'configure')}
                >
                  設定変更
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 新規連携ダイアログ */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>新規SaaS連携</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                SaaSタイプ
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="連携するSaaSを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google">Google Workspace</SelectItem>
                  <SelectItem value="microsoft">Microsoft 365</SelectItem>
                  <SelectItem value="slack">Slack</SelectItem>
                  <SelectItem value="github">GitHub</SelectItem>
                  <SelectItem value="salesforce">Salesforce</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                連携名
              </label>
              <Input placeholder="連携の名前を入力" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">説明</label>
              <Input placeholder="連携の説明を入力" />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                キャンセル
              </Button>
              <Button
                onClick={() => {
                  console.log('新規連携作成');
                  setIsAddOpen(false);
                }}
              >
                作成
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
