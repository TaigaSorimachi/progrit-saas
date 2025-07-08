'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Icons } from '@/components/ui/icons';
import { useToast } from '@/hooks/use-toast';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleEmailRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // パスワード確認
    if (password !== confirmPassword) {
      setError('パスワードが一致しません。');
      setIsLoading(false);
      return;
    }

    // パスワード強度チェック
    if (password.length < 8) {
      setError('パスワードは8文字以上である必要があります。');
      setIsLoading(false);
      return;
    }

    try {
      // ここで実際の登録APIを呼び出す
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        toast({
          title: '登録成功',
          description:
            '確認メールを送信しました。メールを確認してアカウントを有効化してください。',
        });
        router.push('/login');
      } else {
        const data = await response.json();
        setError(data.message || '登録に失敗しました。');
      }
    } catch (error) {
      setError('登録中にエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (
    provider: 'google' | 'microsoft' | 'github'
  ) => {
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl: '/dashboard' });
    } catch (error) {
      toast({
        title: 'ログインエラー',
        description: `${provider}ログインに失敗しました。`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">新規登録</h1>
        <p className="text-muted-foreground">
          アカウントを作成してSaaS管理を開始
        </p>
      </div>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl">アカウント作成</CardTitle>
          <CardDescription>
            メールアドレスまたはSSOでアカウントを作成できます
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* OAuth 登録ボタン */}
          <div className="grid gap-3">
            <Button
              variant="outline"
              onClick={() => handleOAuthLogin('google')}
              disabled={isLoading}
              className="w-full"
            >
              <Icons.google className="mr-2 h-4 w-4" />
              Googleで登録
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOAuthLogin('microsoft')}
              disabled={isLoading}
              className="w-full"
            >
              <Icons.microsoft className="mr-2 h-4 w-4" />
              Microsoftで登録
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOAuthLogin('github')}
              disabled={isLoading}
              className="w-full"
            >
              <Icons.gitHub className="mr-2 h-4 w-4" />
              GitHubで登録
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                または
              </span>
            </div>
          </div>

          {/* メール登録フォーム */}
          <form onSubmit={handleEmailRegister} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                氏名
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="山田太郎"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                メールアドレス
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="user@example.com"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                パスワード
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="パスワードを入力"
                required
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                8文字以上、大文字・小文字・数字・記号を含む
              </p>
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                パスワード確認
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="パスワードを再入力"
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  登録中...
                </>
              ) : (
                'アカウント作成'
              )}
            </Button>
          </form>

          <div className="text-xs text-muted-foreground">
            アカウントを作成することで、
            <Link href="/terms" className="text-primary hover:underline">
              利用規約
            </Link>
            および
            <Link href="/privacy" className="text-primary hover:underline">
              プライバシーポリシー
            </Link>
            に同意したものとみなされます。
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        すでにアカウントをお持ちですか？{' '}
        <Link href="/login" className="text-primary hover:underline">
          ログイン
        </Link>
      </div>
    </div>
  );
}
