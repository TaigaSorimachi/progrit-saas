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
import { StatusIndicator } from '@/components/common/status-indicator';
import { EmptyState } from '@/components/common/empty-state';
import {
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  Clock,
  User,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  Settings,
  Shield,
  FileText,
  Database,
  Zap,
  Users,
  UserPlus,
  UserMinus,
  UserCheck,
  Mail,
  Phone,
  Globe,
  Server,
  Key,
  Lock,
  Unlock,
  LogIn,
  LogOut,
  RefreshCw,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Info,
  AlertTriangle,
  History,
  ArrowRight,
  MoreHorizontal,
} from 'lucide-react';

// アクティビティログ型定義
interface ActivityLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  category: 'user' | 'saas' | 'auth' | 'system' | 'security' | 'workflow';
  action: string;
  description: string;
  user: {
    id: string;
    name: string;
    email: string;
    department: string;
  };
  target?: {
    type: 'user' | 'saas' | 'workflow' | 'system';
    id: string;
    name: string;
  };
  metadata: {
    ip?: string;
    userAgent?: string;
    location?: string;
    duration?: number;
    beforeValue?: string;
    afterValue?: string;
    errorMessage?: string;
  };
  correlationId?: string;
}

// サンプルアクティビティログ
const sampleActivityLogs: ActivityLog[] = [
  {
    id: '1',
    timestamp: '2024-01-15T10:30:00Z',
    level: 'success',
    category: 'user',
    action: 'user_created',
    description: 'ユーザーアカウントが作成されました',
    user: {
      id: '1',
      name: '人事部 佐藤',
      email: 'sato@company.com',
      department: '人事部',
    },
    target: {
      type: 'user',
      id: '2',
      name: '田中太郎',
    },
    metadata: {
      ip: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      location: '東京, 日本',
      duration: 1200,
    },
    correlationId: 'req-123456',
  },
  {
    id: '2',
    timestamp: '2024-01-15T10:25:00Z',
    level: 'success',
    category: 'saas',
    action: 'saas_account_created',
    description: 'Google WorkspaceアカウントとSCIM連携でユーザーを作成',
    user: {
      id: '1',
      name: 'System',
      email: 'system@company.com',
      department: 'システム',
    },
    target: {
      type: 'saas',
      id: '1',
      name: 'Google Workspace',
    },
    metadata: {
      ip: '10.0.0.1',
      duration: 3200,
      beforeValue: 'user_count: 44',
      afterValue: 'user_count: 45',
    },
    correlationId: 'req-123456',
  },
  {
    id: '3',
    timestamp: '2024-01-15T10:20:00Z',
    level: 'warning',
    category: 'auth',
    action: 'failed_login',
    description: '複数回のログイン試行が失敗しました',
    user: {
      id: '3',
      name: '山田花子',
      email: 'yamada@company.com',
      department: '営業部',
    },
    metadata: {
      ip: '203.0.113.45',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      location: '大阪, 日本',
      errorMessage: 'Invalid credentials (3 attempts)',
    },
  },
  {
    id: '4',
    timestamp: '2024-01-15T10:15:00Z',
    level: 'error',
    category: 'saas',
    action: 'saas_sync_failed',
    description: 'GitHub API連携でエラーが発生しました',
    user: {
      id: '1',
      name: 'System',
      email: 'system@company.com',
      department: 'システム',
    },
    target: {
      type: 'saas',
      id: '4',
      name: 'GitHub',
    },
    metadata: {
      ip: '10.0.0.1',
      duration: 5000,
      errorMessage: 'API rate limit exceeded (5000 requests/hour)',
    },
  },
  {
    id: '5',
    timestamp: '2024-01-15T10:10:00Z',
    level: 'info',
    category: 'workflow',
    action: 'workflow_approved',
    description: 'ワークフローが承認されました',
    user: {
      id: '5',
      name: 'IT管理者 鈴木',
      email: 'suzuki@company.com',
      department: 'IT部',
    },
    target: {
      type: 'workflow',
      id: '2',
      name: 'Salesforce アクセス権限追加',
    },
    metadata: {
      ip: '192.168.1.150',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      location: '東京, 日本',
      duration: 30000,
    },
    correlationId: 'wf-789012',
  },
  {
    id: '6',
    timestamp: '2024-01-15T10:05:00Z',
    level: 'success',
    category: 'security',
    action: 'permission_changed',
    description: 'ユーザー権限が変更されました',
    user: {
      id: '6',
      name: 'セキュリティ管理者 田中',
      email: 'tanaka.security@company.com',
      department: 'セキュリティ部',
    },
    target: {
      type: 'user',
      id: '7',
      name: '佐藤次郎',
    },
    metadata: {
      ip: '192.168.1.200',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      location: '東京, 日本',
      beforeValue: 'permissions: [user, developer]',
      afterValue: 'permissions: [user, developer, admin]',
    },
  },
  {
    id: '7',
    timestamp: '2024-01-15T09:58:00Z',
    level: 'warning',
    category: 'system',
    action: 'high_cpu_usage',
    description: 'サーバーのCPU使用率が高くなっています',
    user: {
      id: '1',
      name: 'System Monitor',
      email: 'monitor@company.com',
      department: 'システム',
    },
    metadata: {
      ip: '10.0.0.10',
      beforeValue: 'cpu_usage: 45%',
      afterValue: 'cpu_usage: 85%',
    },
  },
  {
    id: '8',
    timestamp: '2024-01-15T09:55:00Z',
    level: 'info',
    category: 'user',
    action: 'user_login',
    description: 'ユーザーがログインしました',
    user: {
      id: '8',
      name: '開発部 高橋',
      email: 'takahashi@company.com',
      department: '開発部',
    },
    metadata: {
      ip: '192.168.1.75',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      location: '東京, 日本',
    },
  },
];

// フィルター状態
interface LogFilters {
  search: string;
  level: string;
  category: string;
  dateFrom: string;
  dateTo: string;
  user: string;
}

export default function ActivityReportsPage() {
  const [filters, setFilters] = useState<LogFilters>({
    search: '',
    level: '',
    category: '',
    dateFrom: '',
    dateTo: '',
    user: '',
  });
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list');

  // フィルタリングされたログ一覧
  const filteredLogs = sampleActivityLogs.filter(log => {
    const matchesSearch =
      log.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      log.action.toLowerCase().includes(filters.search.toLowerCase()) ||
      log.user.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchesLevel =
      !filters.level || filters.level === 'all' || log.level === filters.level;
    const matchesCategory =
      !filters.category ||
      filters.category === 'all' ||
      log.category === filters.category;
    const matchesUser =
      !filters.user ||
      log.user.name.toLowerCase().includes(filters.user.toLowerCase());

    // 日付フィルタ
    const logDate = new Date(log.timestamp);
    const matchesDateFrom =
      !filters.dateFrom || logDate >= new Date(filters.dateFrom);
    const matchesDateTo =
      !filters.dateTo || logDate <= new Date(filters.dateTo);

    return (
      matchesSearch &&
      matchesLevel &&
      matchesCategory &&
      matchesUser &&
      matchesDateFrom &&
      matchesDateTo
    );
  });

  // ユニークな値
  const uniqueLevels = [...new Set(sampleActivityLogs.map(log => log.level))];
  const uniqueCategories = [
    ...new Set(sampleActivityLogs.map(log => log.category)),
  ];

  const handleLogAction = (log: ActivityLog, action: string) => {
    setSelectedLog(log);
    switch (action) {
      case 'view':
        setIsDetailsOpen(true);
        break;
      case 'export':
        console.log('エクスポート:', log);
        break;
      default:
        console.log(`${action}:`, log);
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'success':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            成功
          </Badge>
        );
      case 'info':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            情報
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
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'user':
        return <Users className="h-4 w-4" />;
      case 'saas':
        return <Zap className="h-4 w-4" />;
      case 'auth':
        return <Lock className="h-4 w-4" />;
      case 'system':
        return <Server className="h-4 w-4" />;
      case 'security':
        return <Shield className="h-4 w-4" />;
      case 'workflow':
        return <FileText className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'user':
        return 'ユーザー';
      case 'saas':
        return 'SaaS';
      case 'auth':
        return '認証';
      case 'system':
        return 'システム';
      case 'security':
        return 'セキュリティ';
      case 'workflow':
        return 'ワークフロー';
      default:
        return category;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ja-JP');
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${Math.round(ms / 1000)}s`;
    return `${Math.round(ms / 60000)}m`;
  };

  const exportLogs = () => {
    console.log('ログエクスポート:', filteredLogs);
  };

  return (
    <div className="space-y-6 p-6">
      {/* ページヘッダー */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            アクティビティレポート
          </h1>
          <p className="text-gray-600">
            システム活動ログと監査証跡を確認します ({filteredLogs.length}/
            {sampleActivityLogs.length}件)
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={exportLogs}>
            <Download className="mr-2 h-4 w-4" />
            ログエクスポート
          </Button>
          <Button variant="outline" size="sm">
            <BarChart3 className="mr-2 h-4 w-4" />
            統計表示
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            更新
          </Button>
        </div>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">成功</p>
                <p className="text-2xl font-bold text-green-600">
                  {
                    sampleActivityLogs.filter(log => log.level === 'success')
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
                <p className="text-sm text-gray-600">警告</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {
                    sampleActivityLogs.filter(log => log.level === 'warning')
                      .length
                  }
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">エラー</p>
                <p className="text-2xl font-bold text-red-600">
                  {
                    sampleActivityLogs.filter(log => log.level === 'error')
                      .length
                  }
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">総ログ数</p>
                <p className="text-2xl font-bold text-blue-600">
                  {sampleActivityLogs.length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 検索・フィルター */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    placeholder="アクション、説明、ユーザー名で検索..."
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
                  value={filters.level}
                  onValueChange={value =>
                    setFilters(prev => ({ ...prev, level: value }))
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="レベル" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全て</SelectItem>
                    {uniqueLevels.map(level => (
                      <SelectItem key={level} value={level}>
                        {level === 'success'
                          ? '成功'
                          : level === 'info'
                            ? '情報'
                            : level === 'warning'
                              ? '警告'
                              : 'エラー'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={filters.category}
                  onValueChange={value =>
                    setFilters(prev => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="カテゴリ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全て</SelectItem>
                    {uniqueCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {getCategoryLabel(category)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFilters({
                      search: '',
                      level: 'all',
                      category: 'all',
                      dateFrom: '',
                      dateTo: '',
                      user: '',
                    })
                  }
                >
                  クリア
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  開始日
                </label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={e =>
                    setFilters(prev => ({ ...prev, dateFrom: e.target.value }))
                  }
                  className="w-40"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  終了日
                </label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={e =>
                    setFilters(prev => ({ ...prev, dateTo: e.target.value }))
                  }
                  className="w-40"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  ユーザー
                </label>
                <Input
                  placeholder="ユーザー名"
                  value={filters.user}
                  onChange={e =>
                    setFilters(prev => ({ ...prev, user: e.target.value }))
                  }
                  className="w-40"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ログ一覧 */}
      {filteredLogs.length === 0 ? (
        <EmptyState
          type="no-logs"
          title="ログが見つかりません"
          description="検索条件に一致するログがありません。フィルターを変更してください。"
        />
      ) : (
        <div className="space-y-4">
          {filteredLogs.map(log => (
            <Card
              key={log.id}
              className="overflow-hidden transition-shadow hover:shadow-md"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                      {getCategoryIcon(log.category)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                          {log.action}
                        </h3>
                        {getLevelBadge(log.level)}
                        <Badge variant="outline" className="text-xs">
                          {getCategoryLabel(log.category)}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        {log.description}
                      </p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{log.user.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(log.timestamp)}</span>
                        </div>
                        {log.metadata.ip && (
                          <div className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            <span>{log.metadata.ip}</span>
                          </div>
                        )}
                        {log.metadata.location && (
                          <div className="flex items-center gap-1">
                            <span>{log.metadata.location}</span>
                          </div>
                        )}
                        {log.metadata.duration && (
                          <div className="flex items-center gap-1">
                            <span>
                              実行時間: {formatDuration(log.metadata.duration)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getLevelIcon(log.level)}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLogAction(log, 'view')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* 対象がある場合 */}
                {log.target && (
                  <div className="mt-3 rounded-lg bg-gray-50 p-3">
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">
                        対象: {log.target.name} ({log.target.type})
                      </span>
                    </div>
                  </div>
                )}

                {/* 変更詳細 */}
                {(log.metadata.beforeValue || log.metadata.afterValue) && (
                  <div className="mt-3 rounded-lg bg-gray-50 p-3">
                    <div className="space-y-1">
                      {log.metadata.beforeValue && (
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">
                            変更前:
                          </span>
                          <span className="ml-2 text-gray-600">
                            {log.metadata.beforeValue}
                          </span>
                        </div>
                      )}
                      {log.metadata.afterValue && (
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">
                            変更後:
                          </span>
                          <span className="ml-2 text-gray-600">
                            {log.metadata.afterValue}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* エラーメッセージ */}
                {log.metadata.errorMessage && (
                  <div className="mt-3 rounded-lg bg-red-50 p-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-red-700">
                        エラー詳細:
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-red-600">
                      {log.metadata.errorMessage}
                    </p>
                  </div>
                )}

                {/* 関連ID */}
                {log.correlationId && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-gray-500">関連ID:</span>
                    <Badge variant="outline" className="text-xs">
                      {log.correlationId}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 詳細ダイアログ */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>ログ詳細</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-6">
              {/* 基本情報 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">基本情報</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">アクション</span>
                      <span className="font-medium">{selectedLog.action}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">レベル</span>
                      {getLevelBadge(selectedLog.level)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">カテゴリ</span>
                      <span className="font-medium">
                        {getCategoryLabel(selectedLog.category)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">タイムスタンプ</span>
                      <span className="font-medium">
                        {formatDate(selectedLog.timestamp)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ログID</span>
                      <span className="font-medium">{selectedLog.id}</span>
                    </div>
                    {selectedLog.correlationId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">関連ID</span>
                        <span className="font-medium">
                          {selectedLog.correlationId}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">ユーザー情報</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">名前</span>
                      <span className="font-medium">
                        {selectedLog.user.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">メール</span>
                      <span className="font-medium">
                        {selectedLog.user.email}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">部署</span>
                      <span className="font-medium">
                        {selectedLog.user.department}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ユーザーID</span>
                      <span className="font-medium">{selectedLog.user.id}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 対象情報 */}
              {selectedLog.target && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">対象情報</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">対象名</span>
                      <span className="font-medium">
                        {selectedLog.target.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">対象タイプ</span>
                      <span className="font-medium">
                        {selectedLog.target.type}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">対象ID</span>
                      <span className="font-medium">
                        {selectedLog.target.id}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* メタデータ */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">メタデータ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {Object.entries(selectedLog.metadata).map(
                      ([key, value]) =>
                        value && (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-600">{key}</span>
                            <span className="font-medium">{String(value)}</span>
                          </div>
                        )
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* 説明 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">説明</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{selectedLog.description}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
