'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ExternalLink, Check, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SlackConfigData } from '@/app/(dashboard)/saas/slack/settings/page';

interface OAuthAuthFlowProps {
  config: SlackConfigData;
  onNext: (data: Partial<SlackConfigData>) => void;
}

export default function OAuthAuthFlow({ config, onNext }: OAuthAuthFlowProps) {
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleOAuthFlow = async () => {
    setIsAuthorizing(true);

    // 実際の実装では、OAuth URLを生成してSlackにリダイレクト
    // 現在はスケルトン版のため、シミュレーション
    setTimeout(() => {
      setIsAuthorizing(false);
      setIsComplete(true);
    }, 3000);
  };

  const handleNext = () => {
    onNext({
      botToken: 'xoxb-mock-bot-token-for-testing',
      userToken: 'xoxp-mock-user-token-for-testing',
      workspaceName: 'サンプルワークスペース',
      workspaceId: 'T1234567890',
      workspaceDomain: 'sample-workspace',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Step 3: OAuth認証
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                Slackワークスペースとの連携を承認します。
              </AlertDescription>
            </Alert>

            <div className="space-y-4 text-center">
              {!isComplete ? (
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-8">
                  <div className="space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                      <ExternalLink className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Slack認証</h3>
                      <p className="text-sm text-gray-600">
                        Slackワークスペースへの接続を承認してください
                      </p>
                    </div>
                    <Button
                      onClick={handleOAuthFlow}
                      disabled={isAuthorizing}
                      className="flex items-center gap-2"
                    >
                      {isAuthorizing ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          認証中...
                        </>
                      ) : (
                        <>
                          <ExternalLink className="h-4 w-4" />
                          Slackで認証
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border-2 border-green-200 bg-green-50 p-8">
                  <div className="space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-green-800">認証完了</h3>
                      <p className="text-sm text-green-600">
                        Slackワークスペースとの連携が完了しました
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <Badge variant={isComplete ? 'default' : 'secondary'}>
                {isComplete ? '認証完了' : '認証待ち'}
              </Badge>

              <Button
                onClick={handleNext}
                disabled={!isComplete}
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
