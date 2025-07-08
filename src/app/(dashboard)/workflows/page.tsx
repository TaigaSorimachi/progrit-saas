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
import { StatusIndicator } from '@/components/common/status-indicator';
import { EmptyState } from '@/components/common/empty-state';
import {
  Plus,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  User,
  Calendar,
  FileText,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Filter,
  Download,
  Bell,
  UserPlus,
  UserMinus,
  UserCheck,
  ArrowRight,
  Play,
  Pause,
  Settings,
  History,
  Zap,
  Mail,
  MessageSquare,
  Timer,
  TrendingUp,
  BarChart3,
} from 'lucide-react';

// ワークフロー型定義
interface WorkflowRequest {
  id: string;
  type:
    | 'user_create'
    | 'user_update'
    | 'user_delete'
    | 'saas_access'
    | 'permission_change';
  title: string;
  description: string;
  requester: {
    id: string;
    name: string;
    email: string;
    department: string;
  };
  targetUser: {
    id: string;
    name: string;
    email: string;
    department: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  approvers: {
    id: string;
    name: string;
    email: string;
    department: string;
    status: 'pending' | 'approved' | 'rejected';
    approvedAt?: string;
    comments?: string;
  }[];
  data: Record<string, any>;
  estimatedTime: number; // 分単位
  actualTime?: number; // 分単位
}

// サンプルワークフローデータ
const sampleWorkflows: WorkflowRequest[] = [
  {
    id: '1',
    type: 'user_create',
    title: '新規ユーザー作成',
    description: '新入社員の田中太郎さんのアカウント作成',
    requester: {
      id: '1',
      name: '人事部 佐藤',
      email: 'sato@company.com',
      department: '人事部',
    },
    targetUser: {
      id: '2',
      name: '田中太郎',
      email: 'tanaka@company.com',
      department: '開発部',
    },
    status: 'pending',
    priority: 'medium',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z',
    dueDate: '2024-01-17T17:00:00Z',
    approvers: [
      {
        id: '3',
        name: '開発部長 山田',
        email: 'yamada@company.com',
        department: '開発部',
        status: 'pending',
      },
      {
        id: '4',
        name: 'IT管理者 鈴木',
        email: 'suzuki@company.com',
        department: 'IT部',
        status: 'pending',
      },
    ],
    data: {
      position: 'シニアエンジニア',
      startDate: '2024-01-20',
      saasAccounts: ['google', 'slack', 'github'],
      permissions: ['user', 'developer'],
    },
    estimatedTime: 60,
  },
  {
    id: '2',
    type: 'saas_access',
    title: 'Salesforce アクセス権限追加',
    description: '営業部の山田さんにSalesforceの管理者権限を付与',
    requester: {
      id: '5',
      name: '営業部長 高橋',
      email: 'takahashi@company.com',
      department: '営業部',
    },
    targetUser: {
      id: '6',
      name: '山田花子',
      email: 'yamada.hanako@company.com',
      department: '営業部',
    },
    status: 'approved',
    priority: 'high',
    createdAt: '2024-01-14T14:30:00Z',
    updatedAt: '2024-01-15T10:15:00Z',
    dueDate: '2024-01-16T17:00:00Z',
    approvers: [
      {
        id: '7',
        name: 'IT管理者 鈴木',
        email: 'suzuki@company.com',
        department: 'IT部',
        status: 'approved',
        approvedAt: '2024-01-15T10:15:00Z',
        comments: '承認します。営業活動に必要な権限です。',
      },
    ],
    data: {
      saasService: 'salesforce',
      permissionLevel: 'admin',
      reason: '営業チームの管理業務のため',
    },
    estimatedTime: 30,
    actualTime: 25,
  },
  {
    id: '3',
    type: 'user_delete',
    title: '退職者アカウント削除',
    description: '退職者の佐藤一郎さんのアカウント削除',
    requester: {
      id: '1',
      name: '人事部 佐藤',
      email: 'sato@company.com',
      department: '人事部',
    },
    targetUser: {
      id: '8',
      name: '佐藤一郎',
      email: 'sato.ichiro@company.com',
      department: '開発部',
    },
    status: 'in_progress',
    priority: 'urgent',
    createdAt: '2024-01-13T16:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z',
    dueDate: '2024-01-15T17:00:00Z',
    approvers: [
      {
        id: '3',
        name: '開発部長 山田',
        email: 'yamada@company.com',
        department: '開発部',
        status: 'approved',
        approvedAt: '2024-01-14T09:00:00Z',
        comments: '承認します。引き継ぎ完了済みです。',
      },
      {
        id: '4',
        name: 'IT管理者 鈴木',
        email: 'suzuki@company.com',
        department: 'IT部',
        status: 'approved',
        approvedAt: '2024-01-14T10:30:00Z',
        comments: '承認します。データバックアップ完了。',
      },
    ],
    data: {
      terminationDate: '2024-01-15',
      dataRetention: '7年',
      transferTo: 'yamada@company.com',
    },
    estimatedTime: 120,
    actualTime: 95,
  },
  {
    id: '4',
    type: 'permission_change',
    title: '権限変更申請',
    description: '鈴木太郎さんの管理者権限を削除',
    requester: {
      id: '9',
      name: 'セキュリティ責任者 田中',
      email: 'tanaka.security@company.com',
      department: 'セキュリティ部',
    },
    targetUser: {
      id: '10',
      name: '鈴木太郎',
      email: 'suzuki.taro@company.com',
      department: '開発部',
    },
    status: 'rejected',
    priority: 'medium',
    createdAt: '2024-01-12T11:00:00Z',
    updatedAt: '2024-01-13T15:30:00Z',
    dueDate: '2024-01-15T17:00:00Z',
    approvers: [
      {
        id: '3',
        name: '開発部長 山田',
        email: 'yamada@company.com',
        department: '開発部',
        status: 'rejected',
        approvedAt: '2024-01-13T15:30:00Z',
        comments: '現在のプロジェクトで必要な権限のため、却下します。',
      },
    ],
    data: {
      currentPermissions: ['user', 'admin', 'developer'],
      requestedPermissions: ['user', 'developer'],
      reason: 'セキュリティ強化のため',
    },
    estimatedTime: 45,
    actualTime: 30,
  },
];

// フィルター状態
interface WorkflowFilters {
  search: string;
  status: string;
  type: string;
  priority: string;
  requester: string;
}

export default function WorkflowsPage() {
  const [filters, setFilters] = useState<WorkflowFilters>({
    search: '',
    status: '',
    type: '',
    priority: '',
    requester: '',
  });
  const [selectedWorkflow, setSelectedWorkflow] =
    useState<WorkflowRequest | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isApprovalOpen, setIsApprovalOpen] = useState(false);

  // フィルタリングされたワークフロー一覧
  const filteredWorkflows = sampleWorkflows.filter(workflow => {
    const matchesSearch =
      workflow.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      workflow.description
        .toLowerCase()
        .includes(filters.search.toLowerCase()) ||
      workflow.targetUser.name
        .toLowerCase()
        .includes(filters.search.toLowerCase());
    const matchesStatus =
      !filters.status ||
      filters.status === 'all' ||
      workflow.status === filters.status;
    const matchesType =
      !filters.type || filters.type === 'all' || workflow.type === filters.type;
    const matchesPriority =
      !filters.priority ||
      filters.priority === 'all' ||
      workflow.priority === filters.priority;
    const matchesRequester =
      !filters.requester ||
      workflow.requester.name
        .toLowerCase()
        .includes(filters.requester.toLowerCase());

    return (
      matchesSearch &&
      matchesStatus &&
      matchesType &&
      matchesPriority &&
      matchesRequester
    );
  });

  // ユニークな値
  const uniqueStatuses = [...new Set(sampleWorkflows.map(w => w.status))];
  const uniqueTypes = [...new Set(sampleWorkflows.map(w => w.type))];
  const uniquePriorities = [...new Set(sampleWorkflows.map(w => w.priority))];

  const handleWorkflowAction = (workflow: WorkflowRequest, action: string) => {
    setSelectedWorkflow(workflow);
    switch (action) {
      case 'view':
        setIsDetailsOpen(true);
        break;
      case 'approve':
        setIsApprovalOpen(true);
        break;
      case 'reject':
        if (confirm(`${workflow.title}を却下しますか？`)) {
          console.log('却下:', workflow.title);
        }
        break;
      case 'delete':
        if (confirm(`${workflow.title}を削除しますか？`)) {
          console.log('削除:', workflow.title);
        }
        break;
      default:
        console.log(`${action}:`, workflow);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            承認待ち
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            承認済み
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            却下
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            処理中
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="default" className="bg-gray-100 text-gray-800">
            完了
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            緊急
          </Badge>
        );
      case 'high':
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            高
          </Badge>
        );
      case 'medium':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            中
          </Badge>
        );
      case 'low':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            低
          </Badge>
        );
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'user_create':
        return <UserPlus className="h-4 w-4" />;
      case 'user_update':
        return <UserCheck className="h-4 w-4" />;
      case 'user_delete':
        return <UserMinus className="h-4 w-4" />;
      case 'saas_access':
        return <Zap className="h-4 w-4" />;
      case 'permission_change':
        return <Settings className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'user_create':
        return 'ユーザー作成';
      case 'user_update':
        return 'ユーザー更新';
      case 'user_delete':
        return 'ユーザー削除';
      case 'saas_access':
        return 'SaaSアクセス';
      case 'permission_change':
        return '権限変更';
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ja-JP');
  };

  const getDaysUntilDue = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'in_progress':
        return <Play className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* ページヘッダー */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ワークフロー管理</h1>
          <p className="text-gray-600">
            承認フローとリクエストを管理します ({filteredWorkflows.length}/
            {sampleWorkflows.length}件)
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            レポート出力
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            フロー設定
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            新規リクエスト
          </Button>
        </div>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">承認待ち</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {sampleWorkflows.filter(w => w.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">処理中</p>
                <p className="text-2xl font-bold text-blue-600">
                  {
                    sampleWorkflows.filter(w => w.status === 'in_progress')
                      .length
                  }
                </p>
              </div>
              <Play className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">完了</p>
                <p className="text-2xl font-bold text-green-600">
                  {
                    sampleWorkflows.filter(
                      w => w.status === 'completed' || w.status === 'approved'
                    ).length
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
                <p className="text-sm text-gray-600">平均処理時間</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(
                    sampleWorkflows.reduce(
                      (sum, w) => sum + (w.actualTime || w.estimatedTime),
                      0
                    ) / sampleWorkflows.length
                  )}
                  分
                </p>
              </div>
              <Timer className="h-8 w-8 text-purple-500" />
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
                  placeholder="タイトル、説明、対象ユーザーで検索..."
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
                      {status === 'pending'
                        ? '承認待ち'
                        : status === 'approved'
                          ? '承認済み'
                          : status === 'rejected'
                            ? '却下'
                            : status === 'in_progress'
                              ? '処理中'
                              : '完了'}
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
                      {getTypeLabel(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters.priority}
                onValueChange={value =>
                  setFilters(prev => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="優先度" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全て</SelectItem>
                  {uniquePriorities.map(priority => (
                    <SelectItem key={priority} value={priority}>
                      {priority === 'urgent'
                        ? '緊急'
                        : priority === 'high'
                          ? '高'
                          : priority === 'medium'
                            ? '中'
                            : '低'}
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
                    status: 'all',
                    type: 'all',
                    priority: 'all',
                    requester: '',
                  })
                }
              >
                クリア
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ワークフロー一覧 */}
      {filteredWorkflows.length === 0 ? (
        <EmptyState
          type="no-workflows"
          title="ワークフローが見つかりません"
          description="検索条件に一致するワークフローがありません。フィルターを変更するか、新しいリクエストを作成してください。"
        />
      ) : (
        <div className="space-y-4">
          {filteredWorkflows.map(workflow => (
            <Card
              key={workflow.id}
              className="overflow-hidden transition-shadow hover:shadow-md"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      {getTypeIcon(workflow.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                          {workflow.title}
                        </h3>
                        {getPriorityBadge(workflow.priority)}
                        {getStatusBadge(workflow.status)}
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        {workflow.description}
                      </p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>申請者: {workflow.requester.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>作成: {formatDate(workflow.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            期限: {getDaysUntilDue(workflow.dueDate)}日後
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(workflow.status)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleWorkflowAction(workflow, 'view')}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          詳細表示
                        </DropdownMenuItem>
                        {workflow.status === 'pending' && (
                          <>
                            <DropdownMenuItem
                              onClick={() =>
                                handleWorkflowAction(workflow, 'approve')
                              }
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              承認
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleWorkflowAction(workflow, 'reject')
                              }
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              却下
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem
                          onClick={() =>
                            handleWorkflowAction(workflow, 'delete')
                          }
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          削除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* 承認者一覧 */}
                <div className="mt-4">
                  <h4 className="mb-2 text-sm font-medium text-gray-700">
                    承認フロー
                  </h4>
                  <div className="flex flex-wrap items-center gap-2">
                    {workflow.approvers.map((approver, index) => (
                      <div
                        key={approver.id}
                        className="flex items-center gap-1"
                      >
                        <div className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              approver.status === 'approved'
                                ? 'bg-green-500'
                                : approver.status === 'rejected'
                                  ? 'bg-red-500'
                                  : 'bg-yellow-500'
                            }`}
                          />
                          <span className="text-xs">{approver.name}</span>
                        </div>
                        {index < workflow.approvers.length - 1 && (
                          <ArrowRight className="h-3 w-3 text-gray-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 対象ユーザー情報 */}
                <div className="mt-4 rounded-lg bg-gray-50 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        対象ユーザー: {workflow.targetUser.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {workflow.targetUser.email} •{' '}
                        {workflow.targetUser.department}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        予想時間: {workflow.estimatedTime}分
                      </p>
                      {workflow.actualTime && (
                        <p className="text-xs text-gray-500">
                          実際: {workflow.actualTime}分
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* アクションボタン */}
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleWorkflowAction(workflow, 'view')}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    詳細
                  </Button>
                  {workflow.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          handleWorkflowAction(workflow, 'approve')
                        }
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        承認
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleWorkflowAction(workflow, 'reject')}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        却下
                      </Button>
                    </>
                  )}
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
            <DialogTitle>ワークフロー詳細</DialogTitle>
          </DialogHeader>
          {selectedWorkflow && (
            <div className="space-y-6">
              {/* 基本情報 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">基本情報</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">タイトル</span>
                      <span className="font-medium">
                        {selectedWorkflow.title}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">タイプ</span>
                      <span className="font-medium">
                        {getTypeLabel(selectedWorkflow.type)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ステータス</span>
                      {getStatusBadge(selectedWorkflow.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">優先度</span>
                      {getPriorityBadge(selectedWorkflow.priority)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">作成日時</span>
                      <span className="font-medium">
                        {formatDate(selectedWorkflow.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">期限</span>
                      <span className="font-medium">
                        {formatDate(selectedWorkflow.dueDate)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">関係者</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        申請者
                      </p>
                      <p className="font-medium">
                        {selectedWorkflow.requester.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {selectedWorkflow.requester.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        対象ユーザー
                      </p>
                      <p className="font-medium">
                        {selectedWorkflow.targetUser.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {selectedWorkflow.targetUser.email}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 承認者詳細 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">承認フロー</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedWorkflow.approvers.map((approver, index) => (
                      <div
                        key={approver.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`h-3 w-3 rounded-full ${
                              approver.status === 'approved'
                                ? 'bg-green-500'
                                : approver.status === 'rejected'
                                  ? 'bg-red-500'
                                  : 'bg-yellow-500'
                            }`}
                          />
                          <div>
                            <p className="font-medium">{approver.name}</p>
                            <p className="text-sm text-gray-500">
                              {approver.email}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(approver.status)}
                          {approver.approvedAt && (
                            <p className="mt-1 text-sm text-gray-500">
                              {formatDate(approver.approvedAt)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 詳細データ */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">詳細データ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {Object.entries(selectedWorkflow.data).map(
                      ([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-600">{key}</span>
                          <span className="font-medium">
                            {Array.isArray(value)
                              ? value.join(', ')
                              : String(value)}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 承認ダイアログ */}
      <Dialog open={isApprovalOpen} onOpenChange={setIsApprovalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>承認・却下</DialogTitle>
          </DialogHeader>
          {selectedWorkflow && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">{selectedWorkflow.title}</h3>
                <p className="text-sm text-gray-600">
                  {selectedWorkflow.description}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  コメント
                </label>
                <textarea
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                  rows={3}
                  placeholder="承認・却下の理由を入力してください..."
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsApprovalOpen(false)}
                >
                  キャンセル
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    console.log('却下:', selectedWorkflow.title);
                    setIsApprovalOpen(false);
                  }}
                >
                  却下
                </Button>
                <Button
                  onClick={() => {
                    console.log('承認:', selectedWorkflow.title);
                    setIsApprovalOpen(false);
                  }}
                >
                  承認
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
