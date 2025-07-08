'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { UserCard } from '@/components/common/user-card';
import { EmptyState } from '@/components/common/empty-state';
import {
  Plus,
  Search,
  Users,
  Filter,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { useUsers, useApiMutation } from '@/hooks/useApi';
import { User } from '@/types';

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const { data: users, loading, error, refetch } = useUsers();
  const { mutate: createUser, loading: creating } = useApiMutation<
    Partial<User>,
    User
  >('/api/users');

  // フィルタリングとソート
  const filteredUsers =
    users?.filter((user: User) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment =
        selectedDepartment === 'all' || user.department === selectedDepartment;
      return matchesSearch && matchesDepartment;
    }) || [];

  const activeUsers = filteredUsers.filter(
    (user: User) => !user.terminationDate
  );
  const inactiveUsers = filteredUsers.filter(
    (user: User) => user.terminationDate
  );

  // 部署リストの取得
  const departments = [
    ...new Set(
      users?.map((user: User) => user.department).filter(Boolean) || []
    ),
  ];

  const handleAddUser = async (userData: Partial<User>) => {
    const result = await createUser(userData);
    if (result) {
      refetch();
      setShowAddUserModal(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">ユーザー管理</h1>
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
          <h1 className="text-3xl font-bold">ユーザー管理</h1>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">
                ユーザーデータの読み込みに失敗しました
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
          <h1 className="text-3xl font-bold">ユーザー管理</h1>
          <p className="text-gray-600">
            {users?.length || 0} 名のユーザーが登録されています
          </p>
        </div>
        <Button onClick={() => setShowAddUserModal(true)} disabled={creating}>
          {creating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              作成中...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              新規ユーザー追加
            </>
          )}
        </Button>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総ユーザー数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              システム全体のユーザー数
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              アクティブユーザー
            </CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers.length}</div>
            <p className="text-xs text-muted-foreground">
              現在アクティブなユーザー
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">部署数</CardTitle>
            <Filter className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
            <p className="text-xs text-muted-foreground">
              登録されている部署数
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 検索・フィルター */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder="名前またはメールアドレスで検索..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedDepartment}
            onChange={e => setSelectedDepartment(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm"
          >
            <option value="all">全ての部署</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            フィルター
          </Button>
        </div>
      </div>

      {/* ユーザー一覧 */}
      {filteredUsers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="ユーザーが見つかりません"
          description={
            users?.length === 0
              ? 'まだユーザーが登録されていません。新規ユーザーを追加してください。'
              : '検索条件に一致するユーザーが見つかりません。'
          }
          action={
            users?.length === 0 ? (
              <Button onClick={() => setShowAddUserModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                新規ユーザー追加
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-6">
          {/* アクティブユーザー */}
          {activeUsers.length > 0 && (
            <div>
              <div className="mb-4 flex items-center gap-2">
                <h2 className="text-xl font-semibold">アクティブユーザー</h2>
                <Badge variant="default">{activeUsers.length}</Badge>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {activeUsers.map(user => (
                  <UserCard key={user.id} user={user} onUpdate={refetch} />
                ))}
              </div>
            </div>
          )}

          {/* 非アクティブユーザー */}
          {inactiveUsers.length > 0 && (
            <div>
              <div className="mb-4 flex items-center gap-2">
                <h2 className="text-xl font-semibold">非アクティブユーザー</h2>
                <Badge variant="secondary">{inactiveUsers.length}</Badge>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {inactiveUsers.map(user => (
                  <UserCard key={user.id} user={user} onUpdate={refetch} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 新規ユーザー追加モーダル */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="mx-4 w-full max-w-md">
            <CardHeader>
              <CardTitle>新規ユーザー追加</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const userData = {
                    employeeId: formData.get('employeeId') as string,
                    name: formData.get('name') as string,
                    email: formData.get('email') as string,
                    department: formData.get('department') as string,
                    position: formData.get('position') as string,
                    hireDate: new Date(formData.get('hireDate') as string),
                  };
                  handleAddUser(userData);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    社員ID
                  </label>
                  <Input name="employeeId" required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">氏名</label>
                  <Input name="name" required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    メールアドレス
                  </label>
                  <Input name="email" type="email" required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">部署</label>
                  <Input name="department" required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">役職</label>
                  <Input name="position" required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    入社日
                  </label>
                  <Input name="hireDate" type="date" required />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddUserModal(false)}
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
                      '追加'
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
