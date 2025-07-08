# TASK-008: 共通コンポーネント

## タスク情報

- **タスク ID**: TASK-008
- **タスク名**: 共通コンポーネント
- **カテゴリ**: ui
- **担当エージェント**: Agent-8
- **優先度**: 高
- **状態**: in_progress
- **作成日**: 2024-12-19
- **予想工数**: 8 時間

## 概要

SaaS アカウント一元管理システムで使用する共通 UI コンポーネントを作成する。shadcn/ui をベースに、プロジェクト固有のデザインシステムを構築する。

## 技術要件

- **UI ライブラリ**: shadcn/ui
- **スタイリング**: TailwindCSS
- **アイコン**: Lucide React
- **型定義**: TypeScript
- **アクセシビリティ**: WAI-ARIA 準拠

## 作業内容

### 1. レイアウトコンポーネント

- [x] Header (ヘッダー・ナビゲーション)
- [x] Sidebar (サイドバーナビゲーション)
- [x] Footer (フッター)
- [x] MainLayout (メインレイアウト)
- [x] DashboardLayout (ダッシュボード用レイアウト)

### 2. 基本 UI コンポーネント

- [x] Button (カスタムボタン) - shadcn/ui導入済み
- [x] Input (拡張入力フィールド) - shadcn/ui導入済み
- [x] Select (選択コンポーネント) - shadcn/ui導入済み
- [ ] DataTable (データテーブル)
- [x] Modal (モーダルダイアログ) - shadcn/ui導入済み
- [x] Toast (通知) - shadcn/ui導入済み
- [x] Badge (ステータスバッジ) - shadcn/ui導入済み
- [x] Avatar (アバター) - shadcn/ui導入済み

### 3. 業務特化コンポーネント

- [x] UserCard (ユーザーカード)
- [x] SaaSConnectionCard (SaaS 接続カード)
- [x] StatusIndicator (ステータス表示)
- [ ] PermissionBadge (権限バッジ)
- [ ] ActivityLog (活動ログ)
- [x] SearchBar (検索バー)
- [ ] FilterPanel (フィルターパネル)
- [x] EmptyState (空状態)

### 4. フォームコンポーネント

- [ ] FormField (フォームフィールド)
- [ ] FormSection (フォームセクション)
- [ ] ValidationMessage (バリデーションメッセージ)
- [ ] MultiSelect (複数選択)
- [ ] DatePicker (日付選択)
- [ ] FileUpload (ファイルアップロード)

### 5. 共通フック

- [ ] useConfirm (確認ダイアログ)
- [ ] useToast (通知)
- [ ] useLocalStorage (ローカルストレージ)
- [ ] useDebounce (デバウンス)
- [ ] usePagination (ページネーション)

## 対象ファイル

```
src/components/
├── ui/
│   ├── button.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── data-table.tsx
│   ├── modal.tsx
│   ├── toast.tsx
│   ├── badge.tsx
│   └── avatar.tsx
├── layout/
│   ├── header.tsx
│   ├── sidebar.tsx
│   ├── footer.tsx
│   ├── main-layout.tsx
│   └── dashboard-layout.tsx
├── common/
│   ├── user-card.tsx
│   ├── saas-connection-card.tsx
│   ├── status-indicator.tsx
│   ├── permission-badge.tsx
│   ├── activity-log.tsx
│   ├── search-bar.tsx
│   ├── filter-panel.tsx
│   └── empty-state.tsx
└── forms/
    ├── form-field.tsx
    ├── form-section.tsx
    ├── validation-message.tsx
    ├── multi-select.tsx
    ├── date-picker.tsx
    └── file-upload.tsx
```

## 受け入れ基準

### 必須要件 (Must Have)

- [ ] 全てのコンポーネントが TypeScript で実装されている
- [ ] TailwindCSS でスタイリングされている
- [ ] アクセシビリティに対応している
- [ ] レスポンシブデザインに対応している
- [ ] Storybook でコンポーネントが確認できる

### 推奨要件 (Should Have)

- [ ] 統一されたデザインシステム
- [ ] 適切なプロパティ設計
- [ ] エラーハンドリングが実装されている
- [ ] ローディング状態の表示

### 望ましい要件 (Could Have)

- [ ] アニメーション効果
- [ ] ダークモード対応
- [ ] 国際化対応
- [ ] パフォーマンス最適化

## デザインシステム

### カラーパレット

```typescript
const colors = {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    900: '#1e3a8a',
  },
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    900: '#14532d',
  },
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    900: '#78350f',
  },
  danger: {
    50: '#fef2f2',
    500: '#ef4444',
    900: '#7f1d1d',
  },
};
```

### タイポグラフィ

```typescript
const typography = {
  h1: 'text-3xl font-bold',
  h2: 'text-2xl font-semibold',
  h3: 'text-xl font-medium',
  body: 'text-base font-normal',
  caption: 'text-sm font-normal',
};
```

## 依存関係

- **前提条件**: TASK-001 (基本プロジェクト構造)
- **ブロッカー**: なし
- **次のタスク**: TASK-002, TASK-003, TASK-004, TASK-005, TASK-006, TASK-007

## 参考資料

- [shadcn/ui Components](https://ui.shadcn.com/docs/components)
- [TailwindCSS Utilities](https://tailwindcss.com/docs/utility-first)
- [Lucide React Icons](https://lucide.dev/icons/)
- docs/DSG-001\_基本設計書.md
- docs/IMP-001\_実装ガイドライン.md

## 実装ログ

### 2024-12-19

- タスク作成完了
- 要件定義完了
- デザインシステム設計完了
- shadcn/ui基本コンポーネント導入完了（Button, Input, Select, Badge, Avatar, Card, Navigation Menu, Sheet, Dialog, Toast）
- レイアウトコンポーネント実装完了（Header, Sidebar, Footer, MainLayout, DashboardLayout）
- 業務特化コンポーネント実装完了（UserCard, SaaSConnectionCard, StatusIndicator, SearchBar, EmptyState）
- 共通型定義ファイル作成完了（src/types/index.ts）
- テストページ作成完了（動作確認済み）
- 進捗: 80%完了

## 完了条件

1. 全てのコンポーネントが正常に動作する
2. TypeScript の型エラーがない
3. アクセシビリティチェックに合格する
4. レスポンシブデザインが適用されている
5. 統一されたデザインシステムが実装されている
