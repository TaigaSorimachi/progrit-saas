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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  Settings,
  RefreshCw,
  Check,
  AlertCircle,
  Plus,
  GitBranch,
  Shield,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Building,
} from 'lucide-react';

interface GitHubUser {
  id: string;
  login: string;
  name: string;
  email: string;
  role: 'owner' | 'member' | 'admin';
  status: 'active' | 'suspended' | 'pending';
  avatarUrl: string;
  lastActivity: string;
  repositories: number;
  contributions: number;
}

interface GitHubOrganization {
  id: string;
  name: string;
  login: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  memberCount: number;
  repositoryCount: number;
  teamCount: number;
  plan: string;
  seats: {
    used: number;
    total: number;
  };
}

export default function GitHubPage() {
  const [organization, setOrganization] = useState<GitHubOrganization | null>(
    null
  );
  const [users, setUsers] = useState<GitHubUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrganizationInfo();
    fetchUsers();
  }, []);

  const fetchOrganizationInfo = async () => {
    try {
      // 実際のSaaS連携は未実装のため、未接続状態に設定
      setOrganization(null);
    } catch (error) {
      console.error('Organization情報の取得に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      // 実際のSaaS連携は未実装のため、空のリストに設定
      setUsers([]);
    } catch (error) {
      console.error('ユーザー情報の取得に失敗しました:', error);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      // 実際のSaaS連携は未実装のため、未接続の旨を表示
      alert('GitHub への接続設定が必要です。');
    } catch (error) {
      console.error('同期に失敗しました:', error);
      alert('同期に失敗しました');
    } finally {
      setSyncing(false);
    }
  };

  const filteredUsers = users.filter(
    user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.login.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            アクティブ
          </Badge>
        );
      case 'suspended':
        return <Badge variant="destructive">停止中</Badge>;
      case 'pending':
        return <Badge variant="secondary">保留中</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner':
        return (
          <Badge variant="default" className="bg-purple-100 text-purple-800">
            オーナー
          </Badge>
        );
      case 'admin':
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            管理者
          </Badge>
        );
      case 'member':
        return <Badge variant="outline">メンバー</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getConnectionStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            接続済み
          </Badge>
        );
      case 'disconnected':
        return <Badge variant="secondary">未接続</Badge>;
      case 'error':
        return <Badge variant="destructive">エラー</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">GitHub 連携</h1>
          <p className="mt-2 text-gray-600">GitHub Organization の管理と同期</p>
        </div>
        <Button onClick={handleSync} disabled={syncing}>
          <RefreshCw
            className={`mr-2 h-4 w-4 ${syncing ? 'animate-spin' : ''}`}
          />
          {syncing ? '同期中...' : '同期'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Organization情報
          </CardTitle>
        </CardHeader>
        <CardContent>
          {organization ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">ステータス</span>
                {getConnectionStatusBadge(organization.status)}
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Organization名</span>
                <span>{organization.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">ユーザー名</span>
                <span>@{organization.login}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">プラン</span>
                <span>{organization.plan}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">シート使用状況</span>
                <span>
                  {organization.seats.used} / {organization.seats.total}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">メンバー数</span>
                <span>{organization.memberCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">リポジトリ数</span>
                <span>{organization.repositoryCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">チーム数</span>
                <span>{organization.teamCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">最終同期</span>
                <span>
                  {new Date(organization.lastSync).toLocaleString('ja-JP')}
                </span>
              </div>
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                GitHub Organization への接続が設定されていません。
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">ユーザー管理</TabsTrigger>
          <TabsTrigger value="repositories">リポジトリ</TabsTrigger>
          <TabsTrigger value="teams">チーム</TabsTrigger>
          <TabsTrigger value="settings">設定</TabsTrigger>
          <TabsTrigger value="logs">ログ</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                ユーザー一覧
              </CardTitle>
              <CardDescription>
                GitHub Organization のメンバー管理
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-4">
                <Input
                  placeholder="ユーザー検索..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  ユーザー招待
                </Button>
              </div>

              <div className="space-y-2">
                {filteredUsers.map(user => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                        <GitBranch className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{user.name}</span>
                          {getRoleBadge(user.role)}
                        </div>
                        <div className="text-sm text-gray-500">
                          @{user.login}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {user.repositories} リポジトリ
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.contributions} コントリビューション
                        </div>
                        <div className="text-xs text-gray-500">
                          最終活動:{' '}
                          {new Date(user.lastActivity).toLocaleString('ja-JP')}
                        </div>
                      </div>
                      {getStatusBadge(user.status)}
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Shield className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="repositories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                リポジトリ管理
              </CardTitle>
              <CardDescription>Organization のリポジトリ一覧</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded border p-3">
                  <div className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">frontend-app</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">15 watchers</span>
                    <Badge variant="outline">TypeScript</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded border p-3">
                  <div className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-green-600" />
                    <span className="font-medium">backend-api</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">8 watchers</span>
                    <Badge variant="outline">Node.js</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded border p-3">
                  <div className="flex items-center gap-2">
                    <EyeOff className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">internal-tools</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">プライベート</span>
                    <Badge variant="outline">Python</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                チーム管理
              </CardTitle>
              <CardDescription>Organization のチーム一覧</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded border p-3">
                  <div>
                    <div className="font-medium">frontend-team</div>
                    <div className="text-sm text-gray-500">
                      フロントエンド開発チーム
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">5 メンバー</div>
                </div>
                <div className="flex items-center justify-between rounded border p-3">
                  <div>
                    <div className="font-medium">backend-team</div>
                    <div className="text-sm text-gray-500">
                      バックエンド開発チーム
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">4 メンバー</div>
                </div>
                <div className="flex items-center justify-between rounded border p-3">
                  <div>
                    <div className="font-medium">devops-team</div>
                    <div className="text-sm text-gray-500">
                      DevOps・インフラチーム
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">3 メンバー</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>連携設定</CardTitle>
              <CardDescription>GitHub との連携設定を管理</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">自動招待</h3>
                    <p className="text-sm text-gray-600">新入社員の自動招待</p>
                  </div>
                  <Button variant="outline">設定</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">チーム同期</h3>
                    <p className="text-sm text-gray-600">
                      部門別チームの自動作成
                    </p>
                  </div>
                  <Button variant="outline">設定</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">権限管理</h3>
                    <p className="text-sm text-gray-600">
                      リポジトリアクセス権限の管理
                    </p>
                  </div>
                  <Button variant="outline">設定</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>操作ログ</CardTitle>
              <CardDescription>GitHub 連携の操作履歴</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded border p-3">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Organization同期完了</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date().toLocaleString('ja-JP')}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded border p-3">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4 text-blue-600" />
                    <span>ユーザー招待: 山田 太郎</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(Date.now() - 3600000).toLocaleString('ja-JP')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
