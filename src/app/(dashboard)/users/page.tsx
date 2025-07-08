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
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserCard } from '@/components/common/user-card';
import { SearchBar } from '@/components/common/search-bar';
import { EmptyState } from '@/components/common/empty-state';
import { User } from '@/types';
import {
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  Users,
  Calendar,
  Building,
  Mail,
  Phone,
  MapPin,
  Shield,
  Clock,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

// ユーザー一覧のサンプルデータ
const sampleUsers: User[] = [
  {
    id: '1',
    name: '田中太郎',
    email: 'tanaka@example.com',
    department: '開発部',
    position: 'シニアエンジニア',
    status: 'active',
    hireDate: '2022-04-01',
    terminationDate: null,
    lastLoginAt: '2024-01-15T10:30:00Z',
    saasAccounts: [
      {
        id: '1',
        saasId: 'google',
        accountId: 'tanaka@company.com',
        status: 'active',
      },
      { id: '2', saasId: 'slack', accountId: 'tanaka.taro', status: 'active' },
    ],
    avatar: '/avatars/tanaka.jpg',
    phone: '090-1234-5678',
    location: '東京オフィス',
    manager: '佐藤次郎',
    permissions: ['user', 'developer'],
  },
  {
    id: '2',
    name: '山田花子',
    email: 'yamada@example.com',
    department: '営業部',
    position: '営業マネージャー',
    status: 'active',
    hireDate: '2021-10-01',
    terminationDate: null,
    lastLoginAt: '2024-01-14T15:45:00Z',
    saasAccounts: [
      {
        id: '3',
        saasId: 'google',
        accountId: 'yamada@company.com',
        status: 'active',
      },
      {
        id: '4',
        saasId: 'salesforce',
        accountId: 'yamada.hanako',
        status: 'active',
      },
    ],
    avatar: '/avatars/yamada.jpg',
    phone: '090-2345-6789',
    location: '大阪オフィス',
    manager: '田中太郎',
    permissions: ['user', 'manager'],
  },
  {
    id: '3',
    name: '佐藤次郎',
    email: 'sato@example.com',
    department: '人事部',
    position: '人事部長',
    status: 'active',
    hireDate: '2020-01-15',
    terminationDate: null,
    lastLoginAt: '2024-01-13T09:15:00Z',
    saasAccounts: [
      {
        id: '5',
        saasId: 'google',
        accountId: 'sato@company.com',
        status: 'active',
      },
      { id: '6', saasId: 'slack', accountId: 'sato.jiro', status: 'active' },
    ],
    avatar: '/avatars/sato.jpg',
    phone: '090-3456-7890',
    location: '東京オフィス',
    manager: null,
    permissions: ['user', 'admin', 'hr'],
  },
  {
    id: '4',
    name: '鈴木一郎',
    email: 'suzuki@example.com',
    department: '開発部',
    position: 'インターン',
    status: 'inactive',
    hireDate: '2023-09-01',
    terminationDate: '2024-01-10',
    lastLoginAt: '2024-01-10T17:30:00Z',
    saasAccounts: [
      {
        id: '7',
        saasId: 'google',
        accountId: 'suzuki@company.com',
        status: 'suspended',
      },
    ],
    avatar: '/avatars/suzuki.jpg',
    phone: '090-4567-8901',
    location: '東京オフィス',
    manager: '田中太郎',
    permissions: ['user'],
  },
];

// フィルタリング・検索の状態
interface UserFilters {
  search: string;
  department: string;
  status: string;
  position: string;
}

export default function UsersPage() {
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    department: '',
    status: '',
    position: '',
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // フィルタリングされたユーザーリスト
  const filteredUsers = sampleUsers.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.department.toLowerCase().includes(filters.search.toLowerCase());
    const matchesDepartment =
      !filters.department ||
      filters.department === 'all' ||
      user.department === filters.department;
    const matchesStatus =
      !filters.status ||
      filters.status === 'all' ||
      user.status === filters.status;
    const matchesPosition =
      !filters.position ||
      filters.position === 'all' ||
      user.position === filters.position;

    return (
      matchesSearch && matchesDepartment && matchesStatus && matchesPosition
    );
  });

  // ユニークな部署、ポジション、ステータスのリスト
  const uniqueDepartments = [
    ...new Set(sampleUsers.map(user => user.department)),
  ];
  const uniquePositions = [...new Set(sampleUsers.map(user => user.position))];
  const uniqueStatuses = [...new Set(sampleUsers.map(user => user.status))];

  const handleUserAction = (user: User, action: string) => {
    setSelectedUser(user);
    switch (action) {
      case 'view':
        setIsDetailsOpen(true);
        break;
      case 'edit':
        setIsEditOpen(true);
        break;
      case 'delete':
        if (confirm(`${user.name}さんを削除しますか？`)) {
          console.log('削除:', user);
        }
        break;
      default:
        console.log(`${action}:`, user);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            アクティブ
          </Badge>
        );
      case 'inactive':
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            非アクティブ
          </Badge>
        );
      case 'suspended':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            停止中
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  return (
    <div className="space-y-6 p-6">
      {/* ページヘッダー */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ユーザー管理</h1>
          <p className="text-gray-600">
            従業員とそのSaaSアカウントを管理します ({filteredUsers.length}/
            {sampleUsers.length}名)
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            CSVインポート
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            エクスポート
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            新規ユーザー
          </Button>
        </div>
      </div>

      {/* 検索・フィルター */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  placeholder="名前、メール、部署で検索..."
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
                value={filters.department}
                onValueChange={value =>
                  setFilters(prev => ({ ...prev, department: value }))
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="部署" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全て</SelectItem>
                  {uniqueDepartments.map(dept => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                      {status === 'active'
                        ? 'アクティブ'
                        : status === 'inactive'
                          ? '非アクティブ'
                          : '停止中'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters.position}
                onValueChange={value =>
                  setFilters(prev => ({ ...prev, position: value }))
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="役職" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全て</SelectItem>
                  {uniquePositions.map(position => (
                    <SelectItem key={position} value={position}>
                      {position}
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
                    department: 'all',
                    status: 'all',
                    position: 'all',
                  })
                }
              >
                クリア
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ユーザー一覧 */}
      {filteredUsers.length === 0 ? (
        <EmptyState
          type="no-users"
          title="ユーザーが見つかりません"
          description="検索条件に一致するユーザーがありません。フィルターを変更するか、新しいユーザーを追加してください。"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map(user => (
            <Card
              key={user.id}
              className="overflow-hidden transition-shadow hover:shadow-md"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {user.name}
                      </h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleUserAction(user, 'view')}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        詳細表示
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleUserAction(user, 'edit')}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        編集
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleUserAction(user, 'delete')}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        削除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">部署・役職</span>
                    <span className="text-sm font-medium">
                      {user.department} / {user.position}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">ステータス</span>
                    {getStatusBadge(user.status)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      SaaSアカウント
                    </span>
                    <span className="text-sm font-medium">
                      {user.saasAccounts?.length || 0}件
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">最終ログイン</span>
                    <span className="text-sm font-medium">
                      {user.lastLoginAt
                        ? new Date(user.lastLoginAt).toLocaleDateString('ja-JP')
                        : 'なし'}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleUserAction(user, 'view')}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    詳細
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleUserAction(user, 'edit')}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    編集
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ユーザー詳細ダイアログ */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>ユーザー詳細</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              {/* 基本情報 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="font-semibold text-gray-900">基本情報</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{selectedUser.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{selectedUser.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{selectedUser.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{selectedUser.location}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">勤務情報</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{selectedUser.department}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{selectedUser.position}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">
                        入社: {formatDate(selectedUser.hireDate)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">
                        最終ログイン:{' '}
                        {selectedUser.lastLoginAt
                          ? formatDate(selectedUser.lastLoginAt)
                          : 'なし'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SaaSアカウント */}
              <div>
                <h3 className="font-semibold text-gray-900">SaaSアカウント</h3>
                <div className="mt-2 space-y-2">
                  {selectedUser.saasAccounts?.map(account => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100">
                          <span className="text-xs font-medium">
                            {account.saasId.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{account.saasId}</p>
                          <p className="text-sm text-gray-500">
                            {account.accountId}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(account.status)}
                    </div>
                  ))}
                </div>
              </div>

              {/* 権限 */}
              <div>
                <h3 className="font-semibold text-gray-900">権限</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedUser.permissions?.map(permission => (
                    <Badge key={permission} variant="outline">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 編集ダイアログ */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>ユーザー編集</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  名前
                </label>
                <Input defaultValue={selectedUser?.name} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  メールアドレス
                </label>
                <Input defaultValue={selectedUser?.email} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  部署
                </label>
                <Select defaultValue={selectedUser?.department}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueDepartments.map(dept => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  役職
                </label>
                <Select defaultValue={selectedUser?.position}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {uniquePositions.map(position => (
                      <SelectItem key={position} value={position}>
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  電話番号
                </label>
                <Input defaultValue={selectedUser?.phone} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  勤務地
                </label>
                <Input defaultValue={selectedUser?.location} />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                キャンセル
              </Button>
              <Button
                onClick={() => {
                  console.log('保存:', selectedUser);
                  setIsEditOpen(false);
                }}
              >
                保存
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
