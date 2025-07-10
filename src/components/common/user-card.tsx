'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Building, Calendar } from 'lucide-react';

export interface UserCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    department?: string;
    position?: string;
    hireDate?: string;
    status?: string;
  };
  onUpdate?: () => void;
}

export function UserCard({ user, onUpdate }: UserCardProps) {
  const handleEdit = () => {
    // 編集機能の実装
    console.log('Edit user:', user.id);
    if (onUpdate) onUpdate();
  };

  const handleDelete = () => {
    // 削除機能の実装
    console.log('Delete user:', user.id);
    if (onUpdate) onUpdate();
  };

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5" />
            {user.name}
          </CardTitle>
          <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
            {user.status === 'active' ? 'アクティブ' : '非アクティブ'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="h-4 w-4" />
            {user.email}
          </div>
          {user.department && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building className="h-4 w-4" />
              {user.department} - {user.position}
            </div>
          )}
          {user.hireDate && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              入社日: {new Date(user.hireDate).toLocaleDateString('ja-JP')}
            </div>
          )}
        </div>
        <div className="mt-4 flex gap-2">
          <Button size="sm" variant="outline" onClick={handleEdit}>
            編集
          </Button>
          <Button size="sm" variant="outline" onClick={handleDelete}>
            削除
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
