# TASK-006: ワークフロー・承認 UI

## タスク情報

- **タスク ID**: TASK-006
- **タスク名**: ワークフロー・承認 UI
- **カテゴリ**: workflows
- **担当エージェント**: Agent-6
- **優先度**: 中
- **状態**: pending
- **作成日**: 2024-12-19
- **予想工数**: 8 時間

## 概要

SaaS アカウント一元管理システムのワークフロー・承認 UI を実装する。アカウント作成・削除・権限変更の承認フロー、多段階承認、条件分岐、通知機能を含む包括的な承認管理画面を構築する。

## 技術要件

- **フロー管理**: React Flow / Mermaid
- **フォーム**: React Hook Form + Zod
- **状態管理**: TanStack Query + Zustand
- **通知**: React Hot Toast + WebSocket
- **UI**: shadcn/ui コンポーネント

## 作業内容

### 1. ワークフロー管理

- [ ] ワークフロー一覧・作成・編集
- [ ] フロー図エディター
- [ ] 承認ステップ定義
- [ ] 条件分岐設定
- [ ] テンプレート管理

### 2. 承認申請

- [ ] 申請フォーム
- [ ] 申請履歴
- [ ] 進捗状況表示
- [ ] 添付ファイル対応
- [ ] 申請取り消し機能

### 3. 承認処理

- [ ] 承認待ち一覧
- [ ] 承認・却下処理
- [ ] コメント機能
- [ ] 代理承認
- [ ] 一括承認

### 4. 通知システム

- [ ] リアルタイム通知
- [ ] メール通知
- [ ] Slack 通知
- [ ] 通知設定
- [ ] エスカレーション

### 5. 監視・レポート

- [ ] 承認状況ダッシュボード
- [ ] 処理時間分析
- [ ] ボトルネック分析
- [ ] パフォーマンス指標
- [ ] 監査ログ

## 対象ファイル

```
src/app/(dashboard)/workflows/
├── page.tsx
├── requests/
│   ├── page.tsx
│   ├── new/
│   │   └── page.tsx
│   └── [id]/
│       └── page.tsx
├── approvals/
│   ├── page.tsx
│   └── [id]/
│       └── page.tsx
├── templates/
│   ├── page.tsx
│   ├── new/
│   │   └── page.tsx
│   └── [id]/
│       └── page.tsx
└── reports/
    └── page.tsx

src/components/features/workflows/
├── workflow-editor.tsx
├── workflow-diagram.tsx
├── request-form.tsx
├── request-list.tsx
├── request-detail.tsx
├── approval-card.tsx
├── approval-form.tsx
├── approval-history.tsx
├── notification-panel.tsx
├── status-badge.tsx
├── flow-visualizer.tsx
├── template-selector.tsx
├── comment-thread.tsx
└── escalation-rules.tsx

src/hooks/
├── use-workflows.ts
├── use-requests.ts
├── use-approvals.ts
├── use-notifications.ts
└── use-workflow-editor.ts
```

## 受け入れ基準

### 必須要件 (Must Have)

- [ ] ワークフロー作成・編集ができる
- [ ] 承認申請が正常に動作する
- [ ] 承認・却下処理が動作する
- [ ] 通知機能が実装されている
- [ ] 進捗状況が正確に表示される

### 推奨要件 (Should Have)

- [ ] 多段階承認が動作する
- [ ] 条件分岐が正常に動作する
- [ ] 代理承認機能が実装されている
- [ ] エスカレーション機能が動作する

### 望ましい要件 (Could Have)

- [ ] 高度なフロー設計機能
- [ ] 詳細な分析レポート
- [ ] カスタム通知設定
- [ ] API 連携機能

## 画面設計

### ワークフロー一覧

```
┌─────────────────────────────────────────────────────────────────────┐
│ ワークフロー管理                                [ 新規作成 ] [ 設定 ] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ 新規ユーザー作成フロー                          [ 編集 ] [ 削除 ]  │ │
│ │ 新規入社時のアカウント作成承認フロー                              │ │
│ │                                                                 │ │
│ │ [申請者] → [直属上司] → [人事部] → [IT部] → [完了]               │ │
│ │                                                                 │ │
│ │ 🟢 有効 | 今月の申請: 8件 | 平均処理時間: 2.3日                 │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ 権限変更フロー                                  [ 編集 ] [ 削除 ]  │ │
│ │ 部署異動や昇進に伴う権限変更承認フロー                            │ │
│ │                                                                 │ │
│ │ [申請者] → [部門長] → [IT部] → [完了]                           │ │
│ │                                                                 │ │
│ │ 🟢 有効 | 今月の申請: 3件 | 平均処理時間: 1.5日                 │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 承認申請詳細

```
┌─────────────────────────────────────────────────────────────────────┐
│ 申請詳細 #WF-2024-001                           [ 承認 ] [ 却下 ]     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ 申請情報                                                         │ │
│ │ 申請者: 田中太郎 (sales@company.com)                             │ │
│ │ 申請日: 2024-12-19 09:30                                        │ │
│ │ 種別: 新規ユーザー作成                                           │ │
│ │ 優先度: 通常                                                     │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ 申請内容                                                         │ │
│ │ 対象ユーザー: 佐藤花子 (新入社員)                                │ │
│ │ 部署: 営業部                                                     │ │
│ │ 役職: 営業担当                                                   │ │
│ │ 必要なSaaS:                                                      │ │
│ │ • Google Workspace (Editor権限)                                │ │
│ │ • Slack (Standard Member)                                      │ │
│ │ • Salesforce (Sales User)                                      │ │
│ │                                                                 │ │
│ │ 理由: 営業部新入社員のアカウント作成                              │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ 承認フロー                                                       │ │
│ │ 田中太郎 → 📝 山田部長 → ⏳ 人事部 → ⏳ IT部 → ⏳ 完了          │ │
│ │ (申請者)   (承認済み)   (承認待ち)  (待機中)   (待機中)            │ │
│ │                                                                 │ │
│ │ 承認履歴:                                                        │ │
│ │ • 2024-12-19 10:15 - 山田部長が承認 「承認します」               │ │
│ │ • 2024-12-19 09:30 - 申請提出                                   │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ コメント                                                         │ │
│ │ [________________承認コメント___________________]                │ │
│ │                                                                 │ │
│ │ [ 承認 ] [ 却下 ] [ 差し戻し ] [ 代理承認 ]                      │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## データ仕様

### ワークフロー定義

```typescript
interface Workflow {
  id: string;
  name: string;
  description: string;
  type:
    | "user_creation"
    | "user_deletion"
    | "permission_change"
    | "department_transfer";
  isActive: boolean;
  steps: WorkflowStep[];
  conditions: WorkflowCondition[];
  notifications: NotificationRule[];
  statistics: {
    totalRequests: number;
    averageProcessingTime: number;
    successRate: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### ワークフロー申請

```typescript
interface WorkflowRequest {
  id: string;
  workflowId: string;
  requesterId: string;
  targetUserId?: string;
  type: string;
  priority: "low" | "normal" | "high" | "urgent";
  status: "pending" | "approved" | "rejected" | "cancelled";
  currentStep: number;
  data: Record<string, any>;
  approvals: Approval[];
  comments: Comment[];
  attachments: Attachment[];
  createdAt: Date;
  updatedAt: Date;
}
```

### 承認記録

```typescript
interface Approval {
  id: string;
  requestId: string;
  approverId: string;
  stepId: string;
  action: "approve" | "reject" | "delegate";
  comment?: string;
  timestamp: Date;
  delegatedTo?: string;
}
```

## ワークフロー機能

### 承認フロー

- 順次承認: 段階的承認
- 並列承認: 複数承認者同時
- 条件分岐: 申請内容による分岐
- 代理承認: 承認者不在時の代理

### 通知機能

- リアルタイム通知
- メール通知
- Slack 通知
- エスカレーション通知

### エスカレーション

- 時間ベース: 期限超過時
- 条件ベース: 特定条件満たす時
- 手動エスカレーション: 緊急時

## 依存関係

- **前提条件**: TASK-001 (基本プロジェクト構造), TASK-008 (共通コンポーネント), TASK-002 (認証システム)
- **ブロッカー**: なし
- **次のタスク**: TASK-007

## 参考資料

- [React Flow Documentation](https://reactflow.dev/)
- [Workflow Management Patterns](https://www.workflowpatterns.com/)
- [BPMN 2.0 Specification](https://www.omg.org/spec/BPMN/2.0/)
- docs/DSG-001\_基本設計書.md
- docs/REQ-001\_要求仕様書.md

## 実装ログ

### 2024-12-19

- タスク作成完了
- 要件定義完了
- 画面設計完了

## 完了条件

1. ワークフロー作成・編集機能が正常に動作する
2. 承認申請・処理フローが実装されている
3. 通知システムが動作する
4. 多段階承認が正常に動作する
5. 監視・レポート機能が実装されている
