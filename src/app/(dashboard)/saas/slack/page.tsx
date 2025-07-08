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
  Hash,
  MessageSquare,
  Shield,
  Edit,
  Trash2,
} from 'lucide-react';

interface SlackUser {
  id: string;
  email: string;
  name: string;
  displayName: string;
  status: 'active' | 'deactivated' | 'deleted';
  isAdmin: boolean;
  lastSeen: string;
  timeZone: string;
  profile: {
    image: string;
    title: string;
    department: string;
  };
}

interface SlackWorkspace {
  id: string;
  name: string;
  domain: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  memberCount: number;
  channelCount: number;
  adminCount: number;
}

export default function SlackPage() {
  const [workspace, setWorkspace] = useState<SlackWorkspace | null>(null);
  const [users, setUsers] = useState<SlackUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchWorkspaceInfo();
    fetchUsers();
  }, []);

  const fetchWorkspaceInfo = async () => {
    try {
      // 実際のSaaS連携は未実装のため、未接続状態に設定
      setWorkspace(null);
    } catch (error) {
      console.error('ワークスペース情報の取得に失敗しました:', error);
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
      alert('Slack への接続設定が必要です。');
    } catch (error) {
      console.error('同期に失敗しました:', error);
      alert('同期に失敗しました');
    } finally {
      setSyncing(false);
    }
  };

  const filteredUsers = users.filter(
    user =>
      user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.profile.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            アクティブ
          </Badge>
        );
      case 'deactivated':
        return <Badge variant="destructive">無効</Badge>;
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
          <h1 className="text-3xl font-bold">Slack 連携</h1>
          <p className="mt-2 text-gray-600">Slack ワークスペースの管理と同期</p>
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
            <MessageSquare className="h-5 w-5" />
            ワークスペース情報
          </CardTitle>
        </CardHeader>
        <CardContent>
          {workspace ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">ステータス</span>
                {getConnectionStatusBadge(workspace.status)}
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">ワークスペース名</span>
                <span>{workspace.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">ドメイン</span>
                <span>{workspace.domain}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">メンバー数</span>
                <span>{workspace.memberCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">チャンネル数</span>
                <span>{workspace.channelCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">管理者数</span>
                <span>{workspace.adminCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">最終同期</span>
                <span>
                  {new Date(workspace.lastSync).toLocaleString('ja-JP')}
                </span>
              </div>
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Slack ワークスペースへの接続が設定されていません。
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">ユーザー管理</TabsTrigger>
          <TabsTrigger value="channels">チャンネル</TabsTrigger>
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
                Slack ワークスペースのメンバー管理
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
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                        <MessageSquare className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {user.displayName}
                          </span>
                          {user.isAdmin && (
                            <Badge variant="secondary" className="text-xs">
                              管理者
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          @{user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {user.profile.department}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.profile.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          最終アクセス:{' '}
                          {new Date(user.lastSeen).toLocaleString('ja-JP')}
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

        <TabsContent value="channels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                チャンネル管理
              </CardTitle>
              <CardDescription>Slack チャンネルの管理</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded border p-3">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-green-600" />
                    <span>general</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">45 メンバー</span>
                    <Badge variant="outline">パブリック</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded border p-3">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-blue-600" />
                    <span>development</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">12 メンバー</span>
                    <Badge variant="outline">プライベート</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded border p-3">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-orange-600" />
                    <span>sales</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">8 メンバー</span>
                    <Badge variant="outline">プライベート</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>連携設定</CardTitle>
              <CardDescription>Slack との連携設定を管理</CardDescription>
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
                    <h3 className="font-medium">チャンネル自動作成</h3>
                    <p className="text-sm text-gray-600">
                      部門別チャンネルの自動作成
                    </p>
                  </div>
                  <Button variant="outline">設定</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">アクセス制御</h3>
                    <p className="text-sm text-gray-600">
                      退職者の自動アクセス無効化
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
              <CardDescription>Slack 連携の操作履歴</CardDescription>
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
