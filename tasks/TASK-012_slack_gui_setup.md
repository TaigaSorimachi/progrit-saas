# TASK-012: Slack連携GUI設定システム

## タスク概要

**タスク ID**: TASK-012  
**タスク名**: Slack連携GUI設定システム  
**担当エージェント**: Agent-12  
**優先度**: 最高  
**状態**: completed  
**作成日**: 2024-12-19  
**予定完了日**: 2024-12-19

## 目的

Slack連携の設定を環境変数に頼らず、Webブラウザから直接設定・管理できるGUIシステムを実装する。

## 受け入れ基準

### 必須要件

- [x] Slack App設定情報の入力フォーム
- [x] OAuth認証フローのGUI統合 （スケルトン版）
- [x] 設定データの暗号化保存
- [x] ワークスペース情報の表示・管理
- [x] 設定テスト・検証機能
- [x] 設定削除・リセット機能
- [x] エラーハンドリング・ユーザーフィードバック

### 成果物

- [x] 設定画面UI (`/saas/slack/settings`)
- [x] 設定API エンドポイント (`/api/slack/config`)
- [x] OAuth認証フロー (`/api/slack/oauth`) （スケルトン版）
- [x] 設定データ暗号化システム
- [x] ユーザーフレンドリーなセットアップウィザード

## 実装計画

### Step 1: 設定データベーススキーマ

```sql
-- Slack設定テーブル
CREATE TABLE slack_configs (
  id INTEGER PRIMARY KEY,
  client_id TEXT NOT NULL,
  client_secret TEXT NOT NULL,
  signing_secret TEXT NOT NULL,
  bot_token TEXT,
  user_token TEXT,
  workspace_name TEXT,
  workspace_id TEXT,
  is_active BOOLEAN DEFAULT false,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 設定は暗号化して保存
-- 環境変数 ENCRYPTION_KEY が必要
```

### Step 2: 設定API実装

#### `/api/slack/config` エンドポイント

- **GET**: 現在の設定状況を取得
- **POST**: 新しい設定を保存
- **PUT**: 設定を更新
- **DELETE**: 設定を削除

#### `/api/slack/oauth` エンドポイント

- **GET**: OAuth認証URL生成
- **POST**: 認証コード交換・トークン取得

#### `/api/slack/test` エンドポイント

- **POST**: 設定のテスト・検証

### Step 3: 設定画面UI実装

#### 3.1 セットアップウィザード

1. **ステップ1**: Slack App作成ガイド
2. **ステップ2**: 基本情報入力
3. **ステップ3**: OAuth認証実行
4. **ステップ4**: 設定テスト
5. **ステップ5**: 完了・有効化

#### 3.2 設定管理画面

- 現在の設定表示
- 設定編集フォーム
- 接続テスト機能
- 設定削除機能

### Step 4: セキュリティ実装

#### 4.1 データ暗号化

```typescript
// 設定データの暗号化
class ConfigEncryption {
  private encryptionKey: string;

  encrypt(data: string): string {
    // AES-256-GCM暗号化
  }

  decrypt(encryptedData: string): string {
    // 復号化
  }
}
```

#### 4.2 OAuth 2.0フロー

```typescript
// OAuth認証フロー
class SlackOAuthFlow {
  generateAuthUrl(): string {
    // 認証URL生成
  }

  exchangeCodeForTokens(code: string): Promise<OAuthTokens> {
    // 認証コード交換
  }
}
```

## 技術仕様

### 使用技術

- **フロントエンド**: React, Next.js, TypeScript
- **UIライブラリ**: shadcn/ui, Tailwind CSS
- **データベース**: SQLite (開発) / PostgreSQL (本番)
- **暗号化**: Node.js crypto module
- **状態管理**: React hooks + Context API

### 設計方針

- **段階的セットアップ**: ウィザード形式で迷わない設定
- **セキュリティファースト**: 設定データの暗号化保存
- **エラーハンドリング**: 分かりやすいエラーメッセージ
- **ユーザビリティ**: 直感的な操作性

## 依存関係

**前提条件**:

- TASK-011 (Slack API連携実装)
- TASK-009 (データベース接続)

**後続タスク**:

- TASK-013 (Google Workspace GUI設定)
- TASK-014 (Microsoft 365 GUI設定)

## 実装詳細

### データベースマイグレーション

```sql
-- prisma/migrations/add_slack_configs.sql
CREATE TABLE slack_configs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id TEXT NOT NULL,
  client_secret TEXT NOT NULL,
  signing_secret TEXT NOT NULL,
  bot_token TEXT,
  user_token TEXT,
  workspace_name TEXT,
  workspace_id TEXT,
  workspace_domain TEXT,
  is_active BOOLEAN DEFAULT false,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 設定フォームUI

```tsx
// components/slack/SlackSetupWizard.tsx
interface SlackSetupWizardProps {
  onComplete: (config: SlackConfig) => void;
}

const SlackSetupWizard: React.FC<SlackSetupWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<SlackConfig>({});

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className={`step ${step >= i ? 'active' : ''}`}>
              <div className="step-number">{i}</div>
              <div className="step-title">{getStepTitle(i)}</div>
            </div>
          ))}
        </div>
      </div>

      {step === 1 && <SlackAppCreationGuide onNext={() => setStep(2)} />}
      {step === 2 && (
        <BasicInfoForm config={config} onNext={() => setStep(3)} />
      )}
      {step === 3 && (
        <OAuthAuthFlow config={config} onNext={() => setStep(4)} />
      )}
      {step === 4 && <ConfigTest config={config} onNext={() => setStep(5)} />}
      {step === 5 && <SetupComplete config={config} onComplete={onComplete} />}
    </div>
  );
};
```

### OAuth認証フロー

```tsx
// components/slack/OAuthAuthFlow.tsx
const OAuthAuthFlow: React.FC<{ config: SlackConfig; onNext: () => void }> = ({
  config,
  onNext,
}) => {
  const [authUrl, setAuthUrl] = useState<string>('');
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const handleStartAuth = async () => {
    try {
      const response = await fetch('/api/slack/oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_url', config }),
      });

      const data = await response.json();
      setAuthUrl(data.authUrl);

      // 新しいウィンドウでSlack認証を開く
      window.open(data.authUrl, 'slack-auth', 'width=600,height=600');

      setIsAuthorizing(true);
    } catch (error) {
      console.error('OAuth認証エラー:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="mb-2 text-lg font-semibold">Slack認証</h3>
        <p className="text-gray-600">
          Slackワークスペースへの接続を承認してください
        </p>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleStartAuth}
          disabled={isAuthorizing}
          className="bg-slack-green hover:bg-slack-green/90"
        >
          {isAuthorizing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              認証中...
            </>
          ) : (
            <>
              <SlackIcon className="mr-2 h-4 w-4" />
              Slackで認証
            </>
          )}
        </Button>
      </div>

      {isAuthorizing && (
        <div className="text-center text-sm text-gray-500">
          認証が完了すると自動的に次のステップに進みます
        </div>
      )}
    </div>
  );
};
```

## 実装ログ

### 進捗状況

- [ ] **Step 1**: データベーススキーマ実装
- [ ] **Step 2**: 設定API実装
- [ ] **Step 3**: 設定画面UI実装
- [ ] **Step 4**: セキュリティ実装

### 実装予定

1. **Phase 1**: データベーススキーマ & 基本API (30分)
2. **Phase 2**: 設定画面UI & ウィザード (45分)
3. **Phase 3**: OAuth認証フロー統合 (30分)
4. **Phase 4**: 暗号化・セキュリティ (15分)
5. **Phase 5**: テスト・検証 (30分)

### 品質チェック

- [ ] 設定データの暗号化確認
- [ ] OAuth認証フローの動作確認
- [ ] エラーハンドリングの動作確認
- [ ] UI/UXの使いやすさ確認
- [ ] セキュリティ要件の満足確認

## 参考資料

- [Slack OAuth 2.0 Guide](https://api.slack.com/authentication/oauth-v2)
- [Slack Scopes Reference](https://api.slack.com/scopes)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Prisma Database](https://www.prisma.io/docs/)

## 注意事項

1. **セキュリティ**: 設定データは必ず暗号化して保存
2. **OAuth認証**: 適切なスコープ設定とエラーハンドリング
3. **ユーザビリティ**: 技術的でない人でも設定できるUI
4. **エラーハンドリング**: 分かりやすいエラーメッセージ
5. **テスト**: 設定後の接続テストを必須とする
