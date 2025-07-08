'use client';

import { Shield, Heart } from 'lucide-react';

interface FooterProps {
  className?: string;
}

export function Footer({ className = '' }: FooterProps) {
  return (
    <footer className={`border-t border-gray-200 bg-white ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="flex flex-col items-center justify-between sm:flex-row">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">
                SaaS Manager
              </span>
              <span className="text-sm text-gray-500">v1.0.0</span>
            </div>

            <div className="mt-4 flex items-center space-x-4 sm:mt-0">
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <span>Made with</span>
                <Heart className="h-4 w-4 fill-current text-red-500" />
                <span>for enterprise security</span>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col items-center justify-between text-xs text-gray-500 sm:flex-row">
              <div className="flex items-center space-x-4">
                <span>© 2024 SaaS Manager. All rights reserved.</span>
              </div>

              <div className="mt-2 flex items-center space-x-4 sm:mt-0">
                <a href="#" className="transition-colors hover:text-gray-700">
                  プライバシーポリシー
                </a>
                <a href="#" className="transition-colors hover:text-gray-700">
                  利用規約
                </a>
                <a href="#" className="transition-colors hover:text-gray-700">
                  サポート
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
