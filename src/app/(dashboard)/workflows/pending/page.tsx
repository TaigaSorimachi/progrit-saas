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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Clock,
  User,
  Check,
  X,
  AlertCircle,
  Search,
  Filter,
  Eye,
  MessageSquare,
} from 'lucide-react';

interface PendingWorkflow {
  id: string;
  type: 'user_creation' | 'user_deletion' | 'permission_change' | 'saas_access';
  title: string;
  description: string;
  requester: {
    name: string;
    email: string;
  };
  targetUser: {
    name: string;
    email: string;
  };
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  createdAt: string;
  dueDate: string;
  approver: {
    name: string;
    email: string;
  };
  comments: number;
}

export default function PendingWorkflowsPage() {
  const [workflows, setWorkflows] = useState<PendingWorkflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    fetchPendingWorkflows();
  }, []);

  const fetchPendingWorkflows = async () => {
    try {
      // 実際のワークフローシステムは未実装のため、空のデータを設定
      setWorkflows([]);
    } catch (error) {
      console.error('承認待ちワークフローの取得に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (workflowId: string) => {
    try {
      // 承認処理
      console.log(`承認: ${workflowId}`);
      // APIコール
      alert('ワークフローを承認しました');
      await fetchPendingWorkflows();
    } catch (error) {
      console.error('承認処理に失敗しました:', error);
      alert('承認処理に失敗しました');
    }
  };

  const handleReject = async (workflowId: string) => {
    try {
      // 却下処理
      console.log(`却下: ${workflowId}`);
      // APIコール
      alert('ワークフローを却下しました');
      await fetchPendingWorkflows();
    } catch (error) {
      console.error('却下処理に失敗しました:', error);
      alert('却下処理に失敗しました');
    }
  };

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch =
      workflow.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workflow.targetUser.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || workflow.type === typeFilter;
    const matchesPriority =
      priorityFilter === 'all' || workflow.priority === priorityFilter;
    return matchesSearch && matchesType && matchesPriority;
  });

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'user_creation':
        return 'ユーザー作成';
      case 'user_deletion':
        return 'ユーザー削除';
      case 'permission_change':
        return '権限変更';
      case 'saas_access':
        return 'SaaS アクセス';
      default:
        return type;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'user_creation':
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            ユーザー作成
          </Badge>
        );
      case 'user_deletion':
        return (
          <Badge variant="default" className="bg-red-100 text-red-800">
            ユーザー削除
          </Badge>
        );
      case 'permission_change':
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
            権限変更
          </Badge>
        );
      case 'saas_access':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            SaaS アクセス
          </Badge>
        );
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">高</Badge>;
      case 'medium':
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
            中
          </Badge>
        );
      case 'low':
        return <Badge variant="secondary">低</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">承認待ち</Badge>;
      case 'in_review':
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            レビュー中
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            承認済み
          </Badge>
        );
      case 'rejected':
        return <Badge variant="destructive">却下</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">承認待ちワークフロー</h1>
        <p className="mt-2 text-gray-600">承認が必要なワークフローの一覧</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            承認待ち一覧
          </CardTitle>
          <CardDescription>
            承認が必要なワークフローを確認・処理できます
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <Input
                placeholder="ワークフロー検索..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="種類で絞り込み" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全種類</SelectItem>
                <SelectItem value="user_creation">ユーザー作成</SelectItem>
                <SelectItem value="user_deletion">ユーザー削除</SelectItem>
                <SelectItem value="permission_change">権限変更</SelectItem>
                <SelectItem value="saas_access">SaaS アクセス</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="優先度で絞り込み" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全優先度</SelectItem>
                <SelectItem value="high">高</SelectItem>
                <SelectItem value="medium">中</SelectItem>
                <SelectItem value="low">低</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredWorkflows.map(workflow => (
              <div
                key={workflow.id}
                className={`rounded-lg border p-4 ${
                  isOverdue(workflow.dueDate)
                    ? 'border-red-200 bg-red-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      {getTypeBadge(workflow.type)}
                      {getPriorityBadge(workflow.priority)}
                      {getStatusBadge(workflow.status)}
                      {isOverdue(workflow.dueDate) && (
                        <Badge
                          variant="destructive"
                          className="flex items-center gap-1"
                        >
                          <AlertCircle className="h-3 w-3" />
                          期限超過
                        </Badge>
                      )}
                    </div>
                    <h3 className="mb-1 text-lg font-medium">
                      {workflow.title}
                    </h3>
                    <p className="mb-3 text-gray-600">{workflow.description}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                      <div>
                        <span className="font-medium">申請者:</span>
                        <p className="text-gray-600">
                          {workflow.requester.name}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">対象ユーザー:</span>
                        <p className="text-gray-600">
                          {workflow.targetUser.name}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">承認者:</span>
                        <p className="text-gray-600">
                          {workflow.approver.name}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">期限:</span>
                        <p
                          className={`${isOverdue(workflow.dueDate) ? 'text-red-600' : 'text-gray-600'}`}
                        >
                          {new Date(workflow.dueDate).toLocaleDateString(
                            'ja-JP'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      詳細
                    </Button>
                    {workflow.comments > 0 && (
                      <Button variant="outline" size="sm">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        コメント ({workflow.comments})
                      </Button>
                    )}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(workflow.id)}
                        disabled={workflow.status !== 'pending'}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        承認
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleReject(workflow.id)}
                        disabled={workflow.status !== 'pending'}
                      >
                        <X className="mr-2 h-4 w-4" />
                        却下
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredWorkflows.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              <Clock className="mx-auto mb-4 h-12 w-12 text-gray-300" />
              <p>承認待ちのワークフローはありません</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
