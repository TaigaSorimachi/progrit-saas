'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Shield,
  Users,
  Calendar,
  Mail,
  Building,
  UserCheck,
  UserX,
} from 'lucide-react';
import { User } from '@/types';

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onView?: (user: User) => void;
  onStatusChange?: (userId: string, status: User['status']) => void;
  className?: string;
}

export function UserCard({
  user,
  onEdit,
  onDelete,
  onView,
  onStatusChange,
  className = '',
}: UserCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const getStatusBadge = (status: User['status']) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            アクティブ
          </Badge>
        );
      case 'inactive':
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            非アクティブ
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            保留中
          </Badge>
        );
      default:
        return <Badge variant="secondary">不明</Badge>;
    }
  };

  const getRoleBadge = (role?: User['role']) => {
    switch (role) {
      case 'admin':
        return <Badge variant="destructive">管理者</Badge>;
      case 'manager':
        return <Badge variant="default">マネージャー</Badge>;
      case 'user':
        return <Badge variant="secondary">ユーザー</Badge>;
      default:
        return <Badge variant="secondary">不明</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <Card
      className={`transition-shadow duration-200 hover:shadow-lg ${className}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-blue-100 font-medium text-blue-600">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {getStatusBadge(user.status)}
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Building className="mr-2 h-4 w-4" />
              <span>{user.department}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Shield className="mr-2 h-4 w-4" />
              <span>{user.position}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="mr-2 h-4 w-4" />
              <span>入社: {user.hireDate}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">権限</span>
              {getRoleBadge(user.role)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">SaaS連携</span>
              <Badge variant="outline">{user.saasConnections || 0}個</Badge>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Users className="mr-2 h-4 w-4" />
              <span>最終ログイン: {user.lastActive || 'なし'}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
