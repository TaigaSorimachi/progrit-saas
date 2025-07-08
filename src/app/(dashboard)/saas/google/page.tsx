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
  X,
  AlertCircle,
  Plus,
  Trash2,
  Edit,
  Shield,
} from 'lucide-react';

interface GoogleUser {
  id: string;
  email: string;
  name: string;
  department: string;
  status: 'active' | 'suspended' | 'deleted';
  lastLogin: string;
  orgUnit: string;
  createdAt: string;
}

interface GoogleConnection {
  id: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  domain: string;
  adminEmail: string;
  userCount: number;
  licenseCount: number;
  usedLicenses: number;
}

export default function GoogleWorkspacePage() {
  const [connection, setConnection] = useState<GoogleConnection | null>(null);
  const [users, setUsers] = useState<GoogleUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchConnectionStatus();
    fetchUsers();
  }, []);

  const fetchConnectionStatus = async () => {
    try {
      // 実際のSaaS連携は未実装のため、未接続状態に設定
      setConnection(null);
    } catch (error) {
      console.error('接続状態の取得に失敗しました:', error);
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
      alert('Google Workspace への接続設定が必要です。');
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
      user.department.toLowerCase().includes(searchTerm.toLowerCase())
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
      case 'deleted':
        return <Badge variant="secondary">削除済み</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
          <h1 className="text-3xl font-bold">Google Workspace 連携</h1>
          <p className="mt-2 text-gray-600">
            Google Workspace アカウントの管理と同期
          </p>
        </div>
        <Button onClick={handleSync} disabled={syncing}>
          <RefreshCw
            className={`mr-2 h-4 w-4 ${syncing ? 'animate-spin' : ''}`}
          />
          {syncing ? '同期中...' : '同期'}
        </Button>
      </div>

      {/* 接続状態 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            接続状態
          </CardTitle>
        </CardHeader>
        <CardContent>
          {connection ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">ステータス</span>
                {getConnectionStatusBadge(connection.status)}
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">ドメイン</span>
                <span>{connection.domain}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">管理者</span>
                <span>{connection.adminEmail}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">最終同期</span>
                <span>
                  {new Date(connection.lastSync).toLocaleString('ja-JP')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">ライセンス使用状況</span>
                <span>
                  {connection.usedLicenses} / {connection.licenseCount}
                </span>
              </div>
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Google Workspace への接続が設定されていません。
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* タブ */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">ユーザー管理</TabsTrigger>
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
                Google Workspace のユーザーアカウント管理
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
                  ユーザー追加
                </Button>
              </div>

              <div className="space-y-2">
                {filteredUsers.map(user => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {user.department}
                        </div>
                        <div className="text-xs text-gray-500">
                          最終ログイン:{' '}
                          {new Date(user.lastLogin).toLocaleString('ja-JP')}
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

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>連携設定</CardTitle>
              <CardDescription>
                Google Workspace との連携設定を管理
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">自動同期</h3>
                    <p className="text-sm text-gray-600">
                      定期的にユーザー情報を同期
                    </p>
                  </div>
                  <Button variant="outline">設定</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">プロビジョニング</h3>
                    <p className="text-sm text-gray-600">
                      ユーザーの自動作成・削除
                    </p>
                  </div>
                  <Button variant="outline">設定</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">権限同期</h3>
                    <p className="text-sm text-gray-600">
                      組織単位と権限の同期
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
              <CardDescription>Google Workspace 連携の操作履歴</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded border p-3">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>ユーザー同期完了</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date().toLocaleString('ja-JP')}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded border p-3">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4 text-blue-600" />
                    <span>ユーザー追加: 山田 太郎</span>
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
