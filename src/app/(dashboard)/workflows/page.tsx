'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/common/empty-state';
import {
  Plus,
  Search,
  GitBranch,
  Filter,
  AlertTriangle,
  Loader2,
  CheckCircle,
  Clock,
  XCircle,
  User,
  Calendar,
  FileText,
} from 'lucide-react';
import { useWorkflows, useUsers, useApiMutation } from '@/hooks/useApi';

interface WorkflowRequest {
  id: string;
  type: string;
  requesterId: string;
  targetUserId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'FAILED';
  data: any;
  createdAt: string;
  updatedAt: string;
  requester?: {
    id: string;
    name: string;
    email: string;
  };
  targetUser?: {
    id: string;
    name: string;
    email: string;
    department?: string;
  };
}

interface CreateWorkflowRequest {
  type: string;
  requesterId: string;
  targetUserId: string;
  data?: any;
}

export default function WorkflowsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: workflows, loading, error, refetch } = useWorkflows();
  const { data: users } = useUsers();
  const { mutate: createWorkflow, loading: creating } = useApiMutation<
    CreateWorkflowRequest,
    any
  >('/api/workflows');

  // フィルタリング
  const filteredWorkflows =
    workflows?.filter((workflow: WorkflowRequest) => {
      const matchesSearch =
        workflow.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workflow.targetUser?.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        workflow.requester?.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesStatus =
        selectedStatus === 'all' || workflow.status === selectedStatus;
      const matchesType =
        selectedType === 'all' || workflow.type === selectedType;
      return matchesSearch && matchesStatus && matchesType;
    }) || [];

  // 統計データ
  const totalWorkflows = workflows?.length || 0;
  const pendingWorkflows =
    workflows?.filter((w: WorkflowRequest) => w.status === 'PENDING')?.length ||
    0;
  const completedWorkflows =
    workflows?.filter((w: WorkflowRequest) => w.status === 'COMPLETED')
      ?.length || 0;
  const failedWorkflows =
    workflows?.filter((w: WorkflowRequest) => w.status === 'FAILED')?.length ||
    0;

  const workflowTypes = [
    ...new Set(workflows?.map((w: WorkflowRequest) => w.type) || []),
  ];
  const statuses = [
    ...new Set(workflows?.map((w: WorkflowRequest) => w.status) || []),
  ];

  const getStatusBadge = (status: string) => {
    const configs = {
      PENDING: { variant: 'secondary', icon: Clock, color: 'text-yellow-600' },
      APPROVED: {
        variant: 'default',
        icon: CheckCircle,
        color: 'text-blue-600',
      },
      REJECTED: {
        variant: 'destructive',
        icon: XCircle,
        color: 'text-red-600',
      },
      COMPLETED: {
        variant: 'default',
        icon: CheckCircle,
        color: 'text-green-600',
      },
      FAILED: { variant: 'destructive', icon: XCircle, color: 'text-red-600' },
    };

    const config = configs[status as keyof typeof configs] || configs.PENDING;
    const Icon = config.icon;

    return (
      <Badge
        variant={config.variant as any}
        className="flex items-center gap-1"
      >
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  const handleCreateWorkflow = async (data: CreateWorkflowRequest) => {
    const result = await createWorkflow(data);
    if (result) {
      refetch();
      setShowCreateModal(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">ワークフロー管理</h1>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {[...Array(5)].map((_, i) => (
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
          <h1 className="text-3xl font-bold">ワークフロー管理</h1>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">
                ワークフローデータの読み込みに失敗しました
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
          <h1 className="text-3xl font-bold">ワークフロー管理</h1>
          <p className="text-gray-600">
            {totalWorkflows} 件のワークフローが登録されています
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} disabled={creating}>
          {creating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              作成中...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              新規ワークフロー
            </>
          )}
        </Button>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              総ワークフロー数
            </CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWorkflows}</div>
            <p className="text-xs text-muted-foreground">全てのワークフロー</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ペンディング</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingWorkflows}</div>
            <p className="text-xs text-muted-foreground">
              承認待ちのワークフロー
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">完了</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedWorkflows}</div>
            <p className="text-xs text-muted-foreground">
              完了したワークフロー
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">失敗</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{failedWorkflows}</div>
            <p className="text-xs text-muted-foreground">
              失敗したワークフロー
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 検索・フィルター */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder="ワークフロータイプまたはユーザー名で検索..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm"
          >
            <option value="all">全てのステータス</option>
            {statuses.map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm"
          >
            <option value="all">全てのタイプ</option>
            {workflowTypes.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            フィルター
          </Button>
        </div>
      </div>

      {/* ワークフロー一覧 */}
      {filteredWorkflows.length === 0 ? (
        <EmptyState
          icon={GitBranch}
          title="ワークフローが見つかりません"
          description={
            totalWorkflows === 0
              ? 'まだワークフローがありません。新規ワークフローを作成してください。'
              : '検索条件に一致するワークフローが見つかりません。'
          }
          action={
            totalWorkflows === 0 ? (
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                新規ワークフロー
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredWorkflows.map((workflow: WorkflowRequest) => (
            <Card
              key={workflow.id}
              className="transition-shadow hover:shadow-md"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <GitBranch className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold">{workflow.type}</h3>
                      {getStatusBadge(workflow.status)}
                    </div>

                    <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <span className="text-gray-600">リクエスト者:</span>
                          <p className="font-medium">
                            {workflow.requester?.name || 'システム'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <span className="text-gray-600">対象ユーザー:</span>
                          <p className="font-medium">
                            {workflow.targetUser?.name || '不明'}
                          </p>
                          {workflow.targetUser?.department && (
                            <p className="text-xs text-gray-500">
                              {workflow.targetUser.department}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <span className="text-gray-600">作成日時:</span>
                          <p className="font-medium">
                            {new Date(workflow.createdAt).toLocaleDateString(
                              'ja-JP',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {workflow.data && Object.keys(workflow.data).length > 0 && (
                      <div className="mt-4 rounded-md bg-gray-50 p-3">
                        <div className="mb-2 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-600">
                            詳細データ:
                          </span>
                        </div>
                        <pre className="overflow-x-auto text-xs text-gray-600">
                          {JSON.stringify(workflow.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>

                  <div className="ml-4 flex gap-2">
                    {workflow.status === 'PENDING' && (
                      <>
                        <Button size="sm" variant="outline">
                          承認
                        </Button>
                        <Button size="sm" variant="destructive">
                          拒否
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="ghost">
                      詳細
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 新規ワークフロー作成モーダル */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="mx-4 w-full max-w-md">
            <CardHeader>
              <CardTitle>新規ワークフロー作成</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const workflowData = {
                    type: formData.get('type') as string,
                    requesterId: formData.get('requesterId') as string,
                    targetUserId: formData.get('targetUserId') as string,
                    data: {
                      description: formData.get('description') as string,
                    },
                  };
                  handleCreateWorkflow(workflowData);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    ワークフロータイプ
                  </label>
                  <select
                    name="type"
                    required
                    className="w-full rounded-md border px-3 py-2"
                  >
                    <option value="">選択してください</option>
                    <option value="USER_ONBOARDING">入社手続き</option>
                    <option value="USER_OFFBOARDING">退社手続き</option>
                    <option value="ACCOUNT_CREATION">アカウント作成</option>
                    <option value="PERMISSION_CHANGE">権限変更</option>
                    <option value="DEPARTMENT_TRANSFER">部署異動</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    リクエスト者
                  </label>
                  <select
                    name="requesterId"
                    required
                    className="w-full rounded-md border px-3 py-2"
                  >
                    <option value="">選択してください</option>
                    <option value="system">システム</option>
                    {users?.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    対象ユーザー
                  </label>
                  <select
                    name="targetUserId"
                    required
                    className="w-full rounded-md border px-3 py-2"
                  >
                    <option value="">選択してください</option>
                    {users?.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">説明</label>
                  <textarea
                    name="description"
                    className="w-full rounded-md border px-3 py-2"
                    rows={3}
                    placeholder="ワークフローの詳細を入力してください"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                  >
                    キャンセル
                  </Button>
                  <Button type="submit" disabled={creating}>
                    {creating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        作成中...
                      </>
                    ) : (
                      '作成'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
