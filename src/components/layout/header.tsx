'use client';

import { useState } from 'react';
import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  Menu,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

interface HeaderProps {
  onMenuToggle?: () => void;
  className?: string;
}

export function Header({ onMenuToggle, className = '' }: HeaderProps) {
  const [notificationCount, setNotificationCount] = useState(0);

  // TODO: 実際の認証システム実装時に置き換える
  const currentUser = {
    name: 'システム管理者',
    email: 'admin@company.com',
    role: 'システム管理者',
    avatar: null,
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header
      className={`border-b border-gray-200 bg-white shadow-sm ${className}`}
    >
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">SaaS Manager</h1>
              <p className="text-xs text-gray-500">アカウント一元管理</p>
            </div>
          </div>
        </div>

        {/* Center section - Search */}
        <div className="mx-4 hidden max-w-md flex-1 md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              type="search"
              placeholder="ユーザー、SaaS、ワークフローを検索..."
              className="w-full pl-10 pr-4"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          {/* Search for mobile */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                >
                  {notificationCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Settings */}
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>

          {/* User menu */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-auto bg-transparent p-0 hover:bg-transparent">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser.avatar || ''} alt={currentUser.name} />
                    <AvatarFallback className="bg-blue-600 text-white">
                      {getUserInitials(currentUser.name)}
                    </AvatarFallback>
                  </Avatar>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-64 p-4">
                    <div className="mb-4 flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={currentUser.avatar || ''}
                          alt={currentUser.name}
                        />
                        <AvatarFallback className="bg-blue-600 text-white">
                          {getUserInitials(currentUser.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{currentUser.name}</p>
                        <p className="text-xs text-gray-500">
                          {currentUser.email}
                        </p>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {currentUser.role}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <NavigationMenuLink asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                        >
                          <User className="mr-2 h-4 w-4" />
                          プロフィール
                        </Button>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          設定
                        </Button>
                      </NavigationMenuLink>
                      <hr className="my-2" />
                      <NavigationMenuLink asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          ログアウト
                        </Button>
                      </NavigationMenuLink>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  );
}
