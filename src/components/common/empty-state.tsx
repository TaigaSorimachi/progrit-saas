'use client';

import {
  Users,
  Search,
  Plus,
  AlertCircle,
  FileText,
  Zap,
  Settings,
  Database,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export type EmptyStateType =
  | 'no-users'
  | 'no-search-results'
  | 'no-saas'
  | 'no-workflows'
  | 'no-logs'
  | 'no-data'
  | 'error'
  | 'loading';

interface EmptyStateProps {
  type: EmptyStateType;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  type,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  const getEmptyStateConfig = (type: EmptyStateType) => {
    switch (type) {
      case 'no-users':
        return {
          icon: Users,
          title: title || 'ユーザーがいません',
          description:
            description ||
            'まだユーザーが登録されていません。最初のユーザーを追加しましょう。',
          actionLabel: actionLabel || 'ユーザーを追加',
          color: 'text-blue-500',
        };

      case 'no-search-results':
        return {
          icon: Search,
          title: title || '検索結果が見つかりません',
          description: description || '検索条件を変更して再度お試しください。',
          actionLabel: actionLabel || '検索条件をクリア',
          color: 'text-gray-500',
        };

      case 'no-saas':
        return {
          icon: Zap,
          title: title || 'SaaS連携がありません',
          description:
            description ||
            'SaaSサービスと連携してアカウント管理を開始しましょう。',
          actionLabel: actionLabel || 'SaaS連携を追加',
          color: 'text-purple-500',
        };

      case 'no-workflows':
        return {
          icon: FileText,
          title: title || 'ワークフローがありません',
          description: description || '承認待ちのワークフローはありません。',
          actionLabel: actionLabel || 'ワークフローを作成',
          color: 'text-green-500',
        };

      case 'no-logs':
        return {
          icon: Database,
          title: title || 'ログデータがありません',
          description:
            description || '指定された期間のアクティビティログはありません。',
          actionLabel: actionLabel || '期間を変更',
          color: 'text-orange-500',
        };

      case 'error':
        return {
          icon: ShieldAlert,
          title: title || 'エラーが発生しました',
          description:
            description ||
            'データの読み込み中にエラーが発生しました。しばらく後に再度お試しください。',
          actionLabel: actionLabel || '再試行',
          color: 'text-red-500',
        };

      case 'loading':
        return {
          icon: Settings,
          title: title || 'データを読み込み中...',
          description: description || 'しばらくお待ちください。',
          actionLabel: undefined,
          color: 'text-blue-500',
          animate: true,
        };

      case 'no-data':
      default:
        return {
          icon: AlertCircle,
          title: title || 'データがありません',
          description: description || '表示するデータがありません。',
          actionLabel: actionLabel || '更新',
          color: 'text-gray-500',
        };
    }
  };

  const config = getEmptyStateConfig(type);
  const Icon = config.icon;

  return (
    <Card className={`border-dashed ${className}`}>
      <CardContent className="flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className={`mb-4 ${config.color}`}>
          <Icon
            className={`mx-auto h-16 w-16 ${config.animate ? 'animate-spin' : ''}`}
          />
        </div>

        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          {config.title}
        </h3>

        <p className="mb-6 max-w-md text-sm text-gray-600">
          {config.description}
        </p>

        {config.actionLabel && onAction && (
          <Button onClick={onAction} className="min-w-32">
            <Plus className="mr-2 h-4 w-4" />
            {config.actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// 特化型コンポーネント
export function NoUsersState({ onAddUser }: { onAddUser?: () => void }) {
  return <EmptyState type="no-users" onAction={onAddUser} />;
}

export function NoSearchResultsState({
  onClearSearch,
}: {
  onClearSearch?: () => void;
}) {
  return <EmptyState type="no-search-results" onAction={onClearSearch} />;
}

export function NoSaaSState({ onAddSaaS }: { onAddSaaS?: () => void }) {
  return <EmptyState type="no-saas" onAction={onAddSaaS} />;
}

export function NoWorkflowsState({
  onCreateWorkflow,
}: {
  onCreateWorkflow?: () => void;
}) {
  return <EmptyState type="no-workflows" onAction={onCreateWorkflow} />;
}

export function LoadingState() {
  return <EmptyState type="loading" />;
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return <EmptyState type="error" onAction={onRetry} />;
}
