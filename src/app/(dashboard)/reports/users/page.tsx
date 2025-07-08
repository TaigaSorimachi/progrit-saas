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
  FileText,
  Download,
  Search,
  Filter,
  Users,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface UserReport {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  status: 'active' | 'inactive' | 'pending';
  hireDate: string;
  lastLogin: string;
  saasAccountCount: number;
  activeWorkflows: number;
  permissionLevel: 'admin' | 'manager' | 'user';
}

interface DepartmentStats {
  department: string;
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  pendingUsers: number;
  avgSaasAccounts: number;
}

export default function UserReportsPage() {
  const [users, setUsers] = useState<UserReport[]>([]);
  const [departmentStats, setDepartmentStats] = useState<DepartmentStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    fetchUserReports();
    fetchDepartmentStats();
  }, []);

  const fetchUserReports = async () => {
    try {
      // 実際のユーザー分析データは未実装のため、空のデータを設定
      setUsers([]);
    } catch (error) {
      console.error('ユーザーレポートの取得に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartmentStats = async () => {
    try {
      // 実際の部署統計データは未実装のため、空のデータを設定
      setDepartmentStats([]);
    } catch (error) {
      console.error('部署統計の取得に失敗しました:', error);
    }
  };

  const handleExportUsers = () => {
    // CSV エクスポート処理
    const csvContent = generateUserCSV();
    downloadCSV(csvContent, 'user_report.csv');
  };

  const handleExportDepartmentStats = () => {
    // CSV エクスポート処理
    const csvContent = generateDepartmentStatsCSV();
    downloadCSV(csvContent, 'department_stats.csv');
  };

  const generateUserCSV = () => {
    const headers = [
      'ID',
      '名前',
      'メール',
      '部署',
      '役職',
      'ステータス',
      '入社日',
      '最終ログイン',
      'SaaSアカウント数',
      'アクティブワークフロー',
      '権限レベル',
    ];
    const rows = filteredUsers.map(user => [
      user.id,
      user.name,
      user.email,
      user.department,
      user.position,
      user.status,
      user.hireDate,
      new Date(user.lastLogin).toLocaleString('ja-JP'),
      user.saasAccountCount,
      user.activeWorkflows,
      user.permissionLevel,
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const generateDepartmentStatsCSV = () => {
    const headers = [
      '部署',
      '総ユーザー数',
      'アクティブユーザー',
      '非アクティブユーザー',
      '保留中ユーザー',
      '平均SaaSアカウント数',
    ];
    const rows = departmentStats.map(stat => [
      stat.department,
      stat.totalUsers,
      stat.activeUsers,
      stat.inactiveUsers,
      stat.pendingUsers,
      stat.avgSaasAccounts,
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      departmentFilter === 'all' || user.department === departmentFilter;
    const matchesStatus =
      statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            アクティブ
          </Badge>
        );
      case 'inactive':
        return <Badge variant="destructive">非アクティブ</Badge>;
      case 'pending':
        return <Badge variant="secondary">保留中</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPermissionBadge = (level: string) => {
    switch (level) {
      case 'admin':
        return (
          <Badge variant="default" className="bg-red-100 text-red-800">
            管理者
          </Badge>
        );
      case 'manager':
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            マネージャー
          </Badge>
        );
      case 'user':
        return <Badge variant="outline">一般ユーザー</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  const getTotalStats = () => {
    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'active').length,
      inactiveUsers: users.filter(u => u.status === 'inactive').length,
      pendingUsers: users.filter(u => u.status === 'pending').length,
      avgSaasAccounts:
        users.reduce((sum, u) => sum + u.saasAccountCount, 0) / users.length,
    };
  };

  const totalStats = getTotalStats();

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
        <h1 className="text-3xl font-bold">ユーザーレポート</h1>
        <p className="mt-2 text-gray-600">
          ユーザー情報とアクティビティの詳細レポート
        </p>
      </div>

      {/* 統計サマリー */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="mr-3 h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">総ユーザー数</p>
                <p className="text-2xl font-bold">{totalStats.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="mr-3 h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">アクティブ</p>
                <p className="text-2xl font-bold">{totalStats.activeUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <XCircle className="mr-3 h-8 w-8 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">非アクティブ</p>
                <p className="text-2xl font-bold">{totalStats.inactiveUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="mr-3 h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">保留中</p>
                <p className="text-2xl font-bold">{totalStats.pendingUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <TrendingUp className="mr-3 h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">平均SaaS数</p>
                <p className="text-2xl font-bold">
                  {totalStats.avgSaasAccounts.toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">ユーザー一覧</TabsTrigger>
          <TabsTrigger value="departments">部署別統計</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                ユーザー詳細レポート
              </CardTitle>
              <CardDescription>
                全ユーザーの詳細情報とアクティビティ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <Input
                    placeholder="ユーザー検索..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <Select
                  value={departmentFilter}
                  onValueChange={setDepartmentFilter}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="部署で絞り込み" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部署</SelectItem>
                    <SelectItem value="営業部">営業部</SelectItem>
                    <SelectItem value="開発部">開発部</SelectItem>
                    <SelectItem value="人事部">人事部</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="ステータスで絞り込み" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全ステータス</SelectItem>
                    <SelectItem value="active">アクティブ</SelectItem>
                    <SelectItem value="inactive">非アクティブ</SelectItem>
                    <SelectItem value="pending">保留中</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleExportUsers}>
                  <Download className="mr-2 h-4 w-4" />
                  CSV エクスポート
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        名前
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        部署
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        役職
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        ステータス
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        権限レベル
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        SaaS数
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        最終ログイン
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {user.department}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {user.position}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {getStatusBadge(user.status)}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {getPermissionBadge(user.permissionLevel)}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {user.saasAccountCount}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {new Date(user.lastLogin).toLocaleString('ja-JP')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                部署別統計
              </CardTitle>
              <CardDescription>
                部署ごとのユーザー統計とSaaS利用状況
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex justify-end">
                <Button onClick={handleExportDepartmentStats}>
                  <Download className="mr-2 h-4 w-4" />
                  CSV エクスポート
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        部署
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        総ユーザー数
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        アクティブ
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        非アクティブ
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        保留中
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        平均SaaS数
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {departmentStats.map(stat => (
                      <tr key={stat.department} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-medium">
                          {stat.department}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {stat.totalUsers}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <span className="text-green-600">
                            {stat.activeUsers}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <span className="text-red-600">
                            {stat.inactiveUsers}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <span className="text-yellow-600">
                            {stat.pendingUsers}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {stat.avgSaasAccounts.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
