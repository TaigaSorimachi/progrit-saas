# TASK-003: ダッシュボード UI

## タスク情報

- **タスク ID**: TASK-003
- **タスク名**: ダッシュボード UI
- **カテゴリ**: dashboard
- **担当エージェント**: Agent-3
- **優先度**: 高
- **状態**: pending
- **作成日**: 2024-12-19
- **予想工数**: 8 時間

## 概要

SaaS アカウント一元管理システムのダッシュボード UI を実装する。リアルタイムデータ表示、統計情報、アラート機能を含む直感的で情報豊富なダッシュボードを構築する。

## 技術要件

- **チャート**: Recharts
- **リアルタイム**: WebSocket / Server-Sent Events
- **状態管理**: TanStack Query + Zustand
- **UI**: shadcn/ui + カスタムコンポーネント
- **アニメーション**: Framer Motion

## 作業内容

### 1. メインダッシュボード

- [ ] 概要統計カード (アクティブユーザー、接続 SaaS 数等)
- [ ] アクティビティフィード (最近の操作)
- [ ] ステータス監視パネル
- [ ] クイックアクションボタン
- [ ] お知らせ・アラート表示

### 2. 統計・分析セクション

- [ ] ユーザー登録推移グラフ
- [ ] SaaS 利用状況円グラフ
- [ ] プロビジョニング成功率
- [ ] 部署別利用統計
- [ ] 時系列分析

### 3. 監視・アラート

- [ ] システムヘルスチェック
- [ ] SaaS 接続状況
- [ ] エラー率監視
- [ ] パフォーマンス指標
- [ ] アラート通知

### 4. ユーザーアクション

- [ ] 最近のログイン
- [ ] 承認待ちワークフロー
- [ ] 注意が必要なアカウント
- [ ] システム使用量

### 5. カスタマイズ機能

- [ ] ウィジェット配置変更
- [ ] 表示期間選択
- [ ] フィルター機能
- [ ] エクスポート機能

## 対象ファイル

```
src/app/(dashboard)/
├── dashboard/
│   └── page.tsx
├── layout.tsx
└── loading.tsx

src/components/features/dashboard/
├── stats-cards.tsx
├── activity-feed.tsx
├── status-monitor.tsx
├── user-growth-chart.tsx
├── saas-usage-chart.tsx
├── provisioning-stats.tsx
├── department-stats.tsx
├── quick-actions.tsx
├── alerts-panel.tsx
├── health-check.tsx
├── connection-status.tsx
├── recent-logins.tsx
├── pending-workflows.tsx
├── attention-accounts.tsx
└── dashboard-layout.tsx

src/hooks/
├── use-dashboard-data.ts
├── use-real-time.ts
├── use-stats.ts
└── use-alerts.ts
```

## 受け入れ基準

### 必須要件 (Must Have)

- [ ] ダッシュボードが正常に表示される
- [ ] 統計データが正確に表示される
- [ ] レスポンシブデザインに対応している
- [ ] ローディング状態が適切に表示される
- [ ] エラーハンドリングが実装されている

### 推奨要件 (Should Have)

- [ ] リアルタイムデータ更新が動作する
- [ ] インタラクティブなチャートが実装されている
- [ ] アラート機能が動作する
- [ ] 直感的なユーザー体験

### 望ましい要件 (Could Have)

- [ ] ウィジェットのカスタマイズ
- [ ] データエクスポート機能
- [ ] 高度なフィルタリング
- [ ] アニメーション効果

## 画面設計

### ダッシュボードメイン画面

```
┌─────────────────────────────────────────────────────────────────────┐
│  Header: SaaS アカウント管理 / ダッシュボード        [🔔] [👤]        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                   │
│  │アクティブ │ │接続SaaS │ │今月作成  │ │承認待ち │                   │
│  │ユーザー  │ │ サービス │ │アカウント│ │ 申請   │                   │
│  │  1,234  │ │   12   │ │   45    │ │   3    │                   │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘                   │
│                                                                     │
│  ┌─────────────────────────────┐ ┌─────────────────────────────┐   │
│  │        ユーザー登録推移        │ │       SaaS利用状況         │   │
│  │                             │ │                             │   │
│  │  120┌─────────────────────┐  │ │     Google Workspace: 45%  │   │
│  │     │        ╱╲           │  │ │     Microsoft 365: 30%     │   │
│  │  80 │      ╱    ╲         │  │ │     Slack: 15%             │   │
│  │     │    ╱        ╲       │  │ │     その他: 10%            │   │
│  │  40 │  ╱            ╲     │  │ │                             │   │
│  │     └─────────────────────┘  │ │                             │   │
│  │     1月 2月 3月 4月 5月 6月  │ │                             │   │
│  └─────────────────────────────┘ └─────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────┐ ┌─────────────────────────────┐   │
│  │        最近の活動            │ │      システム状況           │   │
│  │                             │ │                             │   │
│  │ • 田中太郎がログインしました   │ │ ✅ すべてのSaaSが正常       │   │
│  │ • 新規ユーザー作成: 佐藤花子   │ │ ✅ システム稼働率: 99.9%    │   │
│  │ • Slack権限を更新: 鈴木一郎   │ │ ⚠️  API制限まで残り20%      │   │
│  │ • Google Workspace同期完了   │ │ 🔄 定期同期: 次回12:00     │   │
│  │                             │ │                             │   │
│  └─────────────────────────────┘ └─────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## データ仕様

### 統計データ

```typescript
interface DashboardStats {
  activeUsers: number;
  connectedSaas: number;
  monthlyCreatedAccounts: number;
  pendingApprovals: number;
  userGrowth: Array<{
    date: string;
    count: number;
  }>;
  saasUsage: Array<{
    name: string;
    percentage: number;
    color: string;
  }>;
}
```

### アクティビティフィード

```typescript
interface Activity {
  id: string;
  type: "login" | "user_created" | "permission_updated" | "sync_completed";
  message: string;
  user?: string;
  timestamp: Date;
  icon: string;
}
```

### システム状況

```typescript
interface SystemStatus {
  saasConnections: Array<{
    name: string;
    status: "healthy" | "warning" | "error";
    lastSync: Date;
  }>;
  systemHealth: {
    uptime: number;
    apiLimits: number;
    nextSync: Date;
  };
}
```

## リアルタイム機能

### WebSocket 接続

- 新規ユーザー登録通知
- システム状況変更
- 承認申請通知
- エラー・アラート通知

### 自動更新

- 統計データ: 5 分間隔
- システム状況: 1 分間隔
- アクティビティフィード: リアルタイム

## 依存関係

- **前提条件**: TASK-001 (基本プロジェクト構造), TASK-008 (共通コンポーネント), TASK-002 (認証システム)
- **ブロッカー**: なし
- **次のタスク**: TASK-004, TASK-005, TASK-006, TASK-007

## 参考資料

- [Recharts Documentation](https://recharts.org/en-US/)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- docs/DSG-001\_基本設計書.md
- docs/REQ-001\_要求仕様書.md

## 実装ログ

### 2024-12-19

- タスク作成完了
- 要件定義完了
- 画面設計完了

## 完了条件

1. ダッシュボードが正常に表示される
2. 全ての統計データが表示される
3. レスポンシブデザインが適用されている
4. チャート・グラフが正常に動作する
5. アクティビティフィードが表示される
