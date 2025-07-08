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
  BarChart,
  Download,
  Search,
  TrendingUp,
  DollarSign,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  Building,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SaaSUsageReport {
  provider: string;
  totalAccounts: number;
  activeAccounts: number;
  inactiveAccounts: number;
  lastSyncDate: string;
  monthlyActiveUsers: number;
  departments: {
    name: string;
    accountCount: number;
    activeUsers: number;
  }[];
  costPerMonth?: number;
  licenseType: 'per_user' | 'flat_rate' | 'usage_based';
  connectionStatus: 'connected' | 'error' | 'disconnected';
}

interface CostAnalysis {
  provider: string;
  currentCost: number;
  projectedCost: number;
  utilizationRate: number;
  wastedSeats: number;
  recommendation: string;
}

export default function SaaSReportsPage() {
  const [saasReports, setSaasReports] = useState<SaaSUsageReport[]>([]);
  const [costAnalysis, setCostAnalysis] = useState<CostAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [providerFilter, setProviderFilter] = useState('all');

  useEffect(() => {
    fetchSaaSReports();
    fetchCostAnalysis();
  }, []);

  const fetchSaaSReports = async () => {
    try {
      // 実際のSaaS連携は未実装のため、空のデータを設定
      setSaasReports([]);
    } catch (error) {
      console.error('SaaSレポートの取得に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCostAnalysis = async () => {
    try {
      // 実際のSaaS連携は未実装のため、空のデータを設定
      setCostAnalysis([]);
    } catch (error) {
      console.error('コスト分析の取得に失敗しました:', error);
    }
  };

  const handleExportSaaSReport = () => {
    const csvContent = generateSaaSReportCSV();
    downloadCSV(csvContent, 'saas_usage_report.csv');
  };

  const handleExportCostAnalysis = () => {
    const csvContent = generateCostAnalysisCSV();
    downloadCSV(csvContent, 'saas_cost_analysis.csv');
  };

  const generateSaaSReportCSV = () => {
    const headers = [
      'SaaS名',
      '総アカウント数',
      'アクティブアカウント',
      '非アクティブアカウント',
      '月間アクティブユーザー',
      '月額コスト',
      'ライセンス形態',
      '接続状況',
    ];
    const rows = filteredReports.map(report => [
      report.provider,
      report.totalAccounts,
      report.activeAccounts,
      report.inactiveAccounts,
      report.monthlyActiveUsers,
      report.costPerMonth || 0,
      report.licenseType,
      report.connectionStatus,
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const generateCostAnalysisCSV = () => {
    const headers = [
      'SaaS名',
      '現在のコスト',
      '予測コスト',
      '利用率',
      '無駄なシート数',
      '推奨事項',
    ];
    const rows = costAnalysis.map(analysis => [
      analysis.provider,
      analysis.currentCost,
      analysis.projectedCost,
      analysis.utilizationRate,
      analysis.wastedSeats,
      analysis.recommendation,
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

  const filteredReports = saasReports.filter(report => {
    const matchesSearch = report.provider
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesProvider =
      providerFilter === 'all' || report.provider === providerFilter;
    return matchesSearch && matchesProvider;
  });

  const getConnectionStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            接続済み
          </Badge>
        );
      case 'error':
        return <Badge variant="destructive">エラー</Badge>;
      case 'disconnected':
        return <Badge variant="secondary">未接続</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getLicenseTypeBadge = (type: string) => {
    switch (type) {
      case 'per_user':
        return <Badge variant="outline">ユーザー単価</Badge>;
      case 'flat_rate':
        return <Badge variant="outline">定額</Badge>;
      case 'usage_based':
        return <Badge variant="outline">従量課金</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getTotalStats = () => {
    return {
      totalProviders: saasReports.length,
      totalAccounts: saasReports.reduce((sum, r) => sum + r.totalAccounts, 0),
      totalActiveAccounts: saasReports.reduce(
        (sum, r) => sum + r.activeAccounts,
        0
      ),
      totalMonthlyCost: saasReports.reduce(
        (sum, r) => sum + (r.costPerMonth || 0),
        0
      ),
      avgUtilization:
        costAnalysis.reduce((sum, a) => sum + a.utilizationRate, 0) /
        costAnalysis.length,
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
        <h1 className="text-3xl font-bold">SaaS レポート</h1>
        <p className="mt-2 text-gray-600">SaaS 利用状況とコスト分析</p>
      </div>

      {/* 統計サマリー */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Building className="mr-3 h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">SaaS 数</p>
                <p className="text-2xl font-bold">
                  {totalStats.totalProviders}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="mr-3 h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">総アカウント数</p>
                <p className="text-2xl font-bold">{totalStats.totalAccounts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Activity className="mr-3 h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">アクティブ</p>
                <p className="text-2xl font-bold">
                  {totalStats.totalActiveAccounts}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <DollarSign className="mr-3 h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">月額コスト</p>
                <p className="text-2xl font-bold">
                  ¥{totalStats.totalMonthlyCost.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <TrendingUp className="mr-3 h-8 w-8 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">平均利用率</p>
                <p className="text-2xl font-bold">
                  {totalStats.avgUtilization.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="usage" className="space-y-4">
        <TabsList>
          <TabsTrigger value="usage">利用状況</TabsTrigger>
          <TabsTrigger value="cost">コスト分析</TabsTrigger>
          <TabsTrigger value="departments">部署別利用</TabsTrigger>
        </TabsList>

        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                SaaS 利用状況レポート
              </CardTitle>
              <CardDescription>
                各 SaaS サービスの利用状況と接続ステータス
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <Input
                    placeholder="SaaS検索..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <Button onClick={handleExportSaaSReport}>
                  <Download className="mr-2 h-4 w-4" />
                  CSV エクスポート
                </Button>
              </div>

              <div className="space-y-4">
                {filteredReports.map(report => (
                  <div key={report.provider} className="rounded-lg border p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                          <Building className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium">
                            {report.provider}
                          </h3>
                          <p className="text-sm text-gray-500">
                            最終同期:{' '}
                            {new Date(report.lastSyncDate).toLocaleString(
                              'ja-JP'
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getConnectionStatusBadge(report.connectionStatus)}
                        {getLicenseTypeBadge(report.licenseType)}
                      </div>
                    </div>

                    <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {report.totalAccounts}
                        </p>
                        <p className="text-sm text-gray-600">総アカウント数</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {report.activeAccounts}
                        </p>
                        <p className="text-sm text-gray-600">アクティブ</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">
                          {report.inactiveAccounts}
                        </p>
                        <p className="text-sm text-gray-600">非アクティブ</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">
                          {report.monthlyActiveUsers}
                        </p>
                        <p className="text-sm text-gray-600">月間アクティブ</p>
                      </div>
                    </div>

                    {report.costPerMonth && (
                      <div className="rounded bg-gray-50 p-3">
                        <p className="text-sm text-gray-600">月額コスト</p>
                        <p className="text-xl font-bold">
                          ¥{report.costPerMonth.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cost">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                コスト分析レポート
              </CardTitle>
              <CardDescription>
                SaaS コストの最適化提案と利用効率
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex justify-end">
                <Button onClick={handleExportCostAnalysis}>
                  <Download className="mr-2 h-4 w-4" />
                  CSV エクスポート
                </Button>
              </div>

              <div className="space-y-4">
                {costAnalysis.map(analysis => (
                  <div
                    key={analysis.provider}
                    className="rounded-lg border p-4"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-medium">
                        {analysis.provider}
                      </h3>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">利用率</p>
                        <p
                          className={`text-lg font-bold ${
                            analysis.utilizationRate >= 90
                              ? 'text-green-600'
                              : analysis.utilizationRate >= 80
                                ? 'text-yellow-600'
                                : 'text-red-600'
                          }`}
                        >
                          {analysis.utilizationRate}%
                        </p>
                      </div>
                    </div>

                    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div>
                        <p className="text-sm text-gray-600">現在のコスト</p>
                        <p className="text-xl font-bold">
                          ¥{analysis.currentCost.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">最適化後コスト</p>
                        <p className="text-xl font-bold text-green-600">
                          ¥{analysis.projectedCost.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">節約可能額</p>
                        <p className="text-xl font-bold text-blue-600">
                          ¥
                          {(
                            analysis.currentCost - analysis.projectedCost
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">
                        無駄なシート: {analysis.wastedSeats}席
                      </span>
                    </div>

                    <div className="rounded border border-blue-200 bg-blue-50 p-3">
                      <p className="text-sm text-blue-800">
                        <strong>推奨事項:</strong> {analysis.recommendation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                部署別 SaaS 利用状況
              </CardTitle>
              <CardDescription>
                部署ごとの SaaS 利用状況とアカウント配布
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {saasReports.map(report => (
                  <div key={report.provider} className="rounded-lg border p-4">
                    <h3 className="mb-4 text-lg font-medium">
                      {report.provider}
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      {report.departments.map(dept => (
                        <div key={dept.name} className="rounded bg-gray-50 p-3">
                          <h4 className="font-medium">{dept.name}</h4>
                          <div className="mt-2 space-y-1">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">
                                アカウント数:
                              </span>
                              <span className="text-sm font-medium">
                                {dept.accountCount}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">
                                アクティブユーザー:
                              </span>
                              <span className="text-sm font-medium">
                                {dept.activeUsers}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">
                                利用率:
                              </span>
                              <span className="text-sm font-medium">
                                {(
                                  (dept.activeUsers / dept.accountCount) *
                                  100
                                ).toFixed(1)}
                                %
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
