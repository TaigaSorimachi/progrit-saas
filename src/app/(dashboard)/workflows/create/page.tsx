'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Workflow,
  Plus,
  User,
  Calendar,
  AlertCircle,
  Check,
  X,
  ArrowRight,
} from 'lucide-react';

interface WorkflowFormData {
  type: string;
  title: string;
  description: string;
  targetUserId: string;
  priority: string;
  dueDate: string;
  approvers: string[];
  autoApproval: boolean;
  notificationSettings: {
    email: boolean;
    slack: boolean;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  department: string;
}

export default function WorkflowCreatePage() {
  const [formData, setFormData] = useState<WorkflowFormData>({
    type: '',
    title: '',
    description: '',
    targetUserId: '',
    priority: 'medium',
    dueDate: '',
    approvers: [],
    autoApproval: false,
    notificationSettings: {
      email: true,
      slack: false,
    },
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // 実際のユーザー・承認者データは未実装のため空のデータを設定
  const users: User[] = [];
  const approvers: User[] = [];

  const workflowTypes = [
    {
      id: 'user_creation',
      label: 'ユーザー作成',
      description: '新規ユーザーアカウントの作成申請',
    },
    {
      id: 'user_deletion',
      label: 'ユーザー削除',
      description: 'ユーザーアカウントの削除申請',
    },
    {
      id: 'permission_change',
      label: '権限変更',
      description: 'ユーザー権限の変更申請',
    },
    {
      id: 'saas_access',
      label: 'SaaS アクセス',
      description: 'SaaS サービスへのアクセス申請',
    },
    {
      id: 'department_transfer',
      label: '部署異動',
      description: '部署異動に伴う権限変更申請',
    },
  ];

  const handleInputChange = (field: keyof WorkflowFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleApproverToggle = (approverId: string) => {
    setFormData(prev => ({
      ...prev,
      approvers: prev.approvers.includes(approverId)
        ? prev.approvers.filter(id => id !== approverId)
        : [...prev.approvers, approverId],
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // ワークフロー作成API呼び出し
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('ワークフローが正常に作成されました');
        // フォームをリセット
        setFormData({
          type: '',
          title: '',
          description: '',
          targetUserId: '',
          priority: 'medium',
          dueDate: '',
          approvers: [],
          autoApproval: false,
          notificationSettings: {
            email: true,
            slack: false,
          },
        });
        setStep(1);
      } else {
        throw new Error('ワークフロー作成に失敗しました');
      }
    } catch (error) {
      console.error('ワークフロー作成エラー:', error);
      alert('ワークフロー作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const getSelectedWorkflowType = () => {
    return workflowTypes.find(type => type.id === formData.type);
  };

  const getSelectedUser = () => {
    return users.find(user => user.id === formData.targetUserId);
  };

  const getSelectedApprovers = () => {
    return approvers.filter(approver =>
      formData.approvers.includes(approver.id)
    );
  };

  const canProceedToNextStep = () => {
    switch (step) {
      case 1:
        return formData.type && formData.title && formData.description;
      case 2:
        return formData.targetUserId && formData.priority && formData.dueDate;
      case 3:
        return formData.approvers.length > 0;
      default:
        return true;
    }
  };

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Workflow className="h-5 w-5" />
          ワークフロー基本情報
        </CardTitle>
        <CardDescription>
          作成するワークフローの種類と基本情報を設定
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">
            ワークフロー種類 <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {workflowTypes.map(type => (
              <div
                key={type.id}
                className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                  formData.type === type.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleInputChange('type', type.id)}
              >
                <div className="font-medium">{type.label}</div>
                <div className="text-sm text-gray-600">{type.description}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            タイトル <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={formData.title}
            onChange={e => handleInputChange('title', e.target.value)}
            placeholder="ワークフローのタイトルを入力"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            説明 <span className="text-red-500">*</span>
          </label>
          <Textarea
            value={formData.description}
            onChange={e => handleInputChange('description', e.target.value)}
            placeholder="ワークフローの詳細説明を入力"
            rows={4}
            required
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          対象ユーザーと設定
        </CardTitle>
        <CardDescription>
          ワークフローの対象ユーザーと優先度、期限を設定
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">
            対象ユーザー <span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.targetUserId}
            onValueChange={value => handleInputChange('targetUserId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="対象ユーザーを選択" />
            </SelectTrigger>
            <SelectContent>
              {users.map(user => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name} ({user.department})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            優先度 <span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.priority}
            onValueChange={value => handleInputChange('priority', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="優先度を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">高</SelectItem>
              <SelectItem value="medium">中</SelectItem>
              <SelectItem value="low">低</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            期限 <span className="text-red-500">*</span>
          </label>
          <Input
            type="datetime-local"
            value={formData.dueDate}
            onChange={e => handleInputChange('dueDate', e.target.value)}
            required
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Check className="h-5 w-5" />
          承認者設定
        </CardTitle>
        <CardDescription>ワークフローの承認者を選択</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">
            承認者 <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {approvers.map(approver => (
              <div
                key={approver.id}
                className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                  formData.approvers.includes(approver.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleApproverToggle(approver.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{approver.name}</div>
                    <div className="text-sm text-gray-600">
                      {approver.email}
                    </div>
                    <div className="text-sm text-gray-600">
                      {approver.department}
                    </div>
                  </div>
                  {formData.approvers.includes(approver.id) && (
                    <Check className="h-5 w-5 text-blue-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            複数の承認者を選択した場合、全員の承認が必要になります。
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );

  const renderStep4 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          確認と送信
        </CardTitle>
        <CardDescription>設定内容を確認してワークフローを作成</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">ワークフロー種類</h4>
            <p className="text-gray-600">{getSelectedWorkflowType()?.label}</p>
          </div>
          <div>
            <h4 className="font-medium">タイトル</h4>
            <p className="text-gray-600">{formData.title}</p>
          </div>
          <div>
            <h4 className="font-medium">対象ユーザー</h4>
            <p className="text-gray-600">{getSelectedUser()?.name}</p>
          </div>
          <div>
            <h4 className="font-medium">優先度</h4>
            <div>
              {formData.priority === 'high' && (
                <Badge variant="destructive">高</Badge>
              )}
              {formData.priority === 'medium' && (
                <Badge
                  variant="default"
                  className="bg-yellow-100 text-yellow-800"
                >
                  中
                </Badge>
              )}
              {formData.priority === 'low' && (
                <Badge variant="secondary">低</Badge>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-medium">期限</h4>
            <p className="text-gray-600">
              {formData.dueDate &&
                new Date(formData.dueDate).toLocaleString('ja-JP')}
            </p>
          </div>
          <div>
            <h4 className="font-medium">承認者</h4>
            <div className="space-y-1">
              {getSelectedApprovers().map(approver => (
                <p key={approver.id} className="text-gray-600">
                  {approver.name}
                </p>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">ワークフロー作成</h1>
        <p className="mt-2 text-gray-600">新しいワークフローを作成</p>
      </div>

      {/* ステップインジケーター */}
      <div className="mb-8 flex items-center justify-center space-x-4">
        {[1, 2, 3, 4].map(stepNumber => (
          <div key={stepNumber} className="flex items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                step === stepNumber
                  ? 'bg-blue-600 text-white'
                  : step > stepNumber
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step > stepNumber ? <Check className="h-4 w-4" /> : stepNumber}
            </div>
            {stepNumber < 4 && (
              <ArrowRight className="mx-2 h-4 w-4 text-gray-400" />
            )}
          </div>
        ))}
      </div>

      {/* ステップコンテンツ */}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}

      {/* ナビゲーションボタン */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
        >
          前へ
        </Button>
        <div className="space-x-2">
          {step < 4 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canProceedToNextStep()}
            >
              次へ
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                  作成中...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  ワークフロー作成
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
