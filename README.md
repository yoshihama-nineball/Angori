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

- [技術調査報告書](./docs/technical-research-report.md)
- [フロントエンド環境構築ガイド](./docs/frontend-setup-guide.md)
- [バックエンド環境構築ガイド](./docs/backend-setup-guide.md)
- [プロジェクト管理](./docs/ProjectManagement/)
- [UI設計サンプル](./docs/)

## 🚀 セットアップ

### 前提条件
- **Node.js 18.17+** (Next.js 15対応)
- **Yarn** (パッケージマネージャー)
- **Ruby 3.2.3+** (バックエンド用)
- **PostgreSQL 14+** (データベース)
- **Docker & Docker Compose** (任意)

### フロントエンド開発環境

```bash
# リポジトリクローン
git clone https://github.com/yoshihama-nineball/Angori.git
cd Angori/frontend

# 依存関係インストール
yarn install

# 環境変数設定
cp .env.example .env.local

# 開発サーバー起動
yarn dev
```

**開発サーバー**: http://localhost:3000

### バックエンド開発環境

```bash
# バックエンドディレクトリに移動
cd Angori/backend

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

**APIサーバー**: http://localhost:5000  
**API Base URL**: http://localhost:5000/api/v1

### 主要コマンド

#### フロントエンド
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

#### バックエンド
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

### 環境変数設定

#### フロントエンド (.env.local)
```bash
# フロントエンド設定
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
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

# フロントエンド連携
FRONTEND_URL=http://localhost:3000

# サーバー設定
PORT=5000
```

### VS Code 設定

推奨拡張機能が自動で提案されます：
- Prettier - Code formatter
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- Jest
- Ruby LSP (バックエンド用)

## 🎨 ゴリラテーマシステム

Angori専用のMaterial-UIカスタムテーマを実装：

- 🎨 **ゴリラカラーパレット**: 茶色系ベース + バナナアクセント
- 😤 **感情別カラー**: 怒り度1-10に対応したグラデーション
- ✨ **グラデーション効果**: ボタン・カードにリッチな視覚効果
- 📱 **レスポンシブ対応**: スマホ・PC両対応

## 🧪 実装済み機能

### ✅ 完了済み

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

## 🔧 開発ガイド

### API設計パターン

#### フロントエンド API呼び出し
```typescript
// lib/api/angerLogs.ts
import api from '@/lib/api'
import { AngerLog, ApiResponse } from '@/types/api'

export const angerLogApi = {
  async getAll(): Promise<AngerLog[]> {
    const response = await api.get<ApiResponse<AngerLog[]>>('/anger_logs')
    return response.data.data
  },

  async create(data: Partial<AngerLog>): Promise<AngerLog> {
    const response = await api.post<ApiResponse<AngerLog>>('/anger_logs', data)
    return response.data.data
  },
}
```

#### バックエンド API実装
```ruby
# app/controllers/api/v1/anger_logs_controller.rb
class Api::V1::AngerLogsController < ApplicationController
  before_action :authenticate_user!

  def index
    @anger_logs = current_user.anger_logs.recent
    render json: { data: @anger_logs }
  end

  def create
    @anger_log = current_user.anger_logs.build(anger_log_params)
    
    if @anger_log.save
      render json: { data: @anger_log }, status: :created
    else
      render json: { errors: @anger_log.errors }, status: :unprocessable_entity
    end
  end

  private

  def anger_log_params
    params.require(:anger_log).permit(:intensity, :situation, :emotion_description)
  end
end
```

### 状態管理パターン

```typescript
// store/angerLogStore.ts
import { create } from 'zustand'
import { AngerLog } from '@/types/api'
import { angerLogApi } from '@/lib/api/angerLogs'

interface AngerLogState {
  logs: AngerLog[]
  loading: boolean
  fetchLogs: () => Promise<void>
  addLog: (log: AngerLog) => Promise<void>
}

export const useAngerLogStore = create<AngerLogState>((set, get) => ({
  logs: [],
  loading: false,
  
  fetchLogs: async () => {
    set({ loading: true })
    try {
      const logs = await angerLogApi.getAll()
      set({ logs })
    } finally {
      set({ loading: false })
    }
  },

  addLog: async (logData) => {
    const newLog = await angerLogApi.create(logData)
    set((state) => ({ logs: [...state.logs, newLog] }))
  },
}))
```

## 🏛 プロジェクト構成

```
Angori/ (ルートディレクトリ)
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

### API エンドポイント設計

#### 認証系 (実装予定)
```
POST /api/v1/auth/register   # ユーザー登録
POST /api/v1/auth/login      # ログイン
DELETE /api/v1/auth/logout   # ログアウト
GET  /api/v1/auth/user       # ユーザー情報取得
```

#### アンガーログ系 (実装予定)
```
GET    /api/v1/anger_logs         # ログ一覧取得
POST   /api/v1/anger_logs         # ログ作成
GET    /api/v1/anger_logs/:id     # ログ詳細取得
PUT    /api/v1/anger_logs/:id     # ログ更新
DELETE /api/v1/anger_logs/:id     # ログ削除
```

#### AI・分析系 (実装予定)
```
POST /api/v1/anger_logs/:id/ai_advice  # AIアドバイス生成
GET  /api/v1/analytics/trends          # 傾向分析
GET  /api/v1/analytics/triggers        # トリガー分析
```

## 📈 開発状況

### フェーズ1: 基盤構築 ✅ 完了
- [x] 技術調査・選定完了
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

### フロントエンド
```bash
cd frontend

# 全テスト実行
yarn test

# カバレッジ確認
yarn test:coverage

# ウォッチモード
yarn test:watch
```

### バックエンド
```bash
cd backend

# 全テスト実行
bundle exec rspec

# 特定ファイルのテスト
bundle exec rspec spec/models/user_spec.rb

# コード品質チェック
bundle exec rubocop
```

### テスト方針
- **フロントエンド**: 単体・統合・E2Eテスト
- **バックエンド**: モデル・リクエスト・サービステスト
- **API連携**: フロント・バック統合テスト
- **コード品質**: ESLint + RuboCop

## 🚀 デプロイ

### 開発環境起動
```bash
# バックエンド（ターミナル1）
cd backend
rails server -p 5000

# フロントエンド（ターミナル2）
cd frontend
yarn dev
```

### ステージング
```bash
# Vercel Preview
git push origin feature-branch
# → 自動でプレビューデプロイ
```

### プロダクション
```bash
# Vercel Production + Render
git push origin main
# → 自動でプロダクションデプロイ
```

## 🔧 開発効率化

### プリコミットフック
```bash
# フロントエンド
yarn pre-commit  # ESLint + Prettier + TypeScript

# バックエンド  
bundle exec rubocop -a  # RuboCop自動修正
bundle exec rspec       # テスト実行
```

### 開発サーバー確認
- **フロントエンド**: http://localhost:3000
- **バックエンドAPI**: http://localhost:5000
- **API ヘルスチェック**: http://localhost:5000/up
- **CORS動作確認**: ✅ 設定済み

## 🤝 コントリビューション

### 開発フロー
1. Issue作成・アサイン
2. Feature branchでコーディング
3. フロント: `yarn pre-commit` / バック: `bundle exec rubocop` でコード品質チェック
4. Pull Request作成
5. レビュー・マージ

### コード規約
- **フロントエンド**: TypeScript + React + Material-UI
- **バックエンド**: Ruby + Rails API + RSpec
- **API設計**: RESTful + JSON API
- **テスト**: 重要機能は必須

## 📞 サポート

### 関連リンク
- **本番環境**: TBD
- **ステージング**: TBD  
- **API文書**: TBD
- **技術調査報告書**: [詳細](./docs/technical-research-report.md)

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

**Let's manage anger like a wise gorilla! 🦍🍌**