'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  Settings,
  GitBranch,
  BarChart3,
  FileText,
  Shield,
  Workflow,
  Activity,
  ChevronDown,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: NavItem[];
}

const navigationItems: NavItem[] = [
  {
    name: 'ダッシュボード',
    href: '/dashboard',
    icon: Home,
  },
  {
    name: 'ユーザー管理',
    href: '/users',
    icon: Users,
    badge: '12',
    children: [
      { name: 'ユーザー一覧', href: '/users', icon: Users },
      { name: 'ユーザー追加', href: '/users/add', icon: Users },
      { name: 'ユーザー権限', href: '/users/permissions', icon: Shield },
    ],
  },
  {
    name: 'SaaS連携',
    href: '/saas',
    icon: Zap,
    badge: '5',
    children: [
      { name: 'SaaS一覧', href: '/saas', icon: Zap },
      { name: 'Google Workspace', href: '/saas/google', icon: Zap },
      { name: 'Microsoft 365', href: '/saas/microsoft', icon: Zap },
      { name: 'Slack', href: '/saas/slack', icon: Zap },
      { name: 'GitHub', href: '/saas/github', icon: GitBranch },
    ],
  },
  {
    name: 'ワークフロー',
    href: '/workflows',
    icon: Workflow,
    badge: '3',
    children: [
      { name: 'ワークフロー一覧', href: '/workflows', icon: Workflow },
      { name: '承認待ち', href: '/workflows/pending', icon: Workflow },
      { name: 'ワークフロー作成', href: '/workflows/create', icon: Workflow },
    ],
  },
  {
    name: 'レポート・ログ',
    href: '/reports',
    icon: BarChart3,
    children: [
      { name: 'アクティビティログ', href: '/reports/activity', icon: Activity },
      { name: 'ユーザーレポート', href: '/reports/users', icon: FileText },
      { name: 'SaaS使用状況', href: '/reports/saas', icon: BarChart3 },
    ],
  },
  {
    name: 'システム設定',
    href: '/settings',
    icon: Settings,
    children: [
      { name: '全般設定', href: '/settings/general', icon: Settings },
      { name: 'セキュリティ', href: '/settings/security', icon: Shield },
      { name: 'API設定', href: '/settings/api', icon: Settings },
    ],
  },
];

export function Sidebar({
  isOpen = true,
  onClose,
  className = '',
}: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isExpanded = (itemName: string) => expandedItems.includes(itemName);

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const NavItemComponent = ({
    item,
    level = 0,
  }: {
    item: NavItem;
    level?: number;
  }) => {
    const hasChildren = item.children && item.children.length > 0;
    const expanded = isExpanded(item.name);
    const active = isActive(item.href);

    return (
      <div className="space-y-1">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-9 w-full justify-start px-3 text-left font-normal',
              level > 0 && 'pl-6',
              active && 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            )}
            asChild={!hasChildren}
            onClick={hasChildren ? () => toggleExpanded(item.name) : undefined}
          >
            {hasChildren ? (
              <span className="flex w-full items-center justify-between">
                <span className="flex items-center">
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                  {item.badge && (
                    <Badge
                      variant="secondary"
                      className="ml-2 h-5 px-1.5 text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </span>
                {expanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </span>
            ) : (
              <Link href={item.href} className="flex w-full items-center">
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
                {item.badge && (
                  <Badge
                    variant="secondary"
                    className="ml-2 h-5 px-1.5 text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            )}
          </Button>
        </div>

        {hasChildren && expanded && (
          <div className="ml-4 space-y-1">
            {item.children!.map(child => (
              <NavItemComponent
                key={child.name}
                item={child}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={cn(
        'h-full border-r border-gray-200 bg-white shadow-sm transition-all duration-300',
        isOpen ? 'w-64' : 'w-16',
        className
      )}
    >
      <div className="space-y-2 p-4">
        <div className="mb-6 flex items-center justify-between">
          {isOpen && (
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-gray-900">SaaS Manager</span>
            </div>
          )}
        </div>

        <nav className="space-y-1">
          {navigationItems.map(item => (
            <NavItemComponent key={item.name} item={item} />
          ))}
        </nav>
      </div>
    </div>
  );
}
