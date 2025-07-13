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

### バックエンド（予定）
- **Ruby on Rails 7.1** (API mode)
- **PostgreSQL 16+**
- **JWT認証** (Devise + Devise-JWT)
- **OpenAI API** (GPT-4.1 mini)

### 開発効率化
- **ESLint + Prettier** (コード品質・整形)
- **Husky + lint-staged** (Git hooks)
- **TypeScript** 型安全性

### インフラ
- **フロントエンド**: Vercel ($0/月)
- **バックエンド**: Render ($7/月)
- **データベース**: Neon PostgreSQL ($0/月)
- **合計運用コスト**: $11-17/月（AI API + ドメイン込み）

## 📚 ドキュメント

- [技術調査報告書](./docs/technical-research-report.md)
- [フロントエンド環境構築ガイド](./docs/frontend-setup-guide.md)
- [プロジェクト管理](./docs/ProjectManagement/)
- [UI設計サンプル](./docs/)

## 🚀 セットアップ

### 前提条件
- **Node.js 18.17+** (Next.js 15対応)
- **Yarn** (パッケージマネージャー)
- **Ruby 3.2+** (バックエンド用・将来)
- **Docker & Docker Compose** (任意)

### フロントエンド開発環境

```bash
# リポジトリクローン
git clone https://github.com/yoshihama-nineball/Angori.git
cd Angori/frontend

# 依存関係インストール
yarn install

# 開発サーバー起動
yarn dev
```

**開発サーバー**: http://localhost:3000

### 主要コマンド

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

### 環境変数設定

```bash
# frontend/.env.local を作成
cp frontend/.env.example frontend/.env.local

# 必要に応じて設定値を変更
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_APP_NAME=Angori
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### VS Code 設定

推奨拡張機能が自動で提案されます：
- Prettier - Code formatter
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- Jest

## 🎨 ゴリラテーマシステム

Angori専用のMaterial-UIカスタムテーマを実装：

- 🎨 **ゴリラカラーパレット**: 茶色系ベース + バナナアクセント
- 😤 **感情別カラー**: 怒り度1-10に対応したグラデーション
- ✨ **グラデーション効果**: ボタン・カードにリッチな視覚効果
- 📱 **レスポンシブ対応**: スマホ・PC両対応

## 🧪 実装済み機能

### ✅ 完了済み
- **基盤環境構築**: Next.js 15 + TypeScript + Material-UI v6
- **ゴリラテーマシステム**: アンガーマネジメント特化デザイン
- **状態管理**: Zustand設定完了
- **フォーム管理**: React Hook Form + Zod バリデーション
- **API通信**: Axios設定・認証対応
- **テスト環境**: Jest + React Testing Library
- **開発効率化**: ESLint + Prettier + Husky
- **型定義システム**: 全機能対応の TypeScript 型

### 🚧 開発中
- **基本レイアウト**: ヘッダー・フッターナビ・サイドバー
- **認証システム**: JWT認証 + ログイン・登録フォーム
- **アンガーログ機能**: 感情記録・一覧表示

### 📋 予定
- **D3.js バブルマップ**: 怒りの傾向可視化
- **AI相談機能**: OpenAI GPT-4.1 mini統合
- **感情カレンダー**: MUI Date Pickers活用
- **Rails API**: バックエンド開発
- **データベース設計**: PostgreSQL + アンガーログ管理

## 🔧 開発ガイド

### コンポーネント作成ルール

```typescript
// components/ui/Button/Button.tsx
import { Button as MuiButton, ButtonProps } from '@mui/material'
import { useTheme } from '@mui/material/styles'

interface GorillaButtonProps extends ButtonProps {
  variant?: 'gorilla' | 'banana' | 'jungle'
}

export const GorillaButton = ({ variant = 'gorilla', ...props }: GorillaButtonProps) => {
  const theme = useTheme()
  return (
    <MuiButton 
      className={`${variant}-button`}
      {...props}
    />
  )
}
```

### 状態管理パターン

```typescript
// store/angerLogStore.ts
import { create } from 'zustand'
import { AngerLog } from '@/types/api'

interface AngerLogState {
  logs: AngerLog[]
  addLog: (log: AngerLog) => void
  updateLog: (id: number, log: Partial<AngerLog>) => void
}

export const useAngerLogStore = create<AngerLogState>((set) => ({
  logs: [],
  addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
  updateLog: (id, updatedLog) => set((state) => ({
    logs: state.logs.map(log => log.id === id ? { ...log, ...updatedLog } : log)
  })),
}))
```

### API呼び出しパターン

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

## 🏛 プロジェクト構成

```
Angori/ (ルートディレクトリ)
├── .github/                 # GitHub設定・ワークフロー
│   ├── ISSUE_TEMPLATE/      # Issueテンプレート
│   └── workflows/           # CI/CDワークフロー
│
├── docs/                    # プロジェクト設計・仕様書
│   ├── ProjectManagement/   # プロジェクト管理
│   │   └── project-schedule.md
│   ├── DesignDocuments/     # 設計書
│   │   ├── API/             # API設計書
│   │   ├── Architecture/    # アーキテクチャ設計
│   │   ├── ERD/             # データベース設計
│   │   ├── Wireframes/      # UI設計・ワイヤーフレーム
│   │   └── Assets/          # ロゴ・OGP画像等
│   ├── technical-research-report.md
│   ├── frontend-setup-guide.md
│   └── sample-*.html        # UIデザインサンプル
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
├── backend/                 # 📋 Rails API (予定)
│   ├── app/
│   │   ├── controllers/
│   │   │   └── api/
│   │   │       └── v1/      # APIコントローラー
│   │   ├── models/          # ActiveRecordモデル
│   │   ├── services/        # ビジネスロジック
│   │   │   └── openai_advice_service.rb
│   │   └── serializers/     # JSON API シリアライザー
│   │
│   ├── config/              # Rails設定
│   │   ├── routes.rb
│   │   └── database.yml
│   │
│   ├── db/                  # データベース
│   │   ├── migrate/         # マイグレーション
│   │   └── seeds.rb
│   │
│   ├── spec/                # RSpecテスト
│   │   ├── models/
│   │   ├── requests/
│   │   └── services/
│   │
│   ├── Dockerfile           # バックエンド用Dockerfile
│   └── Gemfile
│
├── docker/                  # 🆕 Docker設定ディレクトリ
│   ├── docker-compose.yml   # 開発環境用
│   ├── docker-compose.prod.yml # 本番環境用
│   └── nginx/               # Nginx設定（本番用）
│       └── nginx.conf
│
├── .gitignore               # ✅ 統合版gitignore
└── README.md
```

### 主要機能設計

#### 🦍 アンガーログ機能
- **記録**: 感情・状況・トリガー・強度(1-10)
- **一覧**: カード形式・検索・フィルタ
- **分析**: 傾向グラフ・統計

#### 🎯 傾向分析（D3.js）
- **バブルマップ**: トリガーワード × 発生頻度
- **時系列分析**: 感情の変化トレンド
- **統計ダッシュボード**: 改善率・ストリーク

#### 🤖 AI相談機能
- **チャット形式**: リアルタイム相談
- **個別アドバイス**: ログ分析ベース
- **学習機能**: 過去の相談履歴活用

#### 📅 感情カレンダー
- **日別記録**: 感情状態のビジュアライズ
- **月間ビュー**: パターン発見
- **統計表示**: 月間・週間サマリー

## 📈 開発状況

### フェーズ1: 基盤構築 ✅
- [x] 技術調査・選定完了
- [x] フロントエンド環境構築完了
- [x] ゴリラテーマシステム完了
- [x] 開発効率化ツール設定完了
- [x] テスト環境構築完了

### フェーズ2: 基本機能 🚧
- [ ] 基本レイアウト実装
- [ ] 認証システム実装
- [ ] アンガーログCRUD機能
- [ ] Rails API基盤構築

### フェーズ3: 高度機能 📋
- [ ] D3.js バブルマップ実装
- [ ] AI相談機能実装
- [ ] 感情カレンダー実装
- [ ] デプロイ・運用開始

## 🧪 テスト

```bash
# 全テスト実行
yarn test

# カバレッジ確認
yarn test:coverage

# 特定ファイルのテスト
yarn test Button.test.tsx

# ウォッチモード
yarn test:watch
```

### テスト方針
- **単体テスト**: 全コンポーネント・関数
- **統合テスト**: ページレベル
- **E2Eテスト**: 主要ユーザーフロー
- **視覚回帰テスト**: Storybook + Chromatic

## 🚀 デプロイ

### ステージング
```bash
# Vercel Preview
git push origin feature-branch
# → 自動でプレビューデプロイ
```

### プロダクション
```bash
# Vercel Production
git push origin main
# → 自動でプロダクションデプロイ
```

## 🤝 コントリビューション

### 開発フロー
1. Issue作成・アサイン
2. Feature branchでコーディング
3. `yarn pre-commit`でコード品質チェック
4. Pull Request作成
5. レビュー・マージ

### コード規約
- **TypeScript**: 型安全性を最優先
- **React**: 関数コンポーネント + Hooks
- **Material-UI**: ゴリラテーマ活用
- **テスト**: 重要機能は必須

## 📞 サポート

### 関連リンク
- **本番環境**: TBD
- **ステージング**: TBD  
- **Storybook**: TBD
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