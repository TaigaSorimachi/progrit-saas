'use client';

import {
  CheckCircle,
  AlertCircle,
  Clock,
  XCircle,
  RefreshCw,
  Zap,
  Shield,
  Activity,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type StatusType =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'pending'
  | 'active'
  | 'inactive'
  | 'syncing'
  | 'connected'
  | 'disconnected'
  | 'healthy'
  | 'degraded'
  | 'down';

interface StatusIndicatorProps {
  status: StatusType;
  text?: string;
  variant?: 'default' | 'compact' | 'icon-only';
  className?: string;
}

export function StatusIndicator({
  status,
  text,
  variant = 'default',
  className = '',
}: StatusIndicatorProps) {
  const getStatusConfig = (status: StatusType) => {
    switch (status) {
      case 'success':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          text: text || '成功',
        };
      case 'warning':
        return {
          icon: AlertCircle,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          text: text || '警告',
        };
      case 'error':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          text: text || 'エラー',
        };
      case 'info':
        return {
          icon: AlertCircle,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          text: text || '情報',
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          text: text || '保留中',
        };
      case 'active':
        return {
          icon: Activity,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          text: text || 'アクティブ',
        };
      case 'inactive':
        return {
          icon: XCircle,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          text: text || '非アクティブ',
        };
      case 'syncing':
        return {
          icon: RefreshCw,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          text: text || '同期中',
          animate: true,
        };
      case 'connected':
        return {
          icon: Zap,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          text: text || '接続済み',
        };
      case 'disconnected':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          text: text || '切断',
        };
      case 'healthy':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          text: text || '正常',
        };
      case 'degraded':
        return {
          icon: AlertCircle,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          text: text || '低下',
        };
      case 'down':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          text: text || '停止',
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          text: text || '不明',
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  if (variant === 'icon-only') {
    return (
      <Icon
        className={cn(
          'h-4 w-4',
          config.color,
          config.animate && 'animate-spin',
          className
        )}
      />
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center space-x-1', className)}>
        <Icon
          className={cn(
            'h-3 w-3',
            config.color,
            config.animate && 'animate-spin'
          )}
        />
        <span className={cn('text-xs font-medium', config.color)}>
          {config.text}
        </span>
      </div>
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        'flex items-center space-x-1 px-2 py-1',
        config.bgColor,
        config.borderColor,
        config.color,
        className
      )}
    >
      <Icon className={cn('h-3 w-3', config.animate && 'animate-spin')} />
      <span className="text-xs font-medium">{config.text}</span>
    </Badge>
  );
}
