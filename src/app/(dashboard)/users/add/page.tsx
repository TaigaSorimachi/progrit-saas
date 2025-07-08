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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  Plus,
  Upload,
  FileText,
  Check,
  AlertCircle,
} from 'lucide-react';

interface UserFormData {
  employeeId: string;
  name: string;
  email: string;
  department: string;
  position: string;
  hireDate: string;
  manager: string;
  permissions: string[];
}

export default function UserAddPage() {
  const [formData, setFormData] = useState<UserFormData>({
    employeeId: '',
    name: '',
    email: '',
    department: '',
    position: '',
    hireDate: '',
    manager: '',
    permissions: [],
  });

  const [loading, setLoading] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ユーザー作成API呼び出し
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('ユーザーが正常に作成されました');
        // フォームをリセット
        setFormData({
          employeeId: '',
          name: '',
          email: '',
          department: '',
          position: '',
          hireDate: '',
          manager: '',
          permissions: [],
        });
      } else {
        throw new Error('ユーザー作成に失敗しました');
      }
    } catch (error) {
      console.error('ユーザー作成エラー:', error);
      alert('ユーザー作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleCsvUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('csv', csvFile);

      const response = await fetch('/api/users/bulk-import', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('CSVファイルが正常に処理されました');
        setCsvFile(null);
      } else {
        throw new Error('CSVファイル処理に失敗しました');
      }
    } catch (error) {
      console.error('CSV処理エラー:', error);
      alert('CSVファイル処理に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">ユーザー追加</h1>
        <p className="mt-2 text-gray-600">新しいユーザーをシステムに追加</p>
      </div>

      <Tabs defaultValue="single" className="space-y-4">
        <TabsList>
          <TabsTrigger value="single">単一ユーザー</TabsTrigger>
          <TabsTrigger value="bulk">一括インポート</TabsTrigger>
        </TabsList>

        <TabsContent value="single">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                ユーザー情報入力
              </CardTitle>
              <CardDescription>
                新しいユーザーの基本情報を入力してください
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      社員番号 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={formData.employeeId}
                      onChange={e =>
                        handleInputChange('employeeId', e.target.value)
                      }
                      placeholder="EMP001"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      氏名 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={e => handleInputChange('name', e.target.value)}
                      placeholder="山田 太郎"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      メールアドレス <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={e => handleInputChange('email', e.target.value)}
                      placeholder="yamada@company.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      部署 <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={formData.department}
                      onValueChange={value =>
                        handleInputChange('department', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="部署を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="営業部">営業部</SelectItem>
                        <SelectItem value="開発部">開発部</SelectItem>
                        <SelectItem value="人事部">人事部</SelectItem>
                        <SelectItem value="経理部">経理部</SelectItem>
                        <SelectItem value="マーケティング部">
                          マーケティング部
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      役職 <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={formData.position}
                      onValueChange={value =>
                        handleInputChange('position', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="役職を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="部長">部長</SelectItem>
                        <SelectItem value="マネージャー">
                          マネージャー
                        </SelectItem>
                        <SelectItem value="主任">主任</SelectItem>
                        <SelectItem value="一般社員">一般社員</SelectItem>
                        <SelectItem value="インターン">インターン</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      入社日 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="date"
                      value={formData.hireDate}
                      onChange={e =>
                        handleInputChange('hireDate', e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      上司
                    </label>
                    <Input
                      type="text"
                      value={formData.manager}
                      onChange={e =>
                        handleInputChange('manager', e.target.value)
                      }
                      placeholder="田中 次郎"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline">
                    キャンセル
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                        作成中...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        ユーザー作成
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                CSVファイル一括インポート
              </CardTitle>
              <CardDescription>
                CSVファイルから複数のユーザーを一度に追加できます
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertDescription>
                    CSVファイルは以下の形式で作成してください：
                    <br />
                    <code className="mt-2 inline-block rounded bg-gray-100 px-2 py-1 text-sm">
                      社員番号,氏名,メールアドレス,部署,役職,入社日,上司
                    </code>
                  </AlertDescription>
                </Alert>

                <form onSubmit={handleCsvUpload} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      CSVファイル <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={e => setCsvFile(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:rounded-full file:border-0
                        file:bg-blue-50 file:px-4
                        file:py-2 file:text-sm
                        file:font-semibold file:text-blue-700
                        hover:file:bg-blue-100"
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline">
                      サンプルCSVダウンロード
                    </Button>
                    <Button type="submit" disabled={loading || !csvFile}>
                      {loading ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                          処理中...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          CSVアップロード
                        </>
                      )}
                    </Button>
                  </div>
                </form>

                <div className="border-t pt-4">
                  <h4 className="mb-2 font-medium">処理結果</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-green-600">
                        正常に処理されたユーザー: 0
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="text-red-600">
                        エラーがあったユーザー: 0
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
