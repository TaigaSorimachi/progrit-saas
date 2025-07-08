'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  Shield,
  Edit,
  Plus,
  Search,
  Check,
  X,
  AlertCircle,
  Settings,
} from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  enabled: boolean;
}

interface UserPermission {
  userId: string;
  userName: string;
  email: string;
  department: string;
  role: string;
  permissions: Permission[];
}

interface PermissionTemplate {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

export default function UserPermissionsPage() {
  const [users, setUsers] = useState<UserPermission[]>([]);
  const [templates, setTemplates] = useState<PermissionTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  useEffect(() => {
    fetchUsers();
    fetchTemplates();
  }, []);

  const fetchUsers = async () => {
    try {
      // 実際の権限システムは未実装のため、空のデータを設定
      setUsers([]);
    } catch (error) {
      console.error('ユーザー情報の取得に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      // 実際の権限テンプレートシステムは未実装のため、空のデータを設定
      setTemplates([]);
    } catch (error) {
      console.error('テンプレート情報の取得に失敗しました:', error);
    }
  };

  const handlePermissionToggle = async (
    userId: string,
    permissionId: string
  ) => {
    try {
      // 権限の切り替え処理
      setUsers(prev =>
        prev.map(user =>
          user.userId === userId
            ? {
                ...user,
                permissions: user.permissions.map(p =>
                  p.id === permissionId ? { ...p, enabled: !p.enabled } : p
                ),
              }
            : user
        )
      );

      // API呼び出し
      console.log(`権限切り替え: ユーザー ${userId}, 権限 ${permissionId}`);
    } catch (error) {
      console.error('権限の更新に失敗しました:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === 'all' || user.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'user':
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            ユーザー
          </Badge>
        );
      case 'saas':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            SaaS
          </Badge>
        );
      case 'report':
        return (
          <Badge variant="default" className="bg-purple-100 text-purple-800">
            レポート
          </Badge>
        );
      case 'system':
        return (
          <Badge variant="default" className="bg-red-100 text-red-800">
            システム
          </Badge>
        );
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">ユーザー権限管理</h1>
        <p className="mt-2 text-gray-600">ユーザーの権限とアクセス制御を管理</p>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">ユーザー権限</TabsTrigger>
          <TabsTrigger value="templates">権限テンプレート</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                ユーザー権限一覧
              </CardTitle>
              <CardDescription>各ユーザーの権限設定を管理</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <Input
                    placeholder="ユーザー検索..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <Select
                  value={selectedDepartment}
                  onValueChange={setSelectedDepartment}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="部署で絞り込み" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部署</SelectItem>
                    <SelectItem value="営業部">営業部</SelectItem>
                    <SelectItem value="開発部">開発部</SelectItem>
                    <SelectItem value="人事部">人事部</SelectItem>
                    <SelectItem value="経理部">経理部</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {filteredUsers.map(user => (
                  <div key={user.userId} className="rounded-lg border p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{user.userName}</h3>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <p className="text-sm text-gray-500">
                            {user.department} • {user.role}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        編集
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {user.permissions.map(permission => (
                        <div
                          key={permission.id}
                          className="flex items-center justify-between rounded border p-3"
                        >
                          <div className="flex items-center gap-2">
                            {getCategoryBadge(permission.category)}
                            <div>
                              <div className="text-sm font-medium">
                                {permission.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {permission.description}
                              </div>
                            </div>
                          </div>
                          <Switch
                            checked={permission.enabled}
                            onCheckedChange={() =>
                              handlePermissionToggle(user.userId, permission.id)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  権限テンプレート
                </CardTitle>
                <CardDescription>
                  よく使用される権限の組み合わせをテンプレートとして管理
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex justify-end">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    新規テンプレート作成
                  </Button>
                </div>

                <div className="space-y-4">
                  {templates.map(template => (
                    <div key={template.id} className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-medium">{template.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {template.userCount} ユーザー
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="mb-3 text-sm text-gray-600">
                        {template.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {template.permissions.map(permissionId => (
                          <Badge key={permissionId} variant="secondary">
                            {permissionId === '1' && 'ユーザー管理'}
                            {permissionId === '2' && 'SaaS管理'}
                            {permissionId === '3' && 'レポート閲覧'}
                            {permissionId === '4' && 'システム設定'}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
