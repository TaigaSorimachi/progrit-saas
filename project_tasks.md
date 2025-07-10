# タスク進行管理・分割最適化指示書作成テンプレート - 最適AI選択による並列実行とサブタスク管理

## 1. 基本情報

**目的**: Documentation Analysis
**タスク種別**: タスク進行管理・分割最適化・並列実行設計・サブタスク管理
**対象ファイル数**: 1
**プロジェクト構造**:
```
.
└── README.md
```

## 2. AI選択と役割定義

### 指示生成AI（あなた）の目標
```yaml
instruction_generator:
  primary_role: "タスク管理戦略専門家"
  key_responsibilities:
    - "プロジェクト情報の包括的分析と戦略立案"
    - "タスク性質を評価し、最適な担当AI 1つを指名する"
    - "指名したAIが自律的に作業できる、明確で実行可能な指示書を作成する"
    - "自動タスク生成による作業の構造化と進捗管理の基盤構築"
  success_criteria:
    - "指名されたAIが指示書に基づき、期待される成果物を創出できる"
    - "定義された品質基準を満たす"
    - "後続の修正や拡張が容易な、保守性の高い成果物が得られる"
```

### AI選択基準
```yaml
selection_criteria:
  task_analysis:
    primary_objective: "効率的なタスク分割・管理システムの実装と並列実行最適化"
    task_nature: "implementation" # 新しいタスク管理・分割システムの実装
    complexity_level: "high"
    
  optimal_assignment:
    selected_ai: "implementation" # 実装担当AI
    selection_reason: "タスク進行管理システムは新しい管理プロセス・YAML構造の実装であり、実装担当AIの専門性が最適"
    expected_outcome: "効率的で並列実行可能なタスク分割・管理システム"
```

### 実装担当AI向け指示書の作成

**分析のポイント:**
```yaml
analysis_framework:
  technical_analysis:
    - aspect: "複雑タスクの論理的分解と並列実行可能性評価"
      method: "機能単位・データフロー・技術レイヤーでの分割戦略策定"
      output: "最適化されたタスク分割プランと並列実行設計"
    - aspect: "YAML構造設計とサブタスク実行フロー構築"
      method: "指定スキーマ準拠・自己完結性確保・成果物統合ルール策定"
      output: "詳細なYAML構造とタスク実行システム"
    - aspect: "品質保証とパフォーマンス最適化システム"
      method: "品質ガイドライン・実行効率評価・継続改善プロセス"
      output: "包括的な品質保証・最適化システム"
  
  context_integration:
    claude_files:
      - path: "root/CLAUDE.md"
        extract: "プロジェクト全体のタスク管理方針・品質基準・開発戦略"
      - path: "tasks/*/CLAUDE.md"
        extract: "各タスクの詳細要件・実装状況・依存関係"
    project_specific:
      - requirement: "既存のタスク管理プロセスと組織文化"
        consideration: "プロセス統合・チーム適応・効率性向上"
      - requirement: "プロジェクトの規模と複雑性"
        consideration: "スケーラビリティ・分割粒度・管理オーバーヘッド"
```

**指示生成AI（あなた）の作成指針:**
```yaml
instruction_creation_guidelines:
  analysis_depth:
    - "タスクの技術的・論理的特性を多層的に分析し、最適な分割戦略を徹底的に策定する"
    - "並列実行可能性と依存関係を詳細に評価し、効率性を最大化する分割設計を立案する"
    - "プロジェクト固有の制約と要件を考慮したカスタマイズされた管理システムを設計する"
  
  instruction_specificity:
    - "実装担当AIが段階的に実行できる具体的なタスク分割・YAML実装手順を提供する"
    - "各段階での品質確認ポイントと成功基準を明確に定義する"
    - "並列実行最適化と継続的改善を統合したタスク管理ガイドラインを作成する"
  
  deliverable_definition:
    - "実装されるタスク管理システムの仕様を定量的に記述する"
    - "並列実行効率・品質保証・管理効率などの検証可能な基準を設定する"
    - "継続的最適化と拡張性の評価指標を含める"
```

## 3. 指名したAIへの指示

指示生成AI（あなた）は、選択したAI専門家に対し、以下の指示書を作成します。

### 指名したAIへの指示書
```yaml
instruction_structure:
  target_assignment:
    selected_ai: "implementation" # 実装担当AI
    assignee_name: "Task Management Engineer"
    assignment_reason: "タスク分割・管理システム実装・YAML構造設計・並列実行最適化に特化した専門性を活用"
  
  main_objective: "効率的で並列実行可能なタスク分割・管理システムの実装"

  task_breakdown:
    - id: "TASK-DIVISION-01"
      name: "タスク分析・分割戦略策定"
      description: "複雑タスクの論理的分解と並列実行可能な最適分割戦略の策定"
      deliverable: "タスク分析レポート・分割戦略書・依存関係マップ"
      dependencies: []
      estimated_hours: 3
      priority: "critical"
    - id: "TASK-DIVISION-02"
      name: "YAML構造実装・サブタスクシステム構築"
      description: "指定スキーマ準拠のYAML実装とサブタスク実行フロー構築"
      deliverable: "YAML構造・実行システム・作業ディレクトリ構造・統合ルール"
      dependencies: ["TASK-DIVISION-01"]
      estimated_hours: 4
      priority: "critical"
    - id: "TASK-DIVISION-03"
      name: "品質保証・最適化システム実装"
      description: "品質ガイドライン適合性・実行効率・パフォーマンス最適化の実装"
      deliverable: "品質保証システム・最適化プロセス・継続改善機構"
      dependencies: ["TASK-DIVISION-02"]
      estimated_hours: 2
      priority: "high"
    - id: "TASK-DIVISION-04"
      name: "継続管理・スケーラビリティ確保"
      description: "継続的監視・自動最適化・拡張性確保システムの構築"
      deliverable: "監視システム・自動最適化・拡張ガイドライン"
      dependencies: ["TASK-DIVISION-03"]
      estimated_hours: 2
      priority: "medium"
  
  implementation_guidance:
    technical_requirements:
      - requirement: "分割効率性"
        specification: "並列実行可能性80%以上・依存関係最小化・自己完結性確保"
      - requirement: "YAML品質"
        specification: "スキーマ準拠100%・構造明確性・実行可能性100%"
      - requirement: "管理効率"
        specification: "管理オーバーヘッド20%以下・品質保証・継続最適化"
    
    quality_standards:
      - standard: "分割品質"
        verification_method: "論理性評価・並列実行可能性測定"
        target: "分割効率80%以上・並列実行成功率95%以上"
      - standard: "YAML構造品質"
        verification_method: "構文検証・実行可能性テスト"
        target: "構文エラー0件・実行成功率100%"
      - standard: "管理システム品質"
        verification_method: "効率測定・品質保証評価"
        target: "管理効率向上30%以上・品質基準達成95%以上"
  
  deliverables:
    primary:
      - type: "task_division_system"
        specification: "完全実装されたタスク分割・管理システム"
      - type: "yaml_structure_implementation"
        specification: "指定スキーマ準拠のYAML構造とサブタスクシステム"
    
    secondary:
      - type: "quality_assurance_system"
        specification: "品質保証・最適化・継続改善システム"
      - type: "scalability_framework"
        specification: "拡張性確保・継続管理フレームワーク"
```

## 4. 専門フレームワーク: タスク分割・管理システム

### 入力情報処理
- **context_yaml**: プロジェクト現状分析とタスク状況把握
- **parent_task_id**: 分割対象タスクの特定と詳細分析
- **target_split_count**: 最適分割数の算出と効率性評価
- **target_split_task_id**: 特定サブタスクの詳細化と実装
- **completed_task_id**: 完了状況の反映と進捗管理

### 分割戦略フレームワーク
1. **機能単位分割**: 独立した機能・モジュール単位での論理的分割
2. **データフロー分割**: データの流れと処理順序に沿った効率的分割
3. **技術レイヤー分割**: フロントエンド/バックエンド等の技術層での分割
4. **成果物単位分割**: 生成される成果物とその品質基準での分割

### 出力YAMLスキーマ
```yaml
parent_task:
  task_id: "[親タスクID]"
  phase_id: "[フェーズID]"
  title: "[親タスクのタイトル]"
  background: "[背景・コンテキスト説明]"
  done_criteria:
    - 全サブタスクのDoD達成
    - [その他の完了条件]
  merge_rules: "[サブタスク成果物の統合ルール]"
  shared_refs:
    - type: document  # document|code|url
      ref: "[参照パス/URL]"
      desc: "[説明]"

subtasks:  # 並列実行を前提
  - idx: 1
    id: "[親タスクID]-S1"
    phase_id: "[フェーズID]"
    status: todo
    title: "[サブタスクのタイトル]"
    objective: "[サブタスクの目的]"
    working_directory: "[専用作業ディレクトリパス]"
    instructions:
      - step: 1
        action: "[実行アクション]"
        details: "[詳細説明]"
    deliverables:
      - id: "[成果物ID（deliverable_catalogのID）]"
        status: flow  # flow|stock
        note: "[補足説明]"
    output_artifacts:
      - path: "subtask_output/file.md"
        description: "生成されるファイルの説明"
    deps: []  # 依存サブタスクID（原則空）
    refs: []  # サブタスク固有の参照
    expectations:
      code:
        - file: "[ファイルパス]"
          status: new  # new|modified|deleted
          summary: "[変更概要]"
      behavior: "[期待される動作]"
    considerations:
      security: "[セキュリティ考慮事項]"
      performance: "[パフォーマンス考慮事項]"
    quality:
      coverage: 80
      review_points:
        - "[レビューポイント]"
    done:
      - "[サブタスク完了条件]"
```

## 5. 品質保証とエラーハンドリング

### 品質保証項目
- **分割効率性**: 並列実行可能性80%以上と依存関係最小化
- **YAML品質**: スキーマ準拠100%と実行可能性100%
- **管理効率**: 管理オーバーヘッド20%以下と品質保証

### 想定されるエラーパターン
- **過剰分割**: 実行不可能な微細分割や管理オーバーヘッドの増大
- **不適切な依存関係**: 並列性を阻害する過度な依存関係設定
- **YAML構造の複雑化**: スキーマ逸脱や実行困難な構造設計

### 品質チェックポイント
- 各サブタスクの論理的独立性と実行可能性確認
- YAML構造のスキーマ準拠性と構文正確性検証
- 並列実行効率と管理システムの動作確認
- 品質保証システムの機能と効果の評価

### 継続的改善
- タスク実行結果に基づく分割戦略の継続的最適化
- パフォーマンス指標の収集・分析・改善サイクル
- ベストプラクティスの蓄積・共有・標準化
- 新しい管理手法・ツールとの統合と進化

---
**テンプレート最終更新**: 2025-01-24  
**対象領域**: タスク進行管理・分割最適化・並列実行設計・サブタスク管理  
**適用AI**: 実装担当AI（Task Management Engineer）

## 対象ファイル


### README.md

```md
# SaaS Account Management System

## Overview

An enterprise-grade SaaS account management system that centralizes and automates the creation, deletion, and permission management of SaaS accounts for employee onboarding, offboarding, and organizational changes.

## Key Features

### 🔐 Centralized Account Management

- **Single Dashboard**: Manage all SaaS accounts from one unified interface
- **Employee Lifecycle Management**: Streamline onboarding, offboarding, and role transitions
- **Permission Templates**: Role-based access control with customizable permission sets

### 🚀 Automated Provisioning

- **Auto-Provisioning**: Automatically create/delete accounts based on employee status
- **Workflow Integration**: Multi-stage approval processes with escalation
- **Scheduled Operations**: Time-based account management (e.g., termination date automation)

### 🔌 SaaS Integrations

- **Slack** ✅ **実装完了** - ユーザー招待・無効化、チャンネル管理、リアルタイム同期
- **Google Workspace** 🔄 **実装中** - Directory API、OAuth2.0連携
- **Microsoft 365** 🔄 **実装中** - Graph API、Teams統合
- **その他の予定SaaS**: Zoom, GitHub, GitLab, Salesforce
- **標準プロトコル**: OAuth2.0, SAML2.0, SCIM準拠
- **拡張可能アーキテクチャ**: カスタムSaaS連携に対応

### 📊 Monitoring & Compliance

- **Audit Trails**: Comprehensive logging of all account operations
- **Real-time Monitoring**: Dashboard with status tracking and alerts
- **Compliance Reports**: GDPR, SOX, and other regulatory compliance support

## Technical Architecture

### Frontend

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **TailwindCSS** for responsive design
- **shadcn/ui** for consistent UI components

### Backend

- **Node.js + Express** RESTful API
- **PostgreSQL** for relational data and audit logs
- **JWT Authentication** with OAuth2.0 integration
- **Rate Limiting** and security middleware

### Infrastructure

- **AWS/GCP** cloud deployment
- **Docker** containerization
- **99.9% uptime** SLA
- **Horizontal scaling** capability

## Project Structure

```
progrit-saas/
├── docs/                    # Project documentation
│   ├── REQ-001_要求仕様書.md     # Requirements specification
│   ├── ARC-001_システム構成図.md  # System architecture
│   ├── DSG-001_基本設計書.md     # Basic design document
│   ├── DSG-005_データベース設計.md # Database design
│   └── IMP-001_実装ガイドライン.md # Implementation guidelines
├── tasks/                   # Task management
│   ├── INDEX.md            # Task index
│   ├── TASK-001_setup.md   # Project setup
│   ├── TASK-002_auth.md    # Authentication system
│   ├── TASK-003_dashboard.md # Dashboard implementation
│   ├── TASK-004_users.md   # User management
│   ├── TASK-005_saas.md    # SaaS integration
│   ├── TASK-006_workflows.md # Workflow system
│   ├── TASK-007_logs.md    # Logging system
│   └── TASK-008_ui.md      # UI components
└── CONTEXT.yaml            # Project context and status
```

## Security & Compliance

### Authentication & Authorization

- **Multi-Factor Authentication** (MFA) required
- **SAML 2.0** Single Sign-On integration
- **Role-Based Access Control** (RBAC)
- **IP Whitelisting** and geographic restrictions

### Data Protection

- **AES-256 Encryption** for data at rest
- **TLS 1.3** for data in transit
- **API Key Encryption** for third-party integrations
- **PII Data Protection** with anonymization

### Compliance

- **GDPR** compliance for EU data protection
- **SOX** compliance for financial regulations
- **ISO 27001** security standards
- **Audit Logging** with 7-year retention

## Development Phase

This project is currently in the **implementation phase**. Progress status:

1. **Phase 1**: Initial Analysis & Requirements (✅ Completed)
2. **Phase 2**: Documentation & Architecture (✅ Completed)
3. **Phase 3**: UI/UX Design & Implementation (✅ Completed)
4. **Phase 4**: Core System Implementation (🔄 In Progress - 70% Complete)

### Current Status

- ✅ Database & API Infrastructure
- ✅ User Management System
- ✅ Dashboard & Monitoring
- ✅ Slack Integration (Full Implementation)
- 🔄 Authentication System (NextAuth.js)
- 🔄 Google Workspace Integration
- 🔄 Microsoft 365 Integration
- ⏳ Workflow & Approval System

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Docker (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/TaigaSorimachi/progrit-saas.git
cd progrit-saas

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### Development Workflow

```bash
# Start development server
npm run dev

# Run tests
npm run test

# Run linting
npm run lint

# Build for production
npm run build
```

## SaaS Integration Examples

### Slack ✅ 実装完了

```typescript
// ユーザー招待
const response = await fetch('/api/slack/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'invite',
    email: 'john.doe@company.com',
    channels: ['general', 'engineering'],
  }),
});

// チャンネル作成
await fetch('/api/slack/channels', {
  method: 'POST',
  body: JSON.stringify({
    action: 'create',
    name: 'project-alpha',
    isPrivate: false,
  }),
});
```

### Google Workspace 🔄 実装中

```typescript
const googleConnector = new GoogleWorkspaceConnector({
  credentials: process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
  domain: 'company.com',
});

await googleConnector.createUser({
  email: 'john.doe@company.com',
  firstName: 'John',
  lastName: 'Doe',
  department: 'Engineering',
  role: 'Developer',
});
```

### Microsoft 365 🔄 実装中

```typescript
const msConnector = new Microsoft365Connector({
  tenantId: process.env.MS_TENANT_ID,
  clientId: process.env.MS_CLIENT_ID,
  clientSecret: process.env.MS_CLIENT_SECRET,
});

await msConnector.assignLicense({
  userId: 'user-id',
  licenses: ['Office365-E3', 'Teams'],
});
```

## API Documentation

### Authentication

```bash
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
```

### User Management

```bash
GET    /api/users
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
```

### SaaS Account Management

```bash
GET    /api/saas/accounts
POST   /api/saas/accounts
PUT    /api/saas/accounts/:id
DELETE /api/saas/accounts/:id
```

### Workflows

```bash
GET    /api/workflows
POST   /api/workflows
PUT    /api/workflows/:id
GET    /api/workflows/:id/approve
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please contact:

- Email: support@progrit-saas.com
- Documentation: [docs/](./docs/)
- Issues: [GitHub Issues](https://github.com/TaigaSorimachi/progrit-saas/issues)

## Roadmap

### Current Release (v1.0)

- [ ] Core authentication system
- [ ] User management interface
- [ ] Basic SaaS integrations (Google, Microsoft)
- [ ] Simple workflow system

### Future Releases

- [ ] Advanced analytics and reporting
- [ ] Mobile application
- [ ] AI-powered recommendations
- [ ] Advanced workflow automation
- [ ] Custom SaaS connector SDK

---

**Built with ❤️ for enterprise teams who value security, efficiency, and scalability.**

```