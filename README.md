# Angori（アンゴリ）

🦍 ゴリラのアンガーマネジメントアプリ

## 概要

Angoriは、アンガーマネジメントをサポートするWebアプリケーションです。感情記録、怒りの傾向分析、AIアドバイス機能を通じて、健康的な感情管理をサポートします。

## 🏗 技術スタック

### フロントエンド
- **Next.js 15** (App Router + Turbopack)
- **React 19** + **TypeScript 5.0+**
- **Material-UI v6** (ゴリラテーマカスタマイズ)
- **D3.js v7** (怒りの傾向バブルマップ)
- **Zustand** (状態管理)
- **React Hook Form + Zod** (フォーム管理・バリデーション)
- **Axios** (API通信)
- **Jest + React Testing Library** (テスト)

### バックエンド
- **Ruby on Rails 7.1.5** (API mode) ✅
- **PostgreSQL 16+** ✅
- **JWT認証** (Devise + Devise-JWT) ✅
- **OpenAI API** (GPT-4o-mini) ✅
- **RSpec + RuboCop** (テスト・コード品質) ✅

### 開発環境
- **Docker** + **Docker Compose** 🐳 ✅
- **ホットリロード** (フロント・バック両対応) ✅
- **統合開発環境** (ワンコマンドセットアップ) ✅
- **便利スクリプト** (自動セットアップ・クリーンアップ) ✅

### 開発効率化
- **ESLint + Prettier** (コード品質・整形)
- **Husky + lint-staged** (Git hooks)
- **TypeScript** 型安全性
- **RuboCop** (Rubyコード品質)

### インフラ
- **フロントエンド**: Vercel ($0/月)
- **バックエンド**: Render ($7/月)
- **データベース**: Neon PostgreSQL ($0/月)
- **合計運用コスト**: $11-17/月（AI API + ドメイン込み）

## 📚 ドキュメント

- [Docker開発環境構築ガイド](./docs/docker-setup-guide.md) 🐳
- [技術調査報告書](./docs/technical-research-report.md)
- [フロントエンド環境構築ガイド](./docs/frontend-setup-guide.md)
- [バックエンド環境構築ガイド](./docs/backend-setup-guide.md)
- [プロジェクト管理](./docs/ProjectManagement/)

## 🚀 クイックスタート（Docker推奨）

### 前提条件
- **Docker Desktop 4.0+** ✅
- **Docker Compose V2** ✅
- **Git** ✅

### 🐳 Docker環境（推奨）

```bash
# 1. リポジトリクローン
git clone https://github.com/yoshihama-nineball/Angori.git
cd Angori

# 2. 自動セットアップ（初回のみ）
./docker/scripts/setup.sh

# 3. 開発環境起動
docker compose up -d

# 4. ブラウザで確認
open http://localhost:3000  # フロントエンド
open http://localhost:3001  # バックエンドAPI
```

**これだけで完全な開発環境が起動します！🎉**

#### Docker環境での開発コマンド

```bash
# フロントエンド開発
docker compose exec frontend yarn add package-name      # パッケージ追加
docker compose exec frontend yarn lint:fix              # ESLint修正
docker compose exec frontend yarn test                  # テスト実行

# バックエンド開発  
docker compose exec backend rails console               # Railsコンソール
docker compose exec backend rails generate model User   # モデル生成
docker compose exec backend bundle exec rspec           # テスト実行
docker compose exec backend bundle exec rubocop -a      # RuboCop修正

# データベース操作
docker compose exec backend rails db:migrate            # マイグレーション
docker compose exec backend rails db:seed               # シードデータ
docker compose exec postgres psql -U postgres -d angori_development  # 直接接続

# 環境管理
docker compose logs -f                                  # ログ確認
docker compose down                                     # 停止
./docker/scripts/cleanup.sh                            # クリーンアップ
```

### 📱 アクセス先

| サービス | URL | 説明 |
|---------|-----|------|
| **フロントエンド** | http://localhost:3000 | Next.js アプリ |
| **バックエンドAPI** | http://localhost:3001 | Rails API |
| **API ヘルスチェック** | http://localhost:3001/up | サーバー状態確認 |
| **PostgreSQL** | localhost:5432 | データベース |
| **Redis** | localhost:6379 | キャッシュ |

## 🔧 従来環境（ローカル開発）

### 前提条件
- **Node.js 20.17+** (Next.js 15対応)
- **Yarn** (パッケージマネージャー)
- **Ruby 3.2.3+** (バックエンド用)
- **PostgreSQL 14+** (データベース)

### フロントエンド開発環境

```bash
# フロントエンドディレクトリに移動
cd frontend

# 依存関係インストール
yarn install

# 環境変数設定
cp .env.example .env.local

# 開発サーバー起動
yarn dev
```

### バックエンド開発環境

```bash
# バックエンドディレクトリに移動
cd backend

# 依存関係インストール
bundle install

# 環境変数設定
cp .env.example .env.local
# DB_PASSWORD等を設定

# データベース作成・マイグレーション
rails db:create
rails db:migrate

# サーバー起動
rails server -p 5000
```

## 🎯 Docker環境の特徴

### ✅ 実装済み機能
- **ワンコマンドセットアップ**: `./docker/scripts/setup.sh`
- **ホットリロード**: フロント・バック1秒以内で変更反映
- **統合環境**: 4サービス（Frontend, Backend, PostgreSQL, Redis）
- **開発効率化**: 全ての開発コマンドがDocker内で実行可能
- **環境一貫性**: チーム全員が同じ環境で開発
- **依存関係隔離**: ローカル環境を汚さない

### 🔧 便利機能
- **自動セットアップ**: 初回環境構築の自動化
- **自動クリーンアップ**: 不要なリソース削除
- **ボリューム最適化**: node_modules/vendor除外でパフォーマンス向上
- **ネットワーク統合**: サービス間通信の自動設定

## 📋 主要コマンド

### Docker環境
```bash
# 環境管理
docker compose up -d          # バックグラウンド起動
docker compose down           # 停止
docker compose logs -f        # ログ確認
docker compose ps             # サービス状態確認

# 開発作業
docker compose exec frontend yarn add lodash
docker compose exec backend rails generate model AngerLog
docker compose exec backend rails db:migrate

# トラブルシューティング
docker compose build --no-cache    # キャッシュクリア再ビルド
./docker/scripts/cleanup.sh        # 環境クリーンアップ
```

### フロントエンド（従来環境）
```bash
# 開発
yarn dev              # 開発サーバー起動（Turbopack）
yarn build            # プロダクションビルド
yarn start            # プロダクションサーバー起動

# コード品質
yarn lint             # ESLint実行
yarn lint:fix         # ESLint自動修正
yarn format           # Prettier整形
yarn fix              # ESLint + Prettier 一括実行
yarn type-check       # TypeScript型チェック

# テスト
yarn test             # Jest実行
yarn test:watch       # ウォッチモード
yarn test:coverage    # カバレッジ測定

# 品質チェック
yarn check            # lint + format + type-check
yarn pre-commit       # コミット前チェック
```

### バックエンド（従来環境）
```bash
# 開発
rails server -p 5000  # APIサーバー起動
rails console         # Railsコンソール

# コード品質
bundle exec rubocop   # コード品質チェック
bundle exec rubocop -a # 自動修正

# テスト
bundle exec rspec     # RSpecテスト実行

# データベース
rails db:create       # データベース作成
rails db:migrate      # マイグレーション実行
rails db:seed         # シードデータ投入
```

## 🔧 環境変数設定

### Docker環境
Docker環境では`.env.docker`で統合管理されているため、個別設定は不要です。

### 従来環境

#### フロントエンド (.env.local)
```bash
# API接続（Docker環境の場合）
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1

# API接続（従来環境の場合）
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# アプリ設定
NEXT_PUBLIC_APP_NAME=Angori
NEXT_PUBLIC_APP_VERSION=1.0.0
```

#### バックエンド (.env.local)
```bash
# データベース設定
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# フロントエンド連携（Docker環境）
FRONTEND_URL=http://localhost:3000

# サーバー設定
PORT=5000
```

## 🎨 ゴリラテーマシステム

Angori専用のMaterial-UIカスタムテーマを実装：

- 🎨 **ゴリラカラーパレット**: 茶色系ベース + バナナアクセント
- 😤 **感情別カラー**: 怒り度1-10に対応したグラデーション
- ✨ **グラデーション効果**: ボタン・カードにリッチな視覚効果
- 📱 **レスポンシブ対応**: スマホ・PC両対応

## 🧪 実装済み機能

### ✅ 完了済み

#### 開発環境基盤
- **Docker統合環境**: フロント・バック・DB・Redis統合 🐳
- **ホットリロード**: 1秒以内で変更反映
- **自動セットアップ**: ワンコマンド環境構築
- **開発効率化**: 全コマンドDocker対応

#### フロントエンド基盤
- **基盤環境構築**: Next.js 15 + TypeScript + Material-UI v6
- **ゴリラテーマシステム**: アンガーマネジメント特化デザイン
- **状態管理**: Zustand設定完了
- **フォーム管理**: React Hook Form + Zod バリデーション
- **API通信**: Axios設定・認証対応
- **テスト環境**: Jest + React Testing Library
- **開発効率化**: ESLint + Prettier + Husky
- **型定義システム**: 全機能対応の TypeScript 型

#### バックエンド基盤
- **Rails API環境**: Rails 7.1.5 API mode
- **認証基盤**: Devise + JWT設定完了
- **データベース**: PostgreSQL接続・Userモデル
- **OpenAI統合**: GPT-4o-mini API設定
- **CORS設定**: フロントエンド連携対応
- **テスト環境**: RSpec + FactoryBot
- **コード品質**: RuboCop設定完了
- **API基盤**: Rails credentials + 環境変数管理

### 🚧 開発中
- **基本レイアウト**: ヘッダー・フッターナビ・サイドバー
- **認証システム**: JWT認証 + ログイン・登録フォーム
- **アンガーログ機能**: 感情記録・一覧表示

### 📋 予定
- **認証API実装**: ユーザー登録・ログイン・ログアウト
- **データモデル設計**: AngerLog, TriggerWord, AIAdvice等
- **アンガーログAPI**: CRUD + 分析機能
- **D3.js バブルマップ**: 怒りの傾向可視化
- **AI相談機能**: OpenAI GPT-4o-mini統合
- **感情カレンダー**: MUI Date Pickers活用

## 🏛 プロジェクト構成

```
Angori/ (ルートディレクトリ)
├── 🐳 docker compose.yml       # Docker統合環境設定 ✅
├── 🐳 .env.docker             # Docker環境変数 ✅
├── 🐳 docker/                 # Docker管理スクリプト ✅
│   └── scripts/
│       ├── setup.sh           # 自動セットアップ ✅
│       └── cleanup.sh         # 環境クリーンアップ ✅
├── .github/                 # GitHub設定・ワークフロー
│   ├── ISSUE_TEMPLATE/      # Issueテンプレート
│   └── workflows/           # CI/CDワークフロー
│
├── docs/                    # プロジェクト設計・仕様書
│   ├── ProjectManagement/   # プロジェクト管理
│   ├── DesignDocuments/     # 設計書
│   ├── technical-research-report.md
│   ├── frontend-setup-guide.md
│   └── backend-setup-guide.md
│
├── frontend/                # ✅ Next.js フロントエンド
│   ├── 🐳 Dockerfile         # フロントエンド用コンテナ ✅
│   ├── 🐳 .dockerignore      # Docker除外設定 ✅
│   ├── src/
│   │   ├── app/             # App Router
│   │   │   ├── (auth)/      # 認証関連ルート
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── register/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── actions/     # ✅ Server Actions
│   │   │   │   ├── auth.ts      # loginAction, registerAction, logoutAction
│   │   │   │   └── anger-log.ts # createAngerLogAction, deleteAngerLogAction
│   │   │   │
│   │   │   ├── dashboard/       # ダッシュボード（ホーム）
│   │   │   ├── records/         # アンガーログ記録・一覧
│   │   │   ├── calendar/        # 感情記録カレンダー
│   │   │   ├── analysis/        # 傾向分析・バブルマップ
│   │   │   ├── consultation/    # AI相談室
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   │
│   │   ├── components/          # 共通コンポーネント
│   │   │   ├── layout/          # レイアウト関連
│   │   │   │   ├── Header/
│   │   │   │   │   ├── Header.tsx
│   │   │   │   │   ├── Header.test.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── FooterNav/   # スマホ4タブナビ
│   │   │   │   │   ├── FooterNav.tsx
│   │   │   │   │   ├── FooterNav.test.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   └── Sidebar/     # PC用サイドバー
│   │   │   │       ├── Sidebar.tsx
│   │   │   │       ├── Sidebar.test.tsx
│   │   │   │       └── index.ts
│   │   │   ├── ui/              # 基本UI要素
│   │   │   │   ├── Button/
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   ├── Button.test.tsx
│   │   │   │   │   ├── Button.stories.tsx  # Storybook
│   │   │   │   │   └── index.ts
│   │   │   │   ├── Card/
│   │   │   │   │   ├── Card.tsx
│   │   │   │   │   ├── Card.test.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   └── Modal/
│   │   │   │       ├── Modal.tsx
│   │   │   │       ├── Modal.test.tsx
│   │   │   │       └── index.ts
│   │   │   ├── providers/       # ✅ Context Providers
│   │   │   │   ├── ClientThemeProvider.tsx
│   │   │   │   └── index.ts
│   │   │   └── feedback/        # ローディング・アラート
│   │   │       ├── LoadingSpinner/
│   │   │       │   ├── LoadingSpinner.tsx
│   │   │       │   ├── LoadingSpinner.test.tsx
│   │   │       │   └── index.ts
│   │   │       └── Alert/
│   │   │           ├── Alert.tsx
│   │   │           ├── Alert.test.tsx
│   │   │           └── index.ts
│   │   │
│   │   ├── features/            # 機能別コンポーネント
│   │   │   ├── auth/            # 認証機能
│   │   │   │   ├── components/  # LoginForm, RegisterForm等
│   │   │   │   │   ├── LoginForm/
│   │   │   │   │   │   ├── LoginForm.tsx
│   │   │   │   │   │   ├── LoginForm.test.tsx
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   └── RegisterForm/
│   │   │   │   │       ├── RegisterForm.tsx
│   │   │   │   │       ├── RegisterForm.test.tsx
│   │   │   │   │       └── index.ts
│   │   │   │   ├── hooks/       # ✅ useAuth（認証状態管理）
│   │   │   │   │   ├── useAuth.ts
│   │   │   │   │   └── useAuth.test.ts
│   │   │   │   └── types/
│   │   │   ├── anger-logs/      # アンガーログ機能
│   │   │   │   ├── components/  # LogItem, LogForm等
│   │   │   │   │   ├── LogItem/
│   │   │   │   │   │   ├── LogItem.tsx
│   │   │   │   │   │   ├── LogItem.test.tsx
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   └── LogForm/
│   │   │   │   │       ├── LogForm.tsx
│   │   │   │   │       ├── LogForm.test.tsx
│   │   │   │   │       └── index.ts
│   │   │   │   ├── hooks/       # useAngerLog等
│   │   │   │   │   ├── useAngerLog.ts
│   │   │   │   │   └── useAngerLog.test.ts
│   │   │   │   └── types/
│   │   │   ├── consultation/    # AI相談機能
│   │   │   │   ├── components/  # ChatInterface, AdviceCard等
│   │   │   │   │   ├── ChatInterface/
│   │   │   │   │   │   ├── ChatInterface.tsx
│   │   │   │   │   │   ├── ChatInterface.test.tsx
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   └── AdviceCard/
│   │   │   │   │       ├── AdviceCard.tsx
│   │   │   │   │       ├── AdviceCard.test.tsx
│   │   │   │   │       └── index.ts
│   │   │   │   └── hooks/       # useAIConsultation等
│   │   │   │       ├── useAIConsultation.ts
│   │   │   │       └── useAIConsultation.test.ts
│   │   │   ├── visualization/   # 傾向分析・D3.js
│   │   │   │   ├── components/  # BubbleMap, TrendChart等
│   │   │   │   │   ├── BubbleMap/
│   │   │   │   │   │   ├── BubbleMap.tsx
│   │   │   │   │   │   ├── BubbleMap.test.tsx
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   └── TrendChart/
│   │   │   │   │       ├── TrendChart.tsx
│   │   │   │   │       ├── TrendChart.test.tsx
│   │   │   │   │       └── index.ts
│   │   │   │   ├── hooks/       # useAngerAnalysis等
│   │   │   │   │   ├── useAngerAnalysis.ts
│   │   │   │   │   └── useAngerAnalysis.test.ts
│   │   │   │   └── d3-utils/    # D3.js ヘルパー関数
│   │   │   │       ├── bubbleChart.ts
│   │   │   │       ├── bubbleChart.test.ts
│   │   │   │       ├── trendLine.ts
│   │   │   │       └── trendLine.test.ts
│   │   │   └── calendar/        # 感情記録カレンダー
│   │   │       ├── components/  # EmotionCalendar等
│   │   │       │   └── EmotionCalendar/
│   │   │       │       ├── EmotionCalendar.tsx
│   │   │       │       ├── EmotionCalendar.test.tsx
│   │   │       │       └── index.ts
│   │   │       └── hooks/       # useEmotionCalendar等
│   │   │           ├── useEmotionCalendar.ts
│   │   │           └── useEmotionCalendar.test.ts
│   │   │
│   │   ├── lib/                 # ユーティリティ・設定
│   │   │   ├── api/             # ✅ API関数群
│   │   │   │   ├── angerLogs.ts    # アンガーログAPI
│   │   │   │   ├── auth.ts         # 認証API
│   │   │   │   ├── consultation.ts # AI相談API
│   │   │   │   └── analytics.ts    # 分析API
│   │   │   ├── api.ts           # Rails API クライアント（base）
│   │   │   ├── api.test.ts      # API関数のテスト
│   │   │   ├── auth/            # ✅ JWT認証管理
│   │   │   │   ├── dal.ts       # verifySession等（Server Actions用）
│   │   │   │   ├── dal.test.ts  # 認証ロジックのテスト
│   │   │   │   ├── session.ts   # ✅ createSession, deleteSession
│   │   │   │   └── session.test.ts
│   │   │   ├── utils.ts
│   │   │   └── utils.test.ts
│   │   │
│   │   ├── store/               # ✅ Zustand状態管理
│   │   │   ├── authStore.ts     # 認証状態
│   │   │   ├── authStore.test.ts
│   │   │   ├── angerLogStore.ts # アンガーログ状態
│   │   │   ├── angerLogStore.test.ts
│   │   │   ├── uiStore.ts       # UI状態
│   │   │   └── uiStore.test.ts
│   │   │
│   │   ├── types/               # ✅ TypeScript型定義
│   │   │   ├── api.ts           # API関連型
│   │   │   ├── anger.ts         # アンガーログ関連型
│   │   │   ├── visualization.ts # D3.js・分析関連型
│   │   │   └── user.ts          # ユーザー関連型
│   │   │
│   │   └── theme/               # ✅ MUIゴリラテーマ
│   │       └── gorilla.ts       # ゴリラテーマ設定
│   │
│   ├── public/
│   ├── .vscode/             # ✅ VS Code設定
│   │   ├── settings.json
│   │   └── extensions.json
│   ├── __tests__/           # 統合テスト・E2Eテスト
│   ├── __mocks__/           # モックファイル
│   ├── .env.local
│   ├── .env.example
│   ├── .eslintrc.json       # ✅ ESLint設定
│   ├── .prettierrc          # ✅ Prettier設定
│   ├── .prettierignore
│   ├── jest.config.js       # ✅ Jest設定
│   ├── jest.setup.js
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── next.config.js
│   ├── Dockerfile           # フロントエンド用Dockerfile
│   └── package.json
│
├── backend/                 # ✅ Rails API
│   ├── 🐳 Dockerfile        # バックエンド用コンテナ ✅
│   ├── 🐳 .dockerignore     # Docker除外設定 ✅
│   ├── app/
│   │   ├── controllers/     # APIコントローラー
│   │   │   └── api/v1/      # API v1
│   │   ├── models/          # ActiveRecordモデル
│   │   │   └── user.rb      # ✅ Userモデル（認証付き）
│   │   └── services/        # ビジネスロジック
│   │
│   ├── config/              # Rails設定
│   │   ├── initializers/    # 初期化設定
│   │   │   ├── cors.rb      # ✅ CORS設定
│   │   │   └── devise.rb    # ✅ 認証設定
│   │   ├── routes.rb        # ルーティング
│   │   ├── database.yml     # ✅ DB設定
│   │   └── credentials.yml.enc # ✅ 秘匿情報
│   │
│   ├── db/                  # データベース
│   │   ├── migrate/         # マイグレーション
│   │   └── seeds.rb
│   │
│   ├── spec/                # ✅ RSpecテスト
│   │   ├── models/          # モデルテスト
│   │   ├── requests/        # APIテスト
│   │   └── factories/       # テストデータ
│   │
│   ├── .env.local           # ✅ 環境変数
│   ├── .rubocop.yml         # ✅ RuboCop設定
│   └── Gemfile              # ✅ 依存関係
│
├── .gitignore               # ✅ 統合版gitignore
└── README.md
```

## 📈 開発状況

### フェーズ1: 基盤構築 ✅ 完了
- [x] 技術調査・選定完了
- [x] **Docker統合環境構築完了** 🐳
- [x] フロントエンド環境構築完了
- [x] バックエンド環境構築完了
- [x] ゴリラテーマシステム完了
- [x] 開発効率化ツール設定完了
- [x] テスト環境構築完了（フロント・バック両方）
- [x] CORS設定・API連携基盤完了

### フェーズ2: 認証・基本機能 🚧 開発中
- [ ] 認証API実装（ユーザー登録・ログイン）
- [ ] 基本レイアウト実装
- [ ] データモデル設計・実装
- [ ] アンガーログCRUD機能

### フェーズ3: 高度機能 📋 予定
- [ ] D3.js バブルマップ実装
- [ ] AI相談機能実装
- [ ] 感情カレンダー実装
- [ ] デプロイ・運用開始

## 🧪 テスト

### Docker環境
```bash
# フロントエンドテスト
docker compose exec frontend yarn test
docker compose exec frontend yarn test:coverage

# バックエンドテスト
docker compose exec backend bundle exec rspec
docker compose exec backend bundle exec rubocop

# 統合テスト
docker compose exec frontend yarn test
docker compose exec backend bundle exec rspec
```

### 従来環境
```bash
# フロントエンド
cd frontend
yarn test
yarn test:coverage

# バックエンド
cd backend
bundle exec rspec
bundle exec rubocop
```

## 🚀 デプロイ

### 開発環境起動

#### Docker環境（推奨）
```bash
# ワンコマンド起動
docker compose up -d

# ログ確認
docker compose logs -f
```

#### 従来環境
```bash
# バックエンド（ターミナル1）
cd backend
rails server -p 5000

# フロントエンド（ターミナル2）
cd frontend
yarn dev
```

### ステージング・プロダクション
```bash
# Vercel Preview + Render
git push origin feature-branch
# → 自動でプレビューデプロイ

# Vercel Production + Render
git push origin main
# → 自動でプロダクションデプロイ
```

## 🔧 開発効率化

### プリコミットフック

#### Docker環境
```bash
# フロントエンド品質チェック
docker compose exec frontend yarn pre-commit

# バックエンド品質チェック  
docker compose exec backend bundle exec rubocop -a
docker compose exec backend bundle exec rspec
```

#### 従来環境
```bash
# フロントエンド
yarn pre-commit  # ESLint + Prettier + TypeScript

# バックエンド  
bundle exec rubocop -a  # RuboCop自動修正
bundle exec rspec       # テスト実行
```

### 開発サーバー確認

| 環境 | フロントエンド | バックエンド | 特徴 |
|------|-------------|-------------|------|
| **Docker** | http://localhost:3000 | http://localhost:3001 | 🐳 統合環境・ホットリロード |
| **従来** | http://localhost:3000 | http://localhost:5000 | 💻 ローカル環境 |

## 🤝 コントリビューション

### 開発フロー
1. Issue作成・アサイン
2. Feature branchでコーディング
3. Docker環境で開発・テスト
4. コード品質チェック実行
5. Pull Request作成
6. レビュー・マージ

### 推奨開発環境
- **Docker環境**: チーム開発・CI/CD連携
- **従来環境**: 個人開発・デバッグ特化

### コード規約
- **フロントエンド**: TypeScript + React + Material-UI
- **バックエンド**: Ruby + Rails API + RSpec
- **API設計**: RESTful + JSON API
- **テスト**: 重要機能は必須
- **Docker**: 開発コマンドは全てコンテナ内実行

## 📞 サポート

### 関連リンク
- **本番環境**: TBD
- **ステージング**: TBD  
- **API文書**: TBD
- **Docker環境ガイド**: [詳細](./docs/docker-setup-guide.md) 🐳
- **技術調査報告書**: [詳細](./docs/technical-research-report.md)

### トラブルシューティング
```bash
# Docker環境リセット
./docker/scripts/cleanup.sh

# 完全環境再構築
docker compose down -v
./docker/scripts/setup.sh
```

### 問題報告
- [Issues](https://github.com/yoshihama-nineball/Angori/issues)
- [Discussions](https://github.com/yoshihama-nineball/Angori/discussions)

## 👥 コントリビューター

**メイン開発者**: [yoshihama-nineball](https://github.com/yoshihama-nineball)

---

## 📝 ライセンス

MIT License - 詳細は [LICENSE](./LICENSE) を参照

## 🦍 Special Thanks

このプロジェクトは、健康的な感情管理をサポートすることを目的として開発されています。ゴリラのように力強く、バナナのように優しい気持ちで、アンガーマネジメントの学習をサポートします。

**Docker環境で効率的に開発し、Let's manage anger like a wise gorilla! 🦍🍌🐳**