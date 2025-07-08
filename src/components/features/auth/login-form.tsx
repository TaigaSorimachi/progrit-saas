'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { GoogleIcon, MicrosoftIcon, GitHubIcon } from '@/components/ui/icons';
import {
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Shield,
  Mail,
  Lock,
} from 'lucide-react';

// バリデーションスキーマ
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'メールアドレスを入力してください')
    .email('有効なメールアドレスを入力してください')
    .max(255, 'メールアドレスが長すぎます'),
  password: z
    .string()
    .min(1, 'パスワードを入力してください')
    .min(8, 'パスワードは8文字以上である必要があります')
    .max(128, 'パスワードが長すぎます'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  className?: string;
  redirectTo?: string;
}

export function LoginForm({ className = '', redirectTo }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // URLパラメータからエラー情報を取得
  const error = searchParams.get('error');
  const callbackUrl =
    searchParams.get('callbackUrl') || redirectTo || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // エラーメッセージのマッピング
  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'CredentialsSignin':
        return 'メールアドレスまたはパスワードが正しくありません';
      case 'OAuthSignin':
        return 'OAuth認証でエラーが発生しました';
      case 'OAuthCallback':
        return 'OAuth認証でエラーが発生しました';
      case 'OAuthCreateAccount':
        return 'アカウントの作成に失敗しました';
      case 'EmailCreateAccount':
        return 'アカウントの作成に失敗しました';
      case 'Callback':
        return '認証処理でエラーが発生しました';
      case 'OAuthAccountNotLinked':
        return 'このメールアドレスは既に別の方法で登録されています';
      case 'EmailSignin':
        return 'メール認証でエラーが発生しました';
      case 'SessionRequired':
        return 'ログインが必要です';
      default:
        return error ? '認証でエラーが発生しました' : null;
    }
  };

  // メール/パスワードログイン
  const onSubmit = async (data: LoginFormValues) => {
    startTransition(async () => {
      try {
        clearErrors();

        const result = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (result?.error) {
          setError('root', {
            type: 'manual',
            message: getErrorMessage(result.error) || '認証に失敗しました',
          });

          toast({
            title: 'ログインエラー',
            description: getErrorMessage(result.error) || '認証に失敗しました',
            variant: 'destructive',
          });
          return;
        }

        if (result?.ok) {
          toast({
            title: 'ログイン成功',
            description: 'ダッシュボードにリダイレクトします',
          });

          // 成功時のリダイレクト
          router.push(callbackUrl);
          router.refresh();
        }
      } catch (error) {
        console.error('Login error:', error);
        setError('root', {
          type: 'manual',
          message: 'ネットワークエラーが発生しました',
        });

        toast({
          title: 'ネットワークエラー',
          description: '接続に問題があります。しばらく後に再試行してください。',
          variant: 'destructive',
        });
      }
    });
  };

  // OAuthログイン
  const handleOAuthSignIn = async (
    provider: 'google' | 'microsoft' | 'github'
  ) => {
    try {
      setOauthLoading(provider);

      await signIn(provider, {
        callbackUrl,
        redirect: true,
      });
    } catch (error) {
      console.error(`${provider} OAuth error:`, error);

      toast({
        title: 'OAuth認証エラー',
        description: `${provider}での認証に失敗しました`,
        variant: 'destructive',
      });

      setOauthLoading(null);
    }
  };

  const isLoading = isPending || isSubmitting;

  return (
    <Card className={`mx-auto w-full max-w-md ${className}`}>
      <CardHeader className="space-y-2 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <Shield className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle className="text-2xl font-bold">ログイン</CardTitle>
        <p className="text-sm text-gray-600">
          アカウントにサインインしてください
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* エラー表示 */}
        {(error || errors.root) && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3">
            <div className="flex items-center">
              <AlertCircle className="mr-2 h-4 w-4 flex-shrink-0 text-red-500" />
              <p className="text-sm font-medium text-red-700">
                {getErrorMessage(error) || errors.root?.message}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* メールアドレス */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="flex items-center text-sm font-medium text-gray-700"
            >
              <Mail className="mr-1 h-4 w-4" />
              メールアドレス
            </label>
            <Input
              id="email"
              type="email"
              placeholder="your@example.com"
              autoComplete="email"
              disabled={isLoading}
              {...register('email')}
              className={
                errors.email ? 'border-red-500 focus:border-red-500' : ''
              }
            />
            {errors.email && (
              <p className="flex items-center text-sm text-red-600">
                <AlertCircle className="mr-1 h-3 w-3" />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* パスワード */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="flex items-center text-sm font-medium text-gray-700"
            >
              <Lock className="mr-1 h-4 w-4" />
              パスワード
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="パスワードを入力"
                autoComplete="current-password"
                disabled={isLoading}
                {...register('password')}
                className={`pr-10 ${
                  errors.password ? 'border-red-500 focus:border-red-500' : ''
                }`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                aria-label={
                  showPassword ? 'パスワードを隠す' : 'パスワードを表示'
                }
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="flex items-center text-sm text-red-600">
                <AlertCircle className="mr-1 h-3 w-3" />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* ログインボタン */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ログイン中...
              </>
            ) : (
              'ログイン'
            )}
          </Button>
        </form>

        {/* 区切り線 */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">または</span>
          </div>
        </div>

        {/* OAuth ボタン */}
        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => handleOAuthSignIn('google')}
            disabled={isLoading || oauthLoading === 'google'}
            size="lg"
          >
            {oauthLoading === 'google' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <GoogleIcon className="mr-2 h-4 w-4" />
            )}
            Googleでログイン
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => handleOAuthSignIn('microsoft')}
            disabled={isLoading || oauthLoading === 'microsoft'}
            size="lg"
          >
            {oauthLoading === 'microsoft' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <MicrosoftIcon className="mr-2 h-4 w-4" />
            )}
            Microsoftでログイン
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => handleOAuthSignIn('github')}
            disabled={isLoading || oauthLoading === 'github'}
            size="lg"
          >
            {oauthLoading === 'github' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <GitHubIcon className="mr-2 h-4 w-4" />
            )}
            GitHubでログイン
          </Button>
        </div>

        {/* パスワードを忘れた場合 */}
        <div className="text-center">
          <Button
            type="button"
            variant="link"
            className="text-sm text-blue-600 hover:text-blue-500"
            onClick={() => router.push('/forgot-password')}
            disabled={isLoading}
          >
            パスワードを忘れた場合
          </Button>
        </div>

        {/* 新規登録リンク */}
        <div className="border-t border-gray-200 pt-4 text-center">
          <p className="text-sm text-gray-600">
            アカウントをお持ちでない場合{' '}
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 font-medium text-blue-600 hover:text-blue-500"
              onClick={() => router.push('/register')}
              disabled={isLoading}
            >
              新規登録
            </Button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
