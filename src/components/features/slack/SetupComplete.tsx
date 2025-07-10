'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Check,
  ExternalLink,
  Settings,
  Users,
  MessageSquare,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SlackConfigData } from '@/app/(dashboard)/saas/slack/settings/page';

interface SetupCompleteProps {
  config: SlackConfigData;
  onComplete: () => void;
}

export default function SetupComplete({
  config,
  onComplete,
}: SetupCompleteProps) {
  const features = [
    {
      icon: <Users className="h-5 w-5" />,
      title: 'ユーザー管理',
      description: 'Slackユーザーの招待、削除、権限管理が可能',
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      title: 'チャンネル管理',
      description: 'チャンネルの作成、ユーザー追加、設定変更が可能',
    },
    {
      icon: <Settings className="h-5 w-5" />,
      title: 'ワークスペース同期',
      description: 'ワークスペース情報の自動同期とリアルタイム更新',
    },
  ];

  const nextSteps = [
    {
      title: 'ユーザー管理',
      description: 'Slackユーザーの一覧表示や招待機能を確認',
      action: '/saas/slack',
    },
    {
      title: 'ワークフロー設定',
      description: '自動化ワークフローの設定',
      action: '/workflows',
    },
    {
      title: 'ログ・監査',
      description: '操作ログと監査証跡の確認',
      action: '/reports/activity',
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="h-5 w-5" />
            Step 5: 設定完了
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* 完了メッセージ */}
            <div className="rounded-lg border-2 border-green-200 bg-green-50 p-8 text-center">
              <div className="space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-green-800">設定完了</h3>
                  <p className="text-sm text-green-600">
                    Slack連携の設定が正常に完了しました！
                  </p>
                </div>
              </div>
            </div>

            {/* 設定概要 */}
            <div className="space-y-4">
              <h3 className="font-medium">設定概要</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded bg-gray-50 p-3">
                    <span className="text-sm font-medium">
                      ワークスペース名
                    </span>
                    <span className="text-sm text-gray-600">
                      {config.workspaceName || '未設定'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded bg-gray-50 p-3">
                    <span className="text-sm font-medium">
                      ワークスペースID
                    </span>
                    <span className="text-sm text-gray-600">
                      {config.workspaceId || '未設定'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded bg-gray-50 p-3">
                    <span className="text-sm font-medium">ドメイン</span>
                    <span className="text-sm text-gray-600">
                      {config.workspaceDomain || '未設定'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded bg-gray-50 p-3">
                    <span className="text-sm font-medium">認証状態</span>
                    <Badge variant="default">
                      <Check className="mr-1 h-3 w-3" />
                      認証済み
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* 利用可能機能 */}
            <div className="space-y-4">
              <h3 className="font-medium">利用可能な機能</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {features.map((feature, index) => (
                  <div key={index} className="rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">{feature.title}</h4>
                        <p className="text-xs text-gray-600">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 次のステップ */}
            <div className="space-y-4">
              <h3 className="font-medium">次のステップ</h3>
              <div className="space-y-3">
                {nextSteps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <h4 className="text-sm font-medium">{step.title}</h4>
                      <p className="text-xs text-gray-600">
                        {step.description}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(step.action, '_blank')}
                    >
                      <ExternalLink className="mr-1 h-3 w-3" />
                      開く
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* 重要な注意事項 */}
            <Alert>
              <Settings className="h-4 w-4" />
              <AlertDescription>
                <strong>セキュリティ注意:</strong>
                設定された認証情報は暗号化されて保存されています。
                設定を変更する場合は、再度このウィザードを実行してください。
              </AlertDescription>
            </Alert>

            {/* 完了ボタン */}
            <div className="flex items-center justify-center border-t pt-4">
              <Button
                onClick={onComplete}
                className="flex items-center gap-2"
                size="lg"
              >
                <Check className="h-4 w-4" />
                設定完了
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
