'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CheckCircle, XCircle, Loader2, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SlackConfigData } from '@/app/(dashboard)/saas/slack/settings/page';
import { useSlackConfigActions } from '@/hooks/useApi';

interface ConfigTestProps {
  config: SlackConfigData;
  onNext: () => void;
}

export default function ConfigTest({ config, onNext }: ConfigTestProps) {
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const { testConfig } = useSlackConfigActions();

  const handleRunTest = async () => {
    setIsTestRunning(true);

    try {
      const result = await testConfig.mutate({
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        signingSecret: config.signingSecret,
        botToken: config.botToken,
        userToken: config.userToken,
      });

      setTestResults(result);
    } catch (error) {
      setTestResults({
        success: false,
        tests: {
          authTest: { success: false, message: '接続テストに失敗しました' },
          teamInfo: { success: false, message: '接続テストに失敗しました' },
          usersList: { success: false, message: '接続テストに失敗しました' },
        },
        overallResult: 'failed',
      });
    } finally {
      setIsTestRunning(false);
    }
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusColor = (success: boolean) => {
    return success ? 'text-green-600' : 'text-red-600';
  };

  const isTestComplete = testResults !== null;
  const isTestSuccessful = testResults?.overallResult === 'success';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Step 4: 設定テスト
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                Slack連携の設定をテストして、正しく接続できることを確認します。
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              {!isTestComplete ? (
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                  <div className="space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                      <Info className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">設定テスト</h3>
                      <p className="text-sm text-gray-600">
                        Slack連携の設定をテストします
                      </p>
                    </div>
                    <Button
                      onClick={handleRunTest}
                      disabled={isTestRunning}
                      className="flex items-center gap-2"
                    >
                      {isTestRunning ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          テスト実行中...
                        </>
                      ) : (
                        <>
                          <Info className="h-4 w-4" />
                          テスト実行
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div
                    className={`rounded-lg border-2 p-4 ${
                      isTestSuccessful
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="text-center">
                      <div
                        className={`mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full ${
                          isTestSuccessful ? 'bg-green-100' : 'bg-red-100'
                        }`}
                      >
                        {isTestSuccessful ? (
                          <CheckCircle className="h-8 w-8 text-green-600" />
                        ) : (
                          <XCircle className="h-8 w-8 text-red-600" />
                        )}
                      </div>
                      <h3
                        className={`font-medium ${
                          isTestSuccessful ? 'text-green-800' : 'text-red-800'
                        }`}
                      >
                        {isTestSuccessful ? 'テスト成功' : 'テスト失敗'}
                      </h3>
                      <p
                        className={`text-sm ${
                          isTestSuccessful ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {isTestSuccessful
                          ? 'Slack連携の設定は正常に動作しています'
                          : 'Slack連携の設定に問題があります'}
                      </p>
                    </div>
                  </div>

                  {/* テスト結果詳細 */}
                  <div className="space-y-3">
                    <h4 className="font-medium">テスト結果詳細</h4>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between rounded bg-gray-50 p-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(testResults?.tests?.authTest?.success)}
                          <span className="text-sm font-medium">
                            認証テスト
                          </span>
                        </div>
                        <span
                          className={`text-sm ${getStatusColor(
                            testResults?.tests?.authTest?.success
                          )}`}
                        >
                          {testResults?.tests?.authTest?.message || '未実行'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between rounded bg-gray-50 p-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(testResults?.tests?.teamInfo?.success)}
                          <span className="text-sm font-medium">
                            チーム情報取得
                          </span>
                        </div>
                        <span
                          className={`text-sm ${getStatusColor(
                            testResults?.tests?.teamInfo?.success
                          )}`}
                        >
                          {testResults?.tests?.teamInfo?.message || '未実行'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between rounded bg-gray-50 p-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(
                            testResults?.tests?.usersList?.success
                          )}
                          <span className="text-sm font-medium">
                            ユーザー一覧取得
                          </span>
                        </div>
                        <span
                          className={`text-sm ${getStatusColor(
                            testResults?.tests?.usersList?.success
                          )}`}
                        >
                          {testResults?.tests?.usersList?.message || '未実行'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!isTestSuccessful && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={handleRunTest}
                        disabled={isTestRunning}
                        className="flex items-center gap-2"
                      >
                        {isTestRunning ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            再テスト中...
                          </>
                        ) : (
                          '再テスト'
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <Badge variant={isTestSuccessful ? 'default' : 'secondary'}>
                {isTestComplete
                  ? isTestSuccessful
                    ? 'テスト成功'
                    : 'テスト失敗'
                  : 'テスト未実行'}
              </Badge>

              <Button
                onClick={onNext}
                disabled={!isTestComplete || !isTestSuccessful}
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
