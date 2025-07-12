# Angori（アンゴリ）

🦍 ゴリラのアンガーマネジメントアプリ

## 概要

Angoriは、アンガーマネジメントをサポートするWebアプリケーションです。感情記録、怒りの傾向分析、AIアドバイス機能を通じて、健康的な感情管理をサポートします。

## 🏗 技術スタック

### フロントエンド
- **Next.js 15** (App Router)
- **React 19** + **TypeScript 5.0+**
- **Material-UI v6** (ゴリラテーマ)
- **D3.js** (怒りの傾向バブルマップ)
- **Zustand** (状態管理)

### バックエンド
- **Ruby on Rails 7.1** (API mode)
- **PostgreSQL 16+**
- **JWT認証** (Devise + Devise-JWT)
- **OpenAI API** (GPT-4.1 mini)

### インフラ
- **フロントエンド**: Vercel ($0/月)
- **バックエンド**: Render ($7/月)
- **データベース**: Neon PostgreSQL ($0/月)

## 📚 ドキュメント

- [技術調査報告書](./docs/technical-research-report.md)
- [プロジェクト管理](./docs/ProjectManagement/)
- [UI設計サンプル](./docs/)

## 🚀 セットアップ

### 前提条件
- Node.js 20 LTS
- Ruby 3.2+
- Docker & Docker Compose
- Yarn

### ローカル開発環境

```bash
# リポジトリクローン
git clone https://github.com/yoshihama-nineball/Angori.git
cd Angori

# フロントエンド
cd frontend
yarn install
yarn dev

# バックエンド（予定）
cd backend
bundle install
rails server
```


### Docker環境
# 全体起動
docker-compose up

# フロントエンド
docker-compose exec frontend yarn dev

# バックエンド
docker-compose exec backend rails server

### 主要機能
- AI相談: アンガーログをチャットの質問形式の記録・OpenAI GPT-4.1 miniによるアドバイス
- 傾向分析: D3.jsによる怒りの傾向バブルマップ
- 感情記録: アンガーログの記録をもとにした、日々の感情状態をカレンダーで記録

### プロジェクト構成

Angori/
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
│   └── sample-*.html        # UIデザインサンプル
│
├── frontend/                # Next.js フロントエンド
│   ├── app/                 # App Router
│   │   ├── (auth)/          # 認証関連ルート
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   │
│   │   ├── actions/         # 🆕 Server Actions
│   │   │   ├── auth.ts      # loginAction, registerAction, logoutAction
│   │   │   └── anger-log.ts # createAngerLogAction, deleteAngerLogAction (オプション)
│   │   │
│   │   ├── dashboard/       # ダッシュボード（ホーム）
│   │   ├── records/         # アンガーログ記録・一覧
│   │   ├── calendar/        # 感情記録カレンダー
│   │   ├── analysis/        # 傾向分析・バブルマップ
│   │   ├── consultation/    # AI相談室
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/          # 共通コンポーネント
│   │   ├── layout/          # レイアウト関連
│   │   │   ├── Header/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Header.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── FooterNav/   # スマホ4タブナビ
│   │   │   │   ├── FooterNav.tsx
│   │   │   │   ├── FooterNav.test.tsx
│   │   │   │   └── index.ts
│   │   │   └── Sidebar/     # PC用サイドバー
│   │   │       ├── Sidebar.tsx
│   │   │       ├── Sidebar.test.tsx
│   │   │       └── index.ts
│   │   ├── ui/              # 基本UI要素
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   ├── Button.stories.tsx  # Storybook
│   │   │   │   └── index.ts
│   │   │   ├── Card/
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Card.test.tsx
│   │   │   │   └── index.ts
│   │   │   └── Modal/
│   │   │       ├── Modal.tsx
│   │   │       ├── Modal.test.tsx
│   │   │       └── index.ts
│   │   └── feedback/        # ローディング・アラート
│   │       ├── LoadingSpinner/
│   │       │   ├── LoadingSpinner.tsx
│   │       │   ├── LoadingSpinner.test.tsx
│   │       │   └── index.ts
│   │       └── Alert/
│   │           ├── Alert.tsx
│   │           ├── Alert.test.tsx
│   │           └── index.ts
│   │
│   ├── features/            # 機能別コンポーネント
│   │   ├── auth/            # 認証機能
│   │   │   ├── components/  # LoginForm, RegisterForm等
│   │   │   │   ├── LoginForm/
│   │   │   │   │   ├── LoginForm.tsx
│   │   │   │   │   ├── LoginForm.test.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   └── RegisterForm/
│   │   │   │       ├── RegisterForm.tsx
│   │   │   │       ├── RegisterForm.test.tsx
│   │   │   │       └── index.ts
│   │   │   ├── hooks/       # 🔄 useAuth（認証状態管理のみ）
│   │   │   │   ├── useAuth.ts
│   │   │   │   └── useAuth.test.ts
│   │   │   └── types/
│   │   ├── anger-logs/      # アンガーログ機能
│   │   │   ├── components/  # LogItem, LogForm等
│   │   │   │   ├── LogItem/
│   │   │   │   │   ├── LogItem.tsx
│   │   │   │   │   ├── LogItem.test.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   └── LogForm/
│   │   │   │       ├── LogForm.tsx
│   │   │   │       ├── LogForm.test.tsx
│   │   │   │       └── index.ts
│   │   │   ├── hooks/       # useAngerLog等
│   │   │   │   ├── useAngerLog.ts
│   │   │   │   └── useAngerLog.test.ts
│   │   │   └── types/
│   │   ├── consultation/    # AI相談機能
│   │   │   ├── components/  # ChatInterface, AdviceCard等
│   │   │   │   ├── ChatInterface/
│   │   │   │   │   ├── ChatInterface.tsx
│   │   │   │   │   ├── ChatInterface.test.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   └── AdviceCard/
│   │   │   │       ├── AdviceCard.tsx
│   │   │   │       ├── AdviceCard.test.tsx
│   │   │   │       └── index.ts
│   │   │   └── hooks/       # useAIConsultation等
│   │   │       ├── useAIConsultation.ts
│   │   │       └── useAIConsultation.test.ts
│   │   ├── visualization/   # 傾向分析・D3.js
│   │   │   ├── components/  # BubbleMap, TrendChart等
│   │   │   │   ├── BubbleMap/
│   │   │   │   │   ├── BubbleMap.tsx
│   │   │   │   │   ├── BubbleMap.test.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   └── TrendChart/
│   │   │   │       ├── TrendChart.tsx
│   │   │   │       ├── TrendChart.test.tsx
│   │   │   │       └── index.ts
│   │   │   ├── hooks/       # useAngerAnalysis等
│   │   │   │   ├── useAngerAnalysis.ts
│   │   │   │   └── useAngerAnalysis.test.ts
│   │   │   └── d3-utils/    # D3.js ヘルパー関数
│   │   │       ├── bubbleChart.ts
│   │   │       ├── bubbleChart.test.ts
│   │   │       ├── trendLine.ts
│   │   │       └── trendLine.test.ts
│   │   └── calendar/        # 感情記録カレンダー
│   │       ├── components/  # EmotionCalendar等
│   │       │   └── EmotionCalendar/
│   │       │       ├── EmotionCalendar.tsx
│   │       │       ├── EmotionCalendar.test.tsx
│   │       │       └── index.ts
│   │       └── hooks/       # useEmotionCalendar等
│   │           ├── useEmotionCalendar.ts
│   │           └── useEmotionCalendar.test.ts
│   │
│   ├── lib/                 # ユーティリティ・設定
│   │   ├── api.ts           # Rails API クライアント
│   │   ├── api.test.ts      # API関数のテスト
│   │   ├── auth/            # 🔄 JWT認証管理
│   │   │   ├── dal.ts       # verifySession等（Server Actions用）
│   │   │   ├── dal.test.ts  # 認証ロジックのテスト
│   │   │   ├── session.ts   # 🆕 createSession, deleteSession
│   │   │   └── session.test.ts
│   │   ├── utils.ts
│   │   └── utils.test.ts
│   │
│   ├── store/               # Zustand状態管理
│   │   ├── authStore.ts     # 認証状態
│   │   ├── authStore.test.ts
│   │   ├── angerLogStore.ts # アンガーログ状態
│   │   ├── angerLogStore.test.ts
│   │   ├── uiStore.ts       # UI状態
│   │   └── uiStore.test.ts
│   │
│   ├── types/               # TypeScript型定義
│   │   ├── api.ts           # API関連型
│   │   ├── anger.ts         # アンガーログ関連型
│   │   ├── visualization.ts # D3.js・分析関連型
│   │   └── user.ts          # ユーザー関連型
│   │
│   ├── theme/               # MUIテーマ
│   │   └── gorilla.ts       # ゴリラテーマ設定
│   │
│   ├── __tests__/           # 統合テスト・E2Eテスト
│   ├── __mocks__/           # モックファイル
│   ├── Dockerfile           # フロントエンド用Dockerfile
│   └── package.json
│
├── backend/                 # Rails API
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
└── README.md

### 関連リンク

本番環境: TBD
ステージング: TBD
技術調査報告書: 詳細

### 開発状況

✅ 技術調査・選定完了
🚧 フロントエンド環境構築中
📋 バックエンド環境構築予定
📋 認証機能実装予定

👥 コントリビューター

[yoshihama-nineball](https://github.com/yoshihama-nineball)