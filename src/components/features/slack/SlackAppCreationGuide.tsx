'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ExternalLink,
  CheckCircle,
  Copy,
  ArrowRight,
  Info,
  AlertCircle,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SlackAppCreationGuideProps {
  onNext: () => void;
}

export default function SlackAppCreationGuide({
  onNext,
}: SlackAppCreationGuideProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showHelpText, setShowHelpText] = useState(false);

  const appManifest = {
    display_information: {
      name: 'SaaS Account Manager',
      description: 'エンタープライズ向けSaaSアカウント管理システム',
      background_color: '#2563eb',
    },
    features: {
      bot_user: {
        display_name: 'SaaS Account Manager Bot',
        always_online: false,
      },
    },
    oauth_config: {
      redirect_urls: [
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/slack/oauth/callback`,
      ],
      scopes: {
        user: ['users:read', 'users:read.email', 'team:read'],
        bot: [
          'users:read',
          'users:read.email',
          'users:write',
          'team:read',
          'channels:read',
          'channels:write',
          'channels:manage',
          'groups:read',
          'groups:write',
          'chat:write',
          'commands',
        ],
      },
    },
    settings: {
      event_subscriptions: {
        request_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/slack/events`,
        bot_events: [
          'user_change',
          'team_join',
          'member_joined_channel',
          'member_left_channel',
        ],
      },
      interactivity: {
        is_enabled: true,
        request_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/slack/interactive`,
      },
      org_deploy_enabled: false,
      socket_mode_enabled: false,
      token_rotation_enabled: false,
    },
  };

  const steps = [
    {
      id: 1,
      title: 'Slack API サイトにアクセス',
      description: 'Slack API サイトでアプリケーションを作成します',
      action: 'Visit Slack API',
      url: 'https://api.slack.com/apps',
      instructions: [
        'https://api.slack.com/apps にアクセス',
        '「Create New App」をクリック',
        '「From an app manifest」を選択',
        'ワークスペースを選択',
      ],
    },
    {
      id: 2,
      title: 'アプリマニフェストを設定',
      description: 'アプリケーションの設定をマニフェストから読み込みます',
      instructions: [
        '以下のマニフェストをコピー',
        'Slack APIサイトのテキストエリアに貼り付け',
        '「Next」をクリック',
        'Review画面で「Create」をクリック',
      ],
    },
    {
      id: 3,
      title: 'Basic Information の確認',
      description: 'アプリケーションの基本情報を確認します',
      instructions: [
        'アプリが作成されると「Basic Information」ページが表示される',
        '「Client ID」「Client Secret」「Signing Secret」を後で使用',
        'これらの値は次のステップで入力が必要',
      ],
    },
  ];

  const handleStepComplete = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const handleCopyManifest = () => {
    navigator.clipboard.writeText(JSON.stringify(appManifest, null, 2));
    // トースト通知を表示したい場合はtoast hookを使用
  };

  const isAllStepsComplete = completedSteps.length === steps.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Step 1: Slack API アプリケーションの作成
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Slack連携を行うには、まずSlack
                APIアプリケーションを作成する必要があります。
                以下の手順に従って作成してください。
              </AlertDescription>
            </Alert>

            <div className="space-y-6">
              {steps.map(step => (
                <div
                  key={step.id}
                  className={`rounded-lg border p-4 ${
                    completedSteps.includes(step.id)
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        completedSteps.includes(step.id)
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {completedSteps.includes(step.id) ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <span className="text-sm font-medium">{step.id}</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium">{step.title}</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {step.description}
                      </p>

                      <div className="mt-3 space-y-2">
                        {step.instructions.map((instruction, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded bg-gray-100 text-xs">
                              {index + 1}
                            </div>
                            <span className="text-sm">{instruction}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex gap-2">
                        {step.url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(step.url, '_blank')}
                          >
                            <ExternalLink className="mr-1 h-4 w-4" />
                            {step.action}
                          </Button>
                        )}

                        {step.id === 2 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopyManifest}
                          >
                            <Copy className="mr-1 h-4 w-4" />
                            マニフェストをコピー
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStepComplete(step.id)}
                          disabled={completedSteps.includes(step.id)}
                        >
                          {completedSteps.includes(step.id) ? (
                            <>
                              <CheckCircle className="mr-1 h-4 w-4" />
                              完了
                            </>
                          ) : (
                            '完了にする'
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* アプリマニフェスト */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">アプリマニフェスト</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHelpText(!showHelpText)}
                >
                  <Info className="mr-1 h-4 w-4" />
                  ヘルプ
                </Button>
              </div>

              {showHelpText && (
                <Alert className="mt-2">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    このマニフェストには、SaaS Account
                    Managerが必要とする全ての権限と設定が含まれています。 Slack
                    API
                    サイトでアプリを作成する際に、このマニフェストをコピー&ペーストしてください。
                  </AlertDescription>
                </Alert>
              )}

              <div className="relative mt-2">
                <pre className="overflow-x-auto rounded-lg bg-gray-100 p-4 text-sm">
                  {JSON.stringify(appManifest, null, 2)}
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute right-2 top-2"
                  onClick={handleCopyManifest}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* 次へボタン */}
            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex items-center gap-2">
                <Badge variant={isAllStepsComplete ? 'default' : 'secondary'}>
                  {completedSteps.length} / {steps.length} 完了
                </Badge>
                {!isAllStepsComplete && (
                  <span className="text-sm text-gray-600">
                    全ての手順を完了してください
                  </span>
                )}
              </div>

              <Button
                onClick={onNext}
                disabled={!isAllStepsComplete}
                className="flex items-center gap-2"
              >
                次へ進む
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
