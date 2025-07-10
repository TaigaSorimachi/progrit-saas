'use client';

import { LucideIcon } from 'lucide-react';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {Icon && <Icon className="mb-4 h-12 w-12 text-gray-400" />}
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mb-4 text-sm text-gray-600">{description}</p>
      {action && action}
    </div>
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
