プロジェクト概要:
  名前: partial-scan
  目的:
    大規模言語モデル（LLM）への指示（プロンプト）を効率的に生成するための、Git駆動型コマンドラインツール。開発者が自然言語で要求すると、ツールがリポジトリを分析し、最適なGitコマンドを自動生成して、コードの関連箇所を抽出・構造化する。これにより、コードレビュー、バグ修正、機能開発などの開発効率を劇的に向上させる。
  対象ユーザー: ソフトウェア開発者、AI（LLM）を利用して開発を行うエンジニア
  全体的なアーキテクチャ:
    CLI（コマンドラインインターフェース）ツールとして設計されており、Pythonで実装されている。主要な機能は`prompt`、`detail`、`analyze`、`figma`のサブコマンドに分割されている。Unix哲学に基づき、各コマンドは特定の役割を持ち、パイプラインで連携可能だが、`analyze`統合コマンドの使用が推奨される。Figma APIと連携し、デザイン情報からプロンプトを生成する機能も持つ。

技術スタック:
  使用言語: Python 3.8以上
  主要ライブラリ/フレームワーク:
    - Typer: CLIアプリケーションのフレームワーク
    - Rich: 高機能なコンソール出力
    - Requests: Figma APIとの同期HTTP通信
    - aiohttp: Figma APIとの非同期HTTP通信
    - Pydantic: データバリデーションとモデル定義
    - python-dotenv: 環境変数管理
    - Pillow: 画像処理
    - pytest: テストフレームワーク
  採用されている設計パターン:
    - コマンドパイプラインアーキテクチャ: `[ユーザー入力] -> [analyze] -> [prompt処理] -> [detail処理] -> [プロンプト出力]` という一連の流れで処理を行う。
    - シングルトンパターン: `GitScanner`クラスでインスタンスをキャッシュし、パフォーマンスを向上させている (`partial_scan/core/git_scanner.py`)。
    - テンプレートメソッドパターン: `BaseAnalyzer` (`partial_scan/figma/analyzers/base.py`) や `BaseGenerator` (`partial_scan/figma/generators/base.py`) などの基底クラスで処理の骨格を定義し、サブクラスで具体的な処理を実装している。
  データ構造と保存方法:
    - プロンプトテンプレート: Markdown形式で`partial_scan/templates/`に保存されている。
    - Figma設定: ユーザーのFigma APIトークンは暗号化され、`.env`ファイルに保存される。
    - Figma APIレスポンスキャッシュ: APIからの応答は`.figma_cache/`ディレクトリに24時間キャッシュされ、API呼び出しを効率化している (`partial_scan/figma/utils/cache.py`)。

主要コンポーネント:
  - `partial_scan/cli/`: コマンドラインインターフェースの実装。
    - `main.py`: メインエントリーポイント。`analyze`統合コマンドを定義。
    - `prompt.py`: Gitの差分(`--diff`)やパターン検索(`--grep`)に基づき、関連ファイルリストを生成する。
    - `detail.py`: `prompt`で生成されたファイルリストとテンプレートを基に、詳細なプロンプトを生成する。
    - `figma.py`: Figma APIとの連携機能を提供するサブコマンド群。
  - `partial_scan/core/git_scanner.py`: Gitリポジトリのスキャンを担当するコアロジック。`git diff`や`git grep`の実行、ファイル内容の取得、`.partialscanignore`による除外処理など、Git操作の中核を担う。
  - `partial_scan/figma/`: Figma APIとの統合機能群。
    - `api/client.py`: Figma APIとの通信を行うクライアント。レート制限やリトライ機能を備える。
    - `analyzers/`: Figmaのデザインファイルを分析するエンジン。色、タイポグラフィ、コンポーネントなどを解析する。
    - `generators/`: 分析結果を基に、デザイン仕様書や実装ガイドなどのプロンプトを生成する。
  - `partial_scan/templates/`: LLMへの指示プロンプトの雛形となるMarkdownファイル群。用途別に多数のテンプレートが用意されている。
  - `partial_scan/utils/git_executor.py`: `subprocess`をラップし、安全にGitコマンドを実行するためのユーティリティ。

開発環境とワークフロー:
  必要な開発環境:
    - Python 3.8以上
    - Git
  ビルドと実行の手順:
    - 開発モードでのインストール: `pip install -e ".[dev]"`
    - 開発用の依存関係をインストール: `pip install -e ".[dev]"`
    - インストールせずに実行: `python -m partial_scan --help`
    - 基本的な使用法: `python -m partial_scan analyze --purpose "目的" --diff HEAD~1 --template code_04_review`
  テスト方法:
    - `pytest`を使用したテストスイートが`tests/`ディレクトリに完備されている。
    - ユニットテスト、統合テスト、E2Eテストが分離されている。
    - テスト実行コマンド: `make test` (全テスト)、`make test-unit` (ユニットテストのみ)など、Makefileで簡易化されている。
    - カバレッジレポート: `make coverage` で生成。

主要ドキュメント:
  - `README.md`: プロジェクトの概要、特徴、インストール方法、クイックスタートを記載した主要ドキュメント。
  - `docs/COMMANDS.md`: 全コマンドの詳細な使い方、オプション、実用的な使用例、トラブルシューティングを網羅したリファレンス。
  - `docs/DEVELOPMENT.md`: 開発者向けの情報、インストールなしでのテスト方法、ワークフローなどを記載したガイド。
  - `docs/FIGMA_API_INTEGRATION_PLAN.md`: Figma連携機能の実装計画書。要件、アーキテクチャ、実装計画などが詳細に記されている。
  - `error_knowledge_base/ERROR_KNOWLEDGE_BASE.md`: 開発中に発生したエラーとその解決策をまとめたナレッジベース。

現状の課題と今後の方向性:
  現状の課題:
    - `docs/COMMANDS.md`には記載があるが、`partial-scan`自体にはまだ実装されていないディレクトリ指定オプション (`--path`, `--exclude-path`) がある。
    - PowerShell環境での文字化けやパイプライン処理に潜在的な問題があり、`analyze`統合コマンドの使用が強く推奨されている。
  今後の方向性:
    - AI機能の強化（GPT-4o, Claude-3.5対応）。
    - Web UIの実装による、ブラウザベースでの操作性の向上。
    - 分析結果を視覚化するダッシュボード機能の追加。
    - チームでの知識共有を促進する機能の拡充。