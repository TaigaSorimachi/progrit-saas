'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SaaSConnectionCard } from '@/components/common/saas-connection-card';
import { EmptyState } from '@/components/common/empty-state';
import {
  Plus,
  Search,
  Link,
  Filter,
  AlertTriangle,
  Loader2,
  Activity,
} from 'lucide-react';
import { useSaasConnections, useUsers, useApiMutation } from '@/hooks/useApi';
import { SaaSAccount } from '@/types';

interface BulkCreateRequest {
  userIds: string[];
  saasProviders: string[];
}

export default function SaaSPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showBulkCreateModal, setShowBulkCreateModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);

  const {
    data: saasConnections,
    loading,
    error,
    refetch,
  } = useSaasConnections();
  const { data: users } = useUsers();
  const { mutate: bulkCreate, loading: creating } = useApiMutation<
    BulkCreateRequest,
    any
  >('/api/saas/bulk-create');

  // フィルタリングとソート
  const filteredConnections =
    saasConnections?.filter((connection: SaaSAccount) => {
      const matchesSearch =
        connection.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        connection.accountId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProvider =
        selectedProvider === 'all' || connection.provider === selectedProvider;
      const matchesStatus =
        selectedStatus === 'all' || connection.status === selectedStatus;
      return matchesSearch && matchesProvider && matchesStatus;
    }) || [];

  // 統計データ
  const totalConnections = saasConnections?.length || 0;
  const activeConnections =
    saasConnections?.filter((conn: SaaSAccount) => conn.status === 'ACTIVE')
      ?.length || 0;
  const providers = [
    ...new Set(
      saasConnections?.map((conn: SaaSAccount) => conn.provider) || []
    ),
  ];
  const statuses = [
    ...new Set(saasConnections?.map((conn: SaaSAccount) => conn.status) || []),
  ];

  const handleBulkCreate = async () => {
    if (selectedUsers.length === 0 || selectedProviders.length === 0) {
      alert('ユーザーとSaaSプロバイダーを選択してください');
      return;
    }

    const result = await bulkCreate({
      userIds: selectedUsers,
      saasProviders: selectedProviders,
    });

    if (result) {
      refetch();
      setShowBulkCreateModal(false);
      setSelectedUsers([]);
      setSelectedProviders([]);
    }
  };

  const availableProviders = [
    'google_workspace',
    'microsoft_365',
    'slack',
    'github',
    'zoom',
    'aws_iam',
    'gitlab',
    'salesforce',
  ];

  if (loading) {
    return (
      <div className="space-y-6 p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">SaaS連携管理</h1>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
                <div className="mb-4 h-4 w-1/2 rounded bg-gray-200"></div>
                <div className="h-8 rounded bg-gray-200"></div>
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
          <h1 className="text-3xl font-bold">SaaS連携管理</h1>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">
                SaaS連携データの読み込みに失敗しました
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
          <h1 className="text-3xl font-bold">SaaS連携管理</h1>
          <p className="text-gray-600">
            {totalConnections} 件のSaaS連携が登録されています
          </p>
        </div>
        <Button
          onClick={() => setShowBulkCreateModal(true)}
          disabled={creating}
        >
          {creating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              作成中...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              一括アカウント作成
            </>
          )}
        </Button>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総連携数</CardTitle>
            <Link className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConnections}</div>
            <p className="text-xs text-muted-foreground">
              全てのSaaS連携アカウント
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              アクティブ連携
            </CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeConnections}</div>
            <p className="text-xs text-muted-foreground">
              現在有効な連携アカウント
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              連携プロバイダー数
            </CardTitle>
            <Filter className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providers.length}</div>
            <p className="text-xs text-muted-foreground">
              利用中のSaaSプロバイダー
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ユーザー数</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              システム登録ユーザー
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 検索・フィルター */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder="プロバイダー名またはアカウントIDで検索..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedProvider}
            onChange={e => setSelectedProvider(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm"
          >
            <option value="all">全てのプロバイダー</option>
            {providers.map(provider => (
              <option key={provider} value={provider}>
                {provider}
              </option>
            ))}
          </select>
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
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            フィルター
          </Button>
        </div>
      </div>

      {/* SaaS連携一覧 */}
      {filteredConnections.length === 0 ? (
        <EmptyState
          icon={Link}
          title="SaaS連携が見つかりません"
          description={
            totalConnections === 0
              ? 'まだSaaS連携がありません。一括アカウント作成で新しい連携を作成してください。'
              : '検索条件に一致するSaaS連携が見つかりません。'
          }
          action={
            totalConnections === 0 ? (
              <Button onClick={() => setShowBulkCreateModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                一括アカウント作成
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredConnections.map(connection => (
            <SaaSConnectionCard
              key={connection.id}
              connection={connection}
              onUpdate={refetch}
            />
          ))}
        </div>
      )}

      {/* 一括アカウント作成モーダル */}
      {showBulkCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="mx-4 max-h-[80vh] w-full max-w-2xl overflow-y-auto">
            <CardHeader>
              <CardTitle>一括アカウント作成</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* ユーザー選択 */}
              <div>
                <h3 className="mb-3 text-lg font-semibold">対象ユーザー</h3>
                <div className="max-h-48 overflow-y-auto rounded-md border p-4">
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === (users?.length || 0)}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedUsers(users?.map(u => u.id) || []);
                          } else {
                            setSelectedUsers([]);
                          }
                        }}
                        className="rounded"
                      />
                      <span className="font-medium">全て選択</span>
                    </label>
                    {users?.map(user => (
                      <label
                        key={user.id}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={e => {
                            if (e.target.checked) {
                              setSelectedUsers([...selectedUsers, user.id]);
                            } else {
                              setSelectedUsers(
                                selectedUsers.filter(id => id !== user.id)
                              );
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">
                          {user.name} ({user.email})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {selectedUsers.length} 名のユーザーを選択
                </p>
              </div>

              {/* SaaSプロバイダー選択 */}
              <div>
                <h3 className="mb-3 text-lg font-semibold">SaaSプロバイダー</h3>
                <div className="rounded-md border p-4">
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={
                          selectedProviders.length === availableProviders.length
                        }
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedProviders([...availableProviders]);
                          } else {
                            setSelectedProviders([]);
                          }
                        }}
                        className="rounded"
                      />
                      <span className="font-medium">全て選択</span>
                    </label>
                    {availableProviders.map(provider => (
                      <label
                        key={provider}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={selectedProviders.includes(provider)}
                          onChange={e => {
                            if (e.target.checked) {
                              setSelectedProviders([
                                ...selectedProviders,
                                provider,
                              ]);
                            } else {
                              setSelectedProviders(
                                selectedProviders.filter(p => p !== provider)
                              );
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{provider}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {selectedProviders.length} 個のプロバイダーを選択
                </p>
              </div>

              {/* 概要 */}
              <div className="rounded-md bg-gray-50 p-4">
                <h3 className="mb-2 font-semibold">作成概要</h3>
                <p className="text-sm text-gray-600">
                  {selectedUsers.length} 名のユーザーに対して、
                  {selectedProviders.length} 個のSaaSプロバイダーで 合計{' '}
                  {selectedUsers.length * selectedProviders.length} 個の
                  アカウントを作成します。
                </p>
              </div>

              {/* ボタン */}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowBulkCreateModal(false);
                    setSelectedUsers([]);
                    setSelectedProviders([]);
                  }}
                >
                  キャンセル
                </Button>
                <Button
                  onClick={handleBulkCreate}
                  disabled={
                    creating ||
                    selectedUsers.length === 0 ||
                    selectedProviders.length === 0
                  }
                >
                  {creating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      作成中...
                    </>
                  ) : (
                    '一括作成'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
