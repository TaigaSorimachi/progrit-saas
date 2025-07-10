# Slack 連携設定ガイド

## 概要

このガイドでは、SaaS Account Management System で Slack 連携を設定する方法を説明します。

## 前提条件

- Slack ワークスペースの管理者権限
- Slack App 作成権限

## 設定手順

### 1. Slack App の作成

1. [Slack API](https://api.slack.com/apps) にアクセス
2. 「Create New App」をクリック
3. 「From scratch」を選択
4. アプリ名と対象ワークスペースを設定
5. 「Create App」をクリック

### 2. App の設定

#### OAuth & Permissions の設定

1. 左メニューから「OAuth & Permissions」を選択
2. Scopes セクションで以下の権限を追加：

**Bot Token Scopes:**

- `admin`
- `users:read`
- `users:write`
- `channels:read`
- `channels:write`
- `im:read`
- `im:write`
- `team:read`

**User Token Scopes:**

- `admin.users:read`
- `admin.users:write`

3. Redirect URLs に以下を追加：
   ```
   http://localhost:3000/api/slack/callback
   ```

#### Basic Information の設定

1. 左メニューから「Basic Information」を選択
2. 以下の情報を控える：
   - Client ID
   - Client Secret
   - Signing Secret

### 3. 環境変数の設定

プロジェクトルートの `.env` ファイルに以下を追加：

```bash
# Slack Integration
SLACK_CLIENT_ID="your-slack-client-id"
SLACK_CLIENT_SECRET="your-slack-client-secret"
SLACK_SIGNING_SECRET="your-slack-signing-secret"
SLACK_BOT_TOKEN="xoxb-your-bot-token"
SLACK_USER_TOKEN="xoxp-your-user-token"
SLACK_REDIRECT_URI="http://localhost:3000/api/slack/callback"
```

### 4. Bot Token の取得

1. 「OAuth & Permissions」ページで「Install to Workspace」をクリック
2. 権限を確認し、「Allow」をクリック
3. Bot User OAuth Token (`xoxb-...`) をコピー
4. User OAuth Token (`xoxp-...`) をコピー

### 5. 動作確認

1. アプリケーションを再起動
2. `/saas/slack` ページにアクセス
3. ワークスペース情報が表示されることを確認

## 利用可能な機能

### ユーザー管理

- ユーザー一覧の取得
- ユーザー招待
- ユーザー無効化

### チャンネル管理

- チャンネル一覧の取得
- チャンネル作成
- ユーザーのチャンネル追加

### ワークスペース情報

- ワークスペース情報の取得
- 同期機能

## トラブルシューティング

### 接続エラー

**エラー**: `SLACK_NOT_CONFIGURED`
**解決**: 環境変数が正しく設定されているか確認してください。

**エラー**: `invalid_auth`
**解決**: Bot Token が正しく設定されているか確認してください。

### 権限エラー

**エラー**: `missing_scope`
**解決**: 必要な権限（Scopes）が設定されているか確認してください。

**エラー**: `not_authed`
**解決**: Slack App がワークスペースにインストールされているか確認してください。

### API制限

Slack API には以下の制限があります：

- レート制限: Tier 1 メソッドは 1分間に 50回
- 招待制限: 1分間に 100回

## セキュリティ考慮事項

1. **トークンの管理**
   - Bot Token は安全に保管してください
   - 定期的にトークンをローテーションしてください

2. **権限の最小化**
   - 必要最小限の権限のみを付与してください
   - 管理者権限は慎重に使用してください

3. **監査ログ**
   - すべての操作は監査ログに記録されます
   - 定期的にログを確認してください

## API リファレンス

### エンドポイント

- `GET /api/slack` - ワークスペース情報取得
- `POST /api/slack` - 同期実行
- `GET /api/slack/users` - ユーザー一覧取得
- `POST /api/slack/users` - ユーザー操作
- `GET /api/slack/channels` - チャンネル一覧取得
- `POST /api/slack/channels` - チャンネル操作

### 使用例

```javascript
// ユーザー招待
const response = await fetch('/api/slack/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'invite',
    email: 'user@example.com',
    channels: ['general'],
  }),
});

// チャンネル作成
const response = await fetch('/api/slack/channels', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'create',
    name: 'new-channel',
    isPrivate: false,
  }),
});
```

## 参考リンク

- [Slack API Documentation](https://api.slack.com/web)
- [OAuth 2.0 Flow](https://api.slack.com/authentication/oauth-v2)
- [Bot Token Types](https://api.slack.com/authentication/token-types)
