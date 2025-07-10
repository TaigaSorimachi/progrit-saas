'use client';

import { useState, useMemo } from 'react';
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
  ExternalLink,
} from 'lucide-react';
import {
  useSlackWorkspace,
  useSlackUsers,
  useSlackChannels,
  useSlackActions,
} from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

export default function SlackPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const { toast } = useToast();

  // API フックの使用
  const {
    data: workspace,
    loading: workspaceLoading,
    error: workspaceError,
    refetch: refetchWorkspace,
  } = useSlackWorkspace();
  const {
    data: users,
    loading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useSlackUsers();
  const {
    data: channels,
    loading: channelsLoading,
    error: channelsError,
    refetch: refetchChannels,
  } = useSlackChannels();
  const slackActions = useSlackActions();

  const handleSync = async () => {
    try {
      const result = await slackActions.sync.mutate({ action: 'sync' });
      if (result) {
        toast({
          title: '同期完了',
          description: 'Slack との同期が完了しました',
        });
        refetchWorkspace();
        refetchUsers();
        refetchChannels();
      }
    } catch (error) {
      toast({
        title: '同期エラー',
        description: 'Slack との同期に失敗しました',
        variant: 'destructive',
      });
    }
  };

  const handleInviteUser = async () => {
    if (!newUserEmail) {
      toast({
        title: 'エラー',
        description: 'メールアドレスを入力してください',
        variant: 'destructive',
      });
      return;
    }

    setInviteLoading(true);
    try {
      const result = await slackActions.inviteUser.mutate({
        action: 'invite',
        email: newUserEmail,
        channels: ['general'],
      });

      if (result) {
        toast({
          title: '招待完了',
          description: `${newUserEmail} を Slack に招待しました`,
        });
        setNewUserEmail('');
        refetchUsers();
      }
    } catch (error) {
      toast({
        title: '招待エラー',
        description: 'ユーザーの招待に失敗しました',
        variant: 'destructive',
      });
    } finally {
      setInviteLoading(false);
    }
  };

  const handleDeactivateUser = async (userId: string, userName: string) => {
    if (!confirm(`${userName} を無効化しますか？`)) return;

    try {
      const result = await slackActions.deactivateUser.mutate({
        action: 'deactivate',
        userId,
      });

      if (result) {
        toast({
          title: '無効化完了',
          description: `${userName} を無効化しました`,
        });
        refetchUsers();
      }
    } catch (error) {
      toast({
        title: '無効化エラー',
        description: 'ユーザーの無効化に失敗しました',
        variant: 'destructive',
      });
    }
  };

  const filteredUsers = useMemo(() => {
    // デバッグ用：usersの実際の値をログに出力（開発環境のみ）
    if (process.env.NODE_ENV === 'development') {
      console.log(
        'Users data:',
        users,
        'Type:',
        typeof users,
        'IsArray:',
        Array.isArray(users)
      );
    }

    // usersが配列でない場合は空配列を返す
    if (!users || !Array.isArray(users)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Users is not an array:', users);
      }
      return [];
    }

    return users.filter(
      user =>
        user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.profile?.department
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

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

  if (workspaceLoading || usersLoading || channelsLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Slack 設定エラーの場合
  if (workspaceError && workspaceError.includes('SLACK_NOT_CONFIGURED')) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Slack 連携</h1>
            <p className="mt-2 text-gray-600">
              Slack ワークスペースの管理と同期
            </p>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Slack 連携設定
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Slack 連携を使用するには、以下の環境変数を設定してください：
                <ul className="ml-4 mt-2 list-disc">
                  <li>SLACK_CLIENT_ID</li>
                  <li>SLACK_CLIENT_SECRET</li>
                  <li>SLACK_SIGNING_SECRET</li>
                  <li>SLACK_BOT_TOKEN</li>
                </ul>
              </AlertDescription>
            </Alert>
            <div className="mt-4 flex gap-4">
              <Button
                onClick={() => (window.location.href = '/saas/slack/settings')}
              >
                <Settings className="mr-2 h-4 w-4" />
                GUI で設定
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  window.open('https://api.slack.com/apps', '_blank')
                }
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Slack App を作成
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                再読み込み
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ユーザー取得エラーの場合
  if (usersError) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Users error:', usersError);
    }
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Slack 連携</h1>
            <p className="mt-2 text-gray-600">
              Slack ワークスペースの管理と同期
            </p>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              データ取得エラー
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Slack ユーザー一覧の取得に失敗しました。
                <br />
                エラー: {usersError}
              </AlertDescription>
            </Alert>
            <div className="mt-4 flex gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  refetchUsers();
                  refetchWorkspace();
                  refetchChannels();
                }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                再試行
              </Button>
            </div>
          </CardContent>
        </Card>
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
        <Button onClick={handleSync} disabled={slackActions.sync.loading}>
          <RefreshCw
            className={`mr-2 h-4 w-4 ${slackActions.sync.loading ? 'animate-spin' : ''}`}
          />
          {slackActions.sync.loading ? '同期中...' : '同期'}
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
              <div className="mb-4 space-y-4">
                <div className="flex items-center gap-4">
                  <Input
                    placeholder="ユーザー検索..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Input
                    placeholder="招待するメールアドレス"
                    value={newUserEmail}
                    onChange={e => setNewUserEmail(e.target.value)}
                    className="max-w-sm"
                    type="email"
                  />
                  <Button
                    onClick={handleInviteUser}
                    disabled={inviteLoading || !newUserEmail}
                  >
                    {inviteLoading ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="mr-2 h-4 w-4" />
                    )}
                    ユーザー招待
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
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
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDeactivateUser(user.id, user.displayName)
                            }
                            disabled={user.status !== 'active'}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    {searchTerm ? (
                      <div>
                        <p>
                          「{searchTerm}」に一致するユーザーが見つかりません
                        </p>
                        <Button
                          variant="outline"
                          className="mt-2"
                          onClick={() => setSearchTerm('')}
                        >
                          検索をクリア
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <p>ユーザーが見つかりません</p>
                        <Button
                          variant="outline"
                          className="mt-2"
                          onClick={() => refetchUsers()}
                        >
                          再読み込み
                        </Button>
                      </div>
                    )}
                  </div>
                )}
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
                {channels && channels.length > 0 ? (
                  channels.map(channel => (
                    <div
                      key={channel.id}
                      className="flex items-center justify-between rounded border p-3"
                    >
                      <div className="flex items-center gap-2">
                        <Hash
                          className={`h-4 w-4 ${
                            channel.isPrivate
                              ? 'text-orange-600'
                              : 'text-green-600'
                          }`}
                        />
                        <span>#{channel.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {channel.memberCount} メンバー
                        </span>
                        <Badge variant="outline">
                          {channel.isPrivate ? 'プライベート' : 'パブリック'}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    チャンネルが見つかりません
                  </div>
                )}
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
