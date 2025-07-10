'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Settings,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Info,
  ExternalLink,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SlackConfigData } from '@/app/(dashboard)/saas/slack/settings/page';

interface BasicInfoFormProps {
  config: SlackConfigData;
  onNext: (data: Partial<SlackConfigData>) => void;
}

export default function BasicInfoForm({ config, onNext }: BasicInfoFormProps) {
  const [formData, setFormData] = useState({
    clientId: config.clientId || '',
    clientSecret: config.clientSecret || '',
    signingSecret: config.signingSecret || '',
  });

  const [showSecrets, setShowSecrets] = useState({
    clientSecret: false,
    signingSecret: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientId.trim()) {
      newErrors.clientId = 'Client IDは必須です';
    } else if (!/^[0-9]+\.[0-9]+$/.test(formData.clientId)) {
      newErrors.clientId =
        'Client IDの形式が正しくありません（例: 1234567890.1234567890）';
    }

    if (!formData.clientSecret.trim()) {
      newErrors.clientSecret = 'Client Secretは必須です';
    } else if (formData.clientSecret.length < 30) {
      newErrors.clientSecret = 'Client Secretが短すぎます';
    }

    if (!formData.signingSecret.trim()) {
      newErrors.signingSecret = 'Signing Secretは必須です';
    } else if (formData.signingSecret.length < 30) {
      newErrors.signingSecret = 'Signing Secretが短すぎます';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // リアルタイムでエラーをクリア
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNext = () => {
    setIsValidating(true);

    if (validateForm()) {
      onNext(formData);
    }

    setTimeout(() => setIsValidating(false), 500);
  };

  const toggleSecretVisibility = (field: 'clientSecret' | 'signingSecret') => {
    setShowSecrets(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const isFormValid =
    formData.clientId && formData.clientSecret && formData.signingSecret;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Step 2: 基本情報の設定
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Slack APIサイトの「Basic
                Information」ページから、以下の情報を取得して入力してください。
              </AlertDescription>
            </Alert>

            {/* Slack API サイトへのリンク */}
            <div className="rounded-lg bg-blue-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Slack API サイトで確認</h3>
                  <p className="text-sm text-gray-600">
                    Basic Information ページから必要な情報を取得してください
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open('https://api.slack.com/apps', '_blank')
                  }
                >
                  <ExternalLink className="mr-1 h-4 w-4" />
                  Slack API サイトを開く
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Client ID */}
              <div className="space-y-2">
                <Label htmlFor="clientId">
                  Client ID
                  <span className="ml-1 text-red-500">*</span>
                </Label>
                <Input
                  id="clientId"
                  placeholder="例: 1234567890.1234567890"
                  value={formData.clientId}
                  onChange={e => handleInputChange('clientId', e.target.value)}
                  className={errors.clientId ? 'border-red-500' : ''}
                />
                {errors.clientId ? (
                  <p className="flex items-center gap-1 text-sm text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    {errors.clientId}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">
                    Slack API サイトの「Basic Information」→「App
                    Credentials」から取得
                  </p>
                )}
              </div>

              {/* Client Secret */}
              <div className="space-y-2">
                <Label htmlFor="clientSecret">
                  Client Secret
                  <span className="ml-1 text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="clientSecret"
                    type={showSecrets.clientSecret ? 'text' : 'password'}
                    placeholder="例: 1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p"
                    value={formData.clientSecret}
                    onChange={e =>
                      handleInputChange('clientSecret', e.target.value)
                    }
                    className={
                      errors.clientSecret ? 'border-red-500 pr-10' : 'pr-10'
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => toggleSecretVisibility('clientSecret')}
                  >
                    {showSecrets.clientSecret ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.clientSecret ? (
                  <p className="flex items-center gap-1 text-sm text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    {errors.clientSecret}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">
                    Slack API サイトの「Basic Information」→「App
                    Credentials」から取得
                  </p>
                )}
              </div>

              {/* Signing Secret */}
              <div className="space-y-2">
                <Label htmlFor="signingSecret">
                  Signing Secret
                  <span className="ml-1 text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="signingSecret"
                    type={showSecrets.signingSecret ? 'text' : 'password'}
                    placeholder="例: 1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t"
                    value={formData.signingSecret}
                    onChange={e =>
                      handleInputChange('signingSecret', e.target.value)
                    }
                    className={
                      errors.signingSecret ? 'border-red-500 pr-10' : 'pr-10'
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => toggleSecretVisibility('signingSecret')}
                  >
                    {showSecrets.signingSecret ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.signingSecret ? (
                  <p className="flex items-center gap-1 text-sm text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    {errors.signingSecret}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">
                    Slack API サイトの「Basic Information」→「App
                    Credentials」から取得
                  </p>
                )}
              </div>
            </div>

            {/* 入力チェック */}
            <div className="mt-6 rounded-lg bg-gray-50 p-4">
              <h3 className="mb-2 font-medium">入力確認</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {formData.clientId ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                  )}
                  <span className="text-sm">Client ID</span>
                </div>
                <div className="flex items-center gap-2">
                  {formData.clientSecret ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                  )}
                  <span className="text-sm">Client Secret</span>
                </div>
                <div className="flex items-center gap-2">
                  {formData.signingSecret ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                  )}
                  <span className="text-sm">Signing Secret</span>
                </div>
              </div>
            </div>

            {/* セキュリティ注意 */}
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>セキュリティ注意:</strong>
                これらの情報は暗号化されて保存されます。他の人と共有しないでください。
              </AlertDescription>
            </Alert>

            {/* 次へボタン */}
            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex items-center gap-2">
                <Badge variant={isFormValid ? 'default' : 'secondary'}>
                  {isFormValid ? '入力完了' : '入力待ち'}
                </Badge>
                {!isFormValid && (
                  <span className="text-sm text-gray-600">
                    全ての項目を入力してください
                  </span>
                )}
              </div>

              <Button
                onClick={handleNext}
                disabled={!isFormValid || isValidating}
                className="flex items-center gap-2"
              >
                {isValidating ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    検証中...
                  </>
                ) : (
                  <>
                    次へ進む
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
