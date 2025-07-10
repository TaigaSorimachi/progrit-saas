# Vercel デプロイ手順書

## 🚨 修正完了事項

以下の問題を修正しました：

1. ✅ **データベース設定**: SQLite → PostgreSQL に変更
2. ✅ **Next.js設定**: Vercel対応の設定に変更
3. ✅ **認証設定**: 環境変数未設定時のエラー対応
4. ✅ **ビルドスクリプト**: Prisma生成を含む安全なビルド
5. ✅ **エラーハンドリング**: 堅牢な例外処理

## 🔧 デプロイ前の準備

### 1. データベースの準備

**推奨: Vercel Postgres**

```bash
# Vercel CLIをインストール
npm i -g vercel

# Vercelにログイン
vercel login

# Vercel Postgresをセットアップ
vercel postgres create
```

**代替案: Supabase**

1. [Supabase](https://supabase.com) にアカウント作成
2. 新しいプロジェクト作成
3. Settings > Database で接続文字列を取得

### 2. 環境変数の設定

Vercelダッシュボードで以下の環境変数を設定：

```bash
# 必須
DATABASE_URL=postgresql://username:password@host:port/database
NEXTAUTH_SECRET=random-32-character-string
NEXTAUTH_URL=https://your-app.vercel.app

# オプション（Slack連携を使用する場合）
SLACK_CLIENT_ID=your-slack-client-id
SLACK_CLIENT_SECRET=your-slack-client-secret
SLACK_SIGNING_SECRET=your-slack-signing-secret

# オプション（Google認証を使用する場合）
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# オプション（暗号化機能を使用する場合）
ENCRYPTION_KEY=32-character-encryption-key
```

### 3. NEXTAUTH_SECRET の生成

```bash
# ランダム文字列を生成
openssl rand -base64 32
```

## 🚀 デプロイ手順

### 1. GitHubにプッシュ

```bash
git add .
git commit -m "fix: Vercel deployment configuration"
git push origin main
```

### 2. Vercelでプロジェクトをインポート

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. "Import Project" をクリック
3. GitHubリポジトリを選択
4. 環境変数を設定
5. "Deploy" をクリック

### 3. データベースマイグレーション

デプロイ後、一度だけ実行：

```bash
# Vercel CLIを使用
vercel env pull .env.production
npx prisma migrate deploy
```

## 🔍 デプロイ後の確認

### 1. ヘルスチェック

```bash
curl https://your-app.vercel.app/api/health
```

期待される応答：

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected"
}
```

### 2. ログの確認

Vercel Dashboard → Functions → View Logs

## ⚠️ トラブルシューティング

### よくあるエラー

**1. "PrismaClientInitializationError"**

```
解決方法: DATABASE_URL が正しく設定されているか確認
```

**2. "NEXTAUTH_SECRET is not defined"**

```
解決方法: NEXTAUTH_SECRET環境変数を設定
```

**3. "Module not found: Can't resolve '@/lib/prisma'"**

```
解決方法: プロジェクトが正しくビルドされているか確認
```

### デバッグ方法

**1. ローカルでビルドテスト**

```bash
npm run build
```

**2. 環境変数の確認**

```bash
vercel env ls
```

**3. ログの確認**

```bash
vercel logs your-deployment-url
```

## 📝 環境変数チェックリスト

デプロイ前に以下を確認：

- [ ] DATABASE_URL が設定されている
- [ ] NEXTAUTH_SECRET が設定されている
- [ ] NEXTAUTH_URL が設定されている
- [ ] データベースが作成されている
- [ ] 必要に応じてOAuth認証情報が設定されている

## 🔄 継続的デプロイ

設定完了後、`main` ブランチへの push で自動デプロイされます。

## 📞 サポート

問題が発生した場合：

1. Vercel Dashboard のログを確認
2. ローカルでのビルド確認
3. 環境変数の設定確認

---

**注意**: 初回デプロイ時は環境変数の設定不備によりエラーが発生する可能性があります。上記手順に従って環境変数を正しく設定してください。
