'use client';

import { Suspense } from 'react';
import { LoginForm } from '@/components/features/auth/login-form';
import { Loader2 } from 'lucide-react';

function LoginFormWrapper() {
  return <LoginForm />;
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        }
      >
        <LoginFormWrapper />
      </Suspense>
    </div>
  );
}
