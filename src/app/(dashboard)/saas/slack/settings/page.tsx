'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Check,
  Settings,
  ArrowRight,
  AlertCircle,
  ExternalLink,
  Loader2,
  Info,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSlackConfig, useSlackConfigActions } from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

// ステップ画面のコンポーネントをインポート
import SlackAppCreationGuide from '@/components/features/slack/SlackAppCreationGuide';
import BasicInfoForm from '@/components/features/slack/BasicInfoForm';
import OAuthAuthFlow from '@/components/features/slack/OAuthAuthFlow';
import ConfigTest from '@/components/features/slack/ConfigTest';
import SetupComplete from '@/components/features/slack/SetupComplete';

export interface SlackConfigData {
  id?: string;
  clientId: string;
  clientSecret: string;
  signingSecret: string;
  botToken?: string;
  userToken?: string;
  workspaceName?: string;
  workspaceId?: string;
  workspaceDomain?: string;
}

export default function SlackSettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: existingConfig, loading: configLoading } = useSlackConfig();
  const { saveConfig, updateConfig } = useSlackConfigActions();

  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<SlackConfigData>({
    clientId: '',
    clientSecret: '',
    signingSecret: '',
    botToken: '',
    userToken: '',
    workspaceName: '',
    workspaceId: '',
    workspaceDomain: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  // 既存の設定がある場合は編集モード
  useEffect(() => {
    if (existingConfig) {
      setConfig(existingConfig);
      setIsEditing(true);
    }
  }, [existingConfig]);

  const handleStepComplete = (stepData: Partial<SlackConfigData>) => {
    setConfig(prev => ({ ...prev, ...stepData }));
    setStep(prev => prev + 1);
  };

  const handleComplete = async () => {
    try {
      if (isEditing && config.id) {
        await updateConfig.mutate(config);
      } else {
        await saveConfig.mutate(config);
      }

      toast({
        title: '設定完了',
        description: 'Slack連携の設定が完了しました！',
      });

      // メインのSlack管理画面に戻る
      router.push('/saas/slack');
    } catch (error) {
      toast({
        title: '設定エラー',
        description: 'Slack連携の設定に失敗しました。',
        variant: 'destructive',
      });
    }
  };

  const steps = [
    {
      id: 1,
      title: 'Slack App作成',
      description: 'Slack APIアプリケーションを作成',
      icon: <ExternalLink className="h-4 w-4" />,
    },
    {
      id: 2,
      title: '基本情報設定',
      description: 'Client IDとSecretを設定',
      icon: <Settings className="h-4 w-4" />,
    },
    {
      id: 3,
      title: 'OAuth認証',
      description: 'Slackワークスペースとの接続',
      icon: <Check className="h-4 w-4" />,
    },
    {
      id: 4,
      title: '設定テスト',
      description: '接続テストの実行',
      icon: <Info className="h-4 w-4" />,
    },
    {
      id: 5,
      title: '設定完了',
      description: '設定の保存と有効化',
      icon: <Check className="h-4 w-4" />,
    },
  ];

  const progress = ((step - 1) / (steps.length - 1)) * 100;

  if (configLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">設定を読み込んでいます...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Slack連携設定</h1>
          <p className="mt-2 text-gray-600">
            {isEditing ? 'Slack連携設定を編集' : 'Slack連携の初期設定'}
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push('/saas/slack')}>
          戻る
        </Button>
      </div>

      {/* 既存設定がある場合の警告 */}
      {isEditing && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            既存のSlack連携設定を編集しています。変更を保存すると現在の設定が上書きされます。
          </AlertDescription>
        </Alert>
      )}

      {/* 進行状況 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            設定進行状況
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                ステップ {step} / {steps.length}
              </span>
              <Badge variant={step === steps.length ? 'default' : 'secondary'}>
                {Math.round(progress)}%
              </Badge>
            </div>
            <Progress value={progress} className="w-full" />

            {/* ステップ表示 */}
            <div className="grid grid-cols-5 gap-2">
              {steps.map(stepInfo => (
                <div
                  key={stepInfo.id}
                  className={`rounded-lg border p-2 text-center ${
                    step >= stepInfo.id
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div
                    className={`mb-1 inline-flex h-8 w-8 items-center justify-center rounded-full ${
                      step >= stepInfo.id
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {stepInfo.icon}
                  </div>
                  <div className="text-xs font-medium">{stepInfo.title}</div>
                  <div className="text-xs text-gray-500">
                    {stepInfo.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ステップ別コンテンツ */}
      <div className="mx-auto max-w-2xl">
        {step === 1 && <SlackAppCreationGuide onNext={() => setStep(2)} />}
        {step === 2 && (
          <BasicInfoForm
            config={config}
            onNext={data => handleStepComplete(data)}
          />
        )}
        {step === 3 && (
          <OAuthAuthFlow
            config={config}
            onNext={data => handleStepComplete(data)}
          />
        )}
        {step === 4 && <ConfigTest config={config} onNext={() => setStep(5)} />}
        {step === 5 && (
          <SetupComplete config={config} onComplete={handleComplete} />
        )}
      </div>
    </div>
  );
}
