'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MoreVertical,
  Settings,
  Trash2,
  RefreshCw,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Calendar,
  Zap,
  Shield,
  Activity,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SaaSConnection } from '@/types';

interface SaaSConnectionCardProps {
  connection: SaaSConnection;
  onConfigure?: (connection: SaaSConnection) => void;
  onDisconnect?: (connection: SaaSConnection) => void;
  onSync?: (connection: SaaSConnection) => void;
  onViewDetails?: (connection: SaaSConnection) => void;
  className?: string;
}

export function SaaSConnectionCard({
  connection,
  onConfigure,
  onDisconnect,
  onSync,
  onViewDetails,
  className = '',
}: SaaSConnectionCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const getProviderIcon = (provider?: SaaSConnection['provider']) => {
    const iconClass = 'h-8 w-8';
    switch (provider) {
      case 'google':
        return (
          <div
            className={`${iconClass} flex items-center justify-center rounded-full bg-red-100 font-bold text-red-600`}
          >
            G
          </div>
        );
      case 'microsoft':
        return (
          <div
            className={`${iconClass} flex items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600`}
          >
            M
          </div>
        );
      case 'slack':
        return (
          <div
            className={`${iconClass} flex items-center justify-center rounded-full bg-purple-100 font-bold text-purple-600`}
          >
            S
          </div>
        );
      case 'github':
        return (
          <div
            className={`${iconClass} flex items-center justify-center rounded-full bg-gray-100 font-bold text-gray-600`}
          >
            GH
          </div>
        );
      case 'zoom':
        return (
          <div
            className={`${iconClass} flex items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600`}
          >
            Z
          </div>
        );
      case 'salesforce':
        return (
          <div
            className={`${iconClass} flex items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600`}
          >
            SF
          </div>
        );
      case 'aws':
        return (
          <div
            className={`${iconClass} flex items-center justify-center rounded-full bg-orange-100 font-bold text-orange-600`}
          >
            AWS
          </div>
        );
      case 'azure':
        return (
          <div
            className={`${iconClass} flex items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600`}
          >
            AZ
          </div>
        );
      default:
        return <Zap className={`${iconClass} text-gray-600`} />;
    }
  };

  const getStatusBadge = (status: SaaSConnection['status']) => {
    switch (status) {
      case 'connected':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            接続済み
          </Badge>
        );
      case 'disconnected':
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            切断
          </Badge>
        );
      case 'error':
        return <Badge variant="destructive">エラー</Badge>;
      case 'syncing':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            同期中
          </Badge>
        );
      default:
        return <Badge variant="secondary">不明</Badge>;
    }
  };

  const getStatusIcon = (status: SaaSConnection['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'disconnected':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'syncing':
        return <RefreshCw className="h-4 w-4 animate-spin text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getApiHealthBadge = (health?: SaaSConnection['apiHealth']) => {
    switch (health) {
      case 'healthy':
        return (
          <Badge
            variant="outline"
            className="border-green-200 bg-green-50 text-green-700"
          >
            正常
          </Badge>
        );
      case 'degraded':
        return (
          <Badge
            variant="outline"
            className="border-yellow-200 bg-yellow-50 text-yellow-700"
          >
            低下
          </Badge>
        );
      case 'down':
        return (
          <Badge
            variant="outline"
            className="border-red-200 bg-red-50 text-red-700"
          >
            停止
          </Badge>
        );
      default:
        return <Badge variant="outline">不明</Badge>;
    }
  };

  const handleSync = async () => {
    if (!onSync) return;

    setIsLoading(true);
    try {
      await onSync(connection);
    } finally {
      setIsLoading(false);
    }
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <Card
      className={`transition-shadow duration-200 hover:shadow-lg ${className}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getProviderIcon(connection.provider)}
            <div>
              <CardTitle className="text-lg">{connection.name}</CardTitle>
              <div className="mt-1 flex items-center space-x-2">
                {getStatusIcon(connection.status)}
                <span className="text-sm text-gray-500">
                  最終同期:{' '}
                  {connection.lastSyncAt
                    ? new Date(connection.lastSyncAt).toLocaleDateString(
                        'ja-JP',
                        {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )
                    : 'なし'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {getStatusBadge(connection.status)}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>操作</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {onViewDetails && (
                  <DropdownMenuItem onClick={() => onViewDetails(connection)}>
                    <Eye className="mr-2 h-4 w-4" />
                    詳細表示
                  </DropdownMenuItem>
                )}

                {onConfigure && (
                  <DropdownMenuItem onClick={() => onConfigure(connection)}>
                    <Settings className="mr-2 h-4 w-4" />
                    設定
                  </DropdownMenuItem>
                )}

                {onSync && (
                  <DropdownMenuItem onClick={handleSync} disabled={isLoading}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    同期
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                {onDisconnect && (
                  <DropdownMenuItem
                    onClick={() => onDisconnect(connection)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    切断
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">ユーザー数</span>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{connection.userCount}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">ライセンス使用率</span>
              <span
                className={`font-medium ${getUsageColor(connection.usagePercentage || 0)}`}
              >
                {connection.usagePercentage || 0}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">月間アクティブ</span>
              <div className="flex items-center space-x-1">
                <Activity className="h-4 w-4 text-gray-500" />
                <span className="font-medium">
                  {connection.monthlyActive || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API健全性</span>
              {getApiHealthBadge(connection.apiHealth)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">設定日</span>
              <span className="text-sm font-medium">
                {connection.setupDate || 'なし'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">機能</span>
              <span className="text-sm font-medium">
                {connection.features?.length || 0}個
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">ライセンス使用状況</span>
            <span className="font-medium">
              {connection.userCount} / {connection.licenseCount || 0}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className={`h-2 rounded-full ${
                (connection.usagePercentage || 0) >= 90
                  ? 'bg-red-500'
                  : (connection.usagePercentage || 0) >= 70
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
              }`}
              style={{ width: `${connection.usagePercentage || 0}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
