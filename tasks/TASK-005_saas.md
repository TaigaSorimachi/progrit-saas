# TASK-005: SaaS 連携管理 UI

## タスク情報

- **タスク ID**: TASK-005
- **タスク名**: SaaS 連携管理 UI
- **カテゴリ**: saas
- **担当エージェント**: Agent-5
- **優先度**: 中
- **状態**: pending
- **作成日**: 2024-12-19
- **予想工数**: 8 時間

## 概要

SaaS アカウント一元管理システムの SaaS 連携管理 UI を実装する。外部 SaaS サービスとの接続設定、権限テンプレート管理、同期状況監視、エラーハンドリングを含む包括的な連携管理画面を構築する。

## 技術要件

- **API 連携**: Axios + SWR
- **フォーム**: React Hook Form + Zod
- **状態管理**: TanStack Query
- **UI**: shadcn/ui コンポーネント
- **認証フロー**: OAuth2.0 ポップアップ

## 作業内容

### 1. SaaS プロバイダー管理

- [ ] 利用可能 SaaS 一覧表示
- [ ] 接続設定画面
- [ ] OAuth2.0 認証フロー
- [ ] API キー設定
- [ ] 接続テスト機能

### 2. 連携状況監視

- [ ] 接続ステータス一覧
- [ ] 同期履歴表示
- [ ] エラーログ表示
- [ ] パフォーマンス指標
- [ ] アラート設定

### 3. 権限テンプレート管理

- [ ] テンプレート一覧・作成・編集
- [ ] SaaS 別権限設定
- [ ] 部署・役職マッピング
- [ ] プレビュー機能
- [ ] 適用状況確認

### 4. プロビジョニング設定

- [ ] 自動プロビジョニング設定
- [ ] トリガー条件設定
- [ ] 実行スケジュール
- [ ] 失敗時リトライ設定
- [ ] 通知設定

### 5. 高度な設定

- [ ] カスタム API エンドポイント
- [ ] フィールドマッピング
- [ ] データ変換ルール
- [ ] 条件分岐設定

## 対象ファイル

```
src/app/(dashboard)/saas/
├── page.tsx
├── providers/
│   └── page.tsx
├── connections/
│   ├── page.tsx
│   └── [id]/
│       └── page.tsx
├── templates/
│   ├── page.tsx
│   ├── new/
│   │   └── page.tsx
│   └── [id]/
│       └── page.tsx
└── provisioning/
    └── page.tsx

src/components/features/saas/
├── provider-card.tsx
├── provider-list.tsx
├── connection-form.tsx
├── connection-status.tsx
├── oauth-flow.tsx
├── sync-history.tsx
├── template-form.tsx
├── template-list.tsx
├── permission-matrix.tsx
├── provisioning-settings.tsx
├── mapping-editor.tsx
├── api-test.tsx
└── error-panel.tsx

src/hooks/
├── use-saas-providers.ts
├── use-connections.ts
├── use-templates.ts
├── use-oauth-flow.ts
└── use-sync-status.ts
```

## 受け入れ基準

### 必須要件 (Must Have)

- [ ] SaaS プロバイダーとの接続設定ができる
- [ ] OAuth2.0 認証フローが動作する
- [ ] 接続状況が正常に表示される
- [ ] 権限テンプレートが作成・編集できる
- [ ] 同期処理が正常に動作する

### 推奨要件 (Should Have)

- [ ] エラーハンドリングが適切に実装されている
- [ ] 監視・アラート機能が動作する
- [ ] プロビジョニング設定が可能
- [ ] ユーザビリティが高い

### 望ましい要件 (Could Have)

- [ ] 高度なカスタマイズ機能
- [ ] パフォーマンス最適化
- [ ] リアルタイム監視
- [ ] 詳細な分析機能

## 画面設計

### SaaS プロバイダー一覧

```
┌─────────────────────────────────────────────────────────────────────┐
│ SaaS 連携管理                                   [ 新規接続 ] [ 設定 ] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ 接続済み SaaS サービス (3/12)                                        │
│                                                                     │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐       │
│ │  📊 Google      │ │  📧 Microsoft   │ │  💬 Slack       │       │
│ │  Workspace      │ │  365            │ │                 │       │
│ │                 │ │                 │ │                 │       │
│ │ 🟢 接続中        │ │ 🟢 接続中        │ │ 🟡 同期中        │       │
│ │ 最終同期: 5分前   │ │ 最終同期: 10分前  │ │ 最終同期: 1時間前 │       │
│ │ ユーザー: 234    │ │ ユーザー: 234    │ │ ユーザー: 189    │       │
│ │                 │ │                 │ │                 │       │
│ │ [ 設定 ] [ 同期 ] │ │ [ 設定 ] [ 同期 ] │ │ [ 設定 ] [ 同期 ] │       │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘       │
│                                                                     │
│ 利用可能な SaaS サービス                                             │
│                                                                     │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐       │
│ │  🐙 GitHub      │ │  📊 Salesforce  │ │  💰 freee       │       │
│ │                 │ │                 │ │                 │       │
│ │ 未接続          │ │ 未接続          │ │ 未接続          │       │
│ │                 │ │                 │ │                 │       │
│ │ [ 接続設定 ]     │ │ [ 接続設定 ]     │ │ [ 接続設定 ]     │       │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 権限テンプレート管理

```
┌─────────────────────────────────────────────────────────────────────┐
│ 権限テンプレート管理                              [ 新規作成 ]        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ 営業部_基本権限                                 [ 編集 ] [ 削除 ]  │ │
│ │ 営業部の一般社員向け基本権限テンプレート                          │ │
│ │                                                                 │ │
│ │ 📊 Google Workspace: Editor                                     │ │
│ │ 💬 Slack: Standard Member                                       │ │
│ │ 📧 Microsoft 365: Basic User                                    │ │
│ │                                                                 │ │
│ │ 適用中: 45名                                                     │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ 技術部_開発者権限                               [ 編集 ] [ 削除 ]  │ │
│ │ 技術部開発者向け権限テンプレート                                  │ │
│ │                                                                 │ │
│ │ 🐙 GitHub: Developer                                            │ │
│ │ 📊 Google Workspace: Editor                                     │ │
│ │ 💬 Slack: Admin                                                 │ │
│ │                                                                 │ │
│ │ 適用中: 12名                                                     │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## データ仕様

### SaaS プロバイダー

```typescript
interface SaaSProvider {
  id: string;
  name: string;
  displayName: string;
  type: "collaboration" | "development" | "business" | "hr";
  authType: "oauth2" | "api_key" | "basic";
  capabilities: string[];
  isConnected: boolean;
  connectionStatus: "healthy" | "warning" | "error" | "disconnected";
  lastSync?: Date;
  userCount?: number;
  config: Record<string, any>;
}
```

### 権限テンプレート

```typescript
interface PermissionTemplate {
  id: string;
  name: string;
  description: string;
  departmentId?: string;
  positionPattern?: string;
  permissions: {
    providerId: string;
    providerName: string;
    role: string;
    permissions: string[];
  }[];
  isActive: boolean;
  appliedUserCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## API 連携仕様

### OAuth2.0 フロー

1. 認証 URL 生成
2. ポップアップで認証画面表示
3. 認証コード取得
4. アクセストークン交換
5. 接続状態保存

### 同期処理

- 定期同期: cron ジョブ
- 手動同期: リアルタイム
- 差分同期: 効率化
- エラーリトライ: 指数バックオフ

## 依存関係

- **前提条件**: TASK-001 (基本プロジェクト構造), TASK-008 (共通コンポーネント), TASK-002 (認証システム)
- **ブロッカー**: なし
- **次のタスク**: TASK-006, TASK-007

## 参考資料

- [OAuth2.0 RFC](https://tools.ietf.org/html/rfc6749)
- [Google Workspace Admin SDK](https://developers.google.com/admin-sdk)
- [Microsoft Graph API](https://docs.microsoft.com/en-us/graph/)
- [Slack Web API](https://api.slack.com/web)
- docs/DSG-001\_基本設計書.md
- docs/REQ-001\_要求仕様書.md

## 実装ログ

### 2024-12-19

- タスク作成完了
- 要件定義完了
- 画面設計完了

## 完了条件

1. SaaS プロバイダー接続設定が正常に動作する
2. OAuth2.0 認証フローが実装されている
3. 権限テンプレート管理機能が動作する
4. 同期処理とエラーハンドリングが実装されている
5. 監視・アラート機能が動作する
