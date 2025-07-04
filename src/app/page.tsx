import Link from 'next/link';
import { ArrowRight, Shield, Users, Zap, BarChart3 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
              SaaS Account Management
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
            >
              機能
            </Link>
            <Link
              href="#security"
              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
            >
              セキュリティ
            </Link>
            <Link
              href="/auth/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              ログイン
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6">
        <div className="text-center py-20">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            SaaSアカウントを
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              一元管理
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto">
            従業員の入社・退社・異動に伴うSaaSアカウントの作成・削除・権限変更を自動化。
            <br />
            企業のセキュリティとコンプライアンスを強化します。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-flex items-center justify-center"
            >
              今すぐ始める
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="#demo"
              className="border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              デモを見る
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              主要機能
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              エンタープライズ企業のニーズに応える包括的な機能
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                ユーザー管理
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                従業員情報の一元管理と自動同期
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                自動プロビジョニング
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                アカウント作成・削除の完全自動化
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                セキュリティ
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                多要素認証と権限ベースアクセス制御
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                監査・レポート
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                包括的なログ管理とコンプライアンス対応
              </p>
            </div>
          </div>
        </section>

        {/* SaaS Integrations */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              対応SaaSサービス
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              主要なSaaSプラットフォームとシームレスに連携
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center">
            {[
              'Google Workspace',
              'Microsoft 365',
              'Slack',
              'Zoom',
              'GitHub',
              'GitLab',
              'Salesforce',
              'AWS IAM',
            ].map(service => (
              <div
                key={service}
                className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 text-center"
              >
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg mx-auto mb-2"></div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {service}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-slate-200 dark:border-slate-700">
          <div className="text-center text-slate-600 dark:text-slate-400">
            <p>&copy; 2024 SaaS Account Management System. All rights reserved.</p>
            <p className="mt-2">
              Built with ❤️ for enterprise teams who value security, efficiency, and scalability.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
} 