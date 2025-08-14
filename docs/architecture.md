# アーキテクチャガイド

Angoriの技術アーキテクチャ・設計思想・プロジェクト構成の詳細ドキュメントです。

## 🏛 システムアーキテクチャ

### アーキテクチャ概要

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer                             │
├─────────────────────────────────────────────────────────────┤
│  Next.js 15 Frontend (React 19 + TypeScript)               │
│  ├─ Material-UI v6 (Gorilla Theme)                         │
│  ├─ D3.js v7 (Data Visualization)                          │
│  ├─ Zustand (State Management)                             │
│  └─ React Hook Form + Zod (Form & Validation)              │
├─────────────────────────────────────────────────────────────┤
│                    API Layer                               │
├─────────────────────────────────────────────────────────────┤
│  Rails 7.1.5 API (Ruby 3.2.3)                            │
│  ├─ Devise + JWT Authentication                            │
│  ├─ RESTful API Endpoints                                  │
│  └─ OpenAI API Integration                                 │
├─────────────────────────────────────────────────────────────┤
│                    Data Layer                              │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL 16+ (Primary Database)                         │
│  Redis (Session & Cache)                                   │
└─────────────────────────────────────────────────────────────┘
```

### 技術選定理由

#### フロントエンド

**Next.js 15 + React 19**
- ✅ App Router による直感的なルーティング
- ✅ Turbopack による高速開発体験
- ✅ Server Components/Actions でのフルスタック開発
- ✅ TypeScript ファーストの優れた開発体験

**Material-UI v6**
- ✅ Googleのデザインシステム準拠
- ✅ アクセシビリティ対応
- ✅ カスタムテーマ（ゴリラテーマ）の柔軟性
- ✅ React 19 対応

**D3.js v7**
- ✅ データ可視化のデファクトスタンダード
- ✅ アンガーマネジメントに特化したバブルマップ実装
- ✅ SVG/Canvas による高性能レンダリング

#### バックエンド

**Ruby on Rails 7.1.5**
- ✅ API開発における豊富な実績
- ✅ 規約による開発速度向上
- ✅ ActiveRecord による優れたORM
- ✅ Gem エコシステムの充実

**PostgreSQL 16+**
- ✅ JSON型によるフレキシブルなデータ構造
- ✅ 高度なクエリ機能（分析用途）
- ✅ 本格運用での信頼性

**JWT認証**
- ✅ ステートレス認証による スケーラビリティ
- ✅ SPA アプリケーションとの親和性
- ✅ モバイルアプリ対応の将来性

## 📂 プロジェクト構成

### ディレクトリ構造

```
Angori/ (ルートディレクトリ)
├── 🐳 docker-compose.yml        # Docker統合環境設定
├── 🐳 .env.docker              # Docker環境変数
├── 🐳 docker/                  # Docker管理スクリプト
│   └── scripts/
│       ├── setup.sh            # 自動セットアップ
│       └── cleanup.sh          # 環境クリーンアップ
│
├── .github/                   # GitHub設定・ワークフロー
│   ├── ISSUE_TEMPLATE/        # Issueテンプレート
│   └── workflows/             # CI/CDワークフロー
│       ├── frontend.yml       # フロントエンドCI/CD
│       └── backend.yml        # バックエンドCI/CD
│
├── docs/                      # プロジェクト設計・仕様書
│   ├── DEVELOPMENT.md         # 開発者ガイド
│   ├── ARCHITECTURE.md        # アーキテクチャ（このファイル）
│   ├── DEPLOYMENT.md          # デプロイメントガイド
│   ├── CONTRIBUTING.md        # コントリビューションガイド
│   ├── ProjectManagement/     # プロジェクト管理
│   └── DesignDocuments/       # 設計書
│
├── frontend/                  # Next.js フロントエンド
│   ├── 🐳 Dockerfile           # フロントエンド用コンテナ
│   ├── src/
│   │   ├── app/               # App Router
│   │   │   ├── (auth)/        # 認証関連ルート
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── actions/       # Server Actions
│   │   │   │   ├── auth.ts        # 認証アクション
│   │   │   │   └── anger-log.ts   # アンガーログアクション
│   │   │   ├── dashboard/     # ダッシュボード
│   │   │   ├── records/       # アンガーログ記録・一覧
│   │   │   ├── calendar/      # 感情記録カレンダー
│   │   │   ├── analysis/      # 傾向分析・バブルマップ
│   │   │   ├── consultation/  # AI相談室
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   │
│   │   ├── components/        # 共通コンポーネント
│   │   │   ├── layout/        # レイアウト関連
│   │   │   │   ├── Header/
│   │   │   │   ├── FooterNav/ # スマホ4タブナビ
│   │   │   │   └── Sidebar/   # PC用サイドバー
│   │   │   ├── ui/            # 基本UI要素
│   │   │   │   ├── Button/
│   │   │   │   ├── Card/
│   │   │   │   └── Modal/
│   │   │   ├── providers/     # Context Providers
│   │   │   └── feedback/      # ローディング・アラート
│   │   │
│   │   ├── features/          # 機能別コンポーネント
│   │   │   ├── auth/          # 認証機能
│   │   │   │   ├── components/    # LoginForm, RegisterForm等
│   │   │   │   ├── hooks/         # useAuth（認証状態管理）
│   │   │   │   └── types/
│   │   │   ├── anger-logs/    # アンガーログ機能
│   │   │   │   ├── components/    # LogItem, LogForm等
│   │   │   │   ├── hooks/         # useAngerLog等
│   │   │   │   └── types/
│   │   │   ├── consultation/  # AI相談機能
│   │   │   │   ├── components/    # ChatInterface, AdviceCard等
│   │   │   │   └── hooks/         # useAIConsultation等
│   │   │   ├── visualization/ # 傾向分析・D3.js
│   │   │   │   ├── components/    # BubbleMap, TrendChart等
│   │   │   │   ├── hooks/         # useAngerAnalysis等
│   │   │   │   └── d3-utils/      # D3.js ヘルパー関数
│   │   │   └── calendar/      # 感情記録カレンダー
│   │   │       ├── components/    # EmotionCalendar等
│   │   │       └── hooks/         # useEmotionCalendar等
│   │   │
│   │   ├── lib/               # ユーティリティ・設定
│   │   │   ├── api/           # API関数群
│   │   │   │   ├── angerLogs.ts   # アンガーログAPI
│   │   │   │   ├── auth.ts        # 認証API
│   │   │   │   ├── consultation.ts # AI相談API
│   │   │   │   └── analytics.ts   # 分析API
│   │   │   ├── api.ts         # Rails API クライアント（base）
│   │   │   ├── auth/          # JWT認証管理
│   │   │   │   ├── dal.ts         # verifySession等（Server Actions用）
│   │   │   │   └── session.ts     # createSession, deleteSession
│   │   │   └── utils.ts
│   │   │
│   │   ├── store/             # Zustand状態管理
│   │   │   ├── authStore.ts       # 認証状態
│   │   │   ├── angerLogStore.ts   # アンガーログ状態
│   │   │   └── uiStore.ts         # UI状態
│   │   │
│   │   ├── types/             # TypeScript型定義
│   │   │   ├── api.ts             # API関連型
│   │   │   ├── anger.ts           # アンガーログ関連型
│   │   │   ├── visualization.ts   # D3.js・分析関連型
│   │   │   └── user.ts            # ユーザー関連型
│   │   │
│   │   └── theme/             # MUIゴリラテーマ
│   │       └── gorilla.ts         # ゴリラテーマ設定
│   │
│   ├── .vscode/               # VS Code設定
│   ├── __tests__/             # 統合テスト・E2Eテスト
│   ├── __mocks__/             # モックファイル
│   ├── .env.local
│   ├── .eslintrc.json         # ESLint設定
│   ├── .prettierrc            # Prettier設定
│   ├── jest.config.js         # Jest設定
│   └── package.json
│
├── backend/                   # Rails API
│   ├── 🐳 Dockerfile           # バックエンド用コンテナ
│   ├── app/
│   │   ├── controllers/       # APIコントローラー
│   │   │   └── api/v1/        # API v1
│   │   │       ├── auth/          # 認証関連
│   │   │       │   ├── sessions_controller.rb  # ログイン/ログアウト
│   │   │       │   └── registrations_controller.rb  # ユーザー登録
│   │   │       ├── anger_logs_controller.rb   # アンガーログCRUD
│   │   │       ├── consultations_controller.rb # AI相談
│   │   │       └── analytics_controller.rb    # 分析データ
│   │   ├── models/            # ActiveRecordモデル
│   │   │   ├── user.rb            # ユーザーモデル（認証付き）
│   │   │   ├── anger_log.rb       # アンガーログモデル
│   │   │   ├── trigger_word.rb    # トリガーワード
│   │   │   └── ai_advice.rb       # AI アドバイス履歴
│   │   ├── services/          # ビジネスロジック
│   │   │   ├── openai_service.rb      # OpenAI API統合
│   │   │   ├── anger_analysis_service.rb  # 感情分析
│   │   │   └── advice_generation_service.rb  # アドバイス生成
│   │   └── serializers/       # API レスポンス整形
│   │       ├── user_serializer.rb
│   │       ├── anger_log_serializer.rb
│   │       └── analysis_serializer.rb
│   │
│   ├── config/                # Rails設定
│   │   ├── initializers/      # 初期化設定
│   │   │   ├── cors.rb            # CORS設定
│   │   │   ├── devise.rb          # 認証設定
│   │   │   └── openai.rb          # OpenAI設定
│   │   ├── routes.rb          # ルーティング
│   │   ├── database.yml       # DB設定
│   │   └── credentials.yml.enc # 秘匿情報
│   │
│   ├── db/                    # データベース
│   │   ├── migrate/           # マイグレーション
│   │   │   ├── 001_devise_create_users.rb
│   │   │   ├── 002_create_anger_logs.rb
│   │   │   ├── 003_create_trigger_words.rb
│   │   │   └── 004_create_ai_advices.rb
│   │   └── seeds.rb
│   │
│   ├── spec/                  # RSpecテスト
│   │   ├── models/            # モデルテスト
│   │   ├── requests/          # APIテスト
│   │   ├── services/          # サービステスト
│   │   └── factories/         # テストデータ
│   │
│   ├── .rubocop.yml           # RuboCop設定
│   └── Gemfile                # 依存関係
│
├── .gitignore                 # 統合版gitignore
└── README.md                  # プロジェクト概要（簡潔版）
```

## 🗃 データベース設計

### ERD（Entity Relationship Diagram）

```
                            ┌─────────────────────────────────────┐
                            │                Users                │
                            ├─────────────────────────────────────┤
                            │ id (PK)                             │
                            │ email (UNIQUE)                      │
                            │ encrypted_password                  │
                            │ name                                │
                            │ reset_password_token                │
                            │ reset_password_sent_at              │
                            │ remember_created_at                 │
                            │ created_at, updated_at              │
                            └─────────────────────────────────────┘
                                           │
                          ┌────────────────┼────────────────┐
                          ▼                ▼                ▼
    ┌─────────────────────────────┐ ┌─────────────────┐ ┌─────────────────────────┐
    │        AngerLogs            │ │ CalmingPoints   │ │      TriggerWords       │
    ├─────────────────────────────┤ ├─────────────────┤ ├─────────────────────────┤
    │ id (PK)                     │ │ id (PK)         │ │ id (PK)                 │
    │ user_id (FK) → users.id     │ │ user_id (FK)    │ │ user_id (FK) → users.id │
    │ anger_level (1-10)          │ │ total_points    │ │ name                    │
    │ occurred_at                 │ │ current_level   │ │ count                   │
    │ location                    │ │ streak_days     │ │ anger_level_avg         │
    │ situation_description       │ │ last_action_date│ │ category                │
    │ trigger_words               │ │ level_achievements│ │ last_triggered_at      │
    │ emotions_felt (JSONB)       │ │ milestone_flags │ │ created_at, updated_at  │
    │ ai_advice                   │ │ created_at      │ └─────────────────────────┘
    │ reflection                  │ │ updated_at      │              │
    │ created_at, updated_at      │ └─────────────────┘              │
    └─────────────────────────────┘                                  │
                                   ┌─────────────────────────────────┘
                                   ▼
                         ┌─────────────────────────┐
                         │    ContactMessages      │
                         ├─────────────────────────┤
                         │ id (PK)                 │
                         │ user_id (FK, NULL可)    │
                         │ email                   │
                         │ name                    │
                         │ category                │
                         │ subject                 │
                         │ message                 │
                         │ status                  │
                         │ admin_reply             │
                         │ replied_at              │
                         │ created_at, updated_at  │
                         └─────────────────────────┘

    ┌─────────────────── MVP以降拡張テーブル ────────────────────┐
    │                                                            │
    ▼                          ▼                                ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────┐
│     Badges      │    │   UserBadges    │    │    WiseSayings      │
├─────────────────┤    ├─────────────────┤    ├─────────────────────┤
│ id (PK)         │◄───┤ badge_id (FK)   │    │ id (PK)             │
│ name (UNIQUE)   │    │ id (PK)         │    │ content             │
│ description     │    │ user_id (FK)    │◄─┐ │ author              │
│ icon_url        │    │ earned_at       │  │ │ category            │
│ badge_type      │    │ created_at      │  │ │ anger_level_range   │
│ requirements    │    │ updated_at      │  │ │ is_active           │
│ points_reward   │    └─────────────────┘  │ │ display_count       │
│ is_active       │                         │ │ created_at          │
│ created_at      │    ┌─────────────────┐  │ │ updated_at          │
│ updated_at      │    │    Reminders    │  │ └─────────────────────┘
└─────────────────┘    ├─────────────────┤  │
                       │ id (PK)         │  │
                       │ user_id (FK)    │◄─┘
                       │ reminder_type   │
                       │ title           │
                       │ message         │
                       │ schedule_time   │
                       │ days_of_week    │
                       │ is_active       │
                       │ last_sent_at    │
                       │ created_at      │
                       │ updated_at      │
                       └─────────────────┘
```

### テーブル詳細

#### MVP必須テーブル（5テーブル）

##### Users テーブル
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY,
  email VARCHAR NOT NULL UNIQUE,
  encrypted_password VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  reset_password_token VARCHAR,
  reset_password_sent_at TIMESTAMP,
  remember_created_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- インデックス
CREATE UNIQUE INDEX index_users_on_email ON users(email);
```

##### AngerLogs テーブル
```sql
CREATE TABLE anger_logs (
  id BIGINT PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  -- 基本怒り情報
  anger_level INTEGER NOT NULL CHECK (anger_level BETWEEN 1 AND 10),
  occurred_at TIMESTAMP NOT NULL,
  location VARCHAR,
  -- 状況・原因
  situation_description TEXT NOT NULL,
  trigger_words VARCHAR,
  emotions_felt JSONB,
  -- AIアドバイス
  ai_advice TEXT,
  -- 振り返り
  reflection TEXT,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- インデックス
CREATE INDEX index_anger_logs_on_user_id ON anger_logs(user_id);
CREATE INDEX index_anger_logs_on_occurred_at ON anger_logs(occurred_at);
CREATE INDEX index_anger_logs_on_user_id_and_occurred_at ON anger_logs(user_id, occurred_at);
CREATE INDEX index_anger_logs_on_anger_level ON anger_logs(anger_level);
CREATE INDEX index_anger_logs_on_emotions_felt ON anger_logs USING GIN(emotions_felt);
```

##### CalmingPoints テーブル
```sql
CREATE TABLE calming_points (
  id BIGINT PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  total_points INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  streak_days INTEGER DEFAULT 0,
  last_action_date DATE,
  level_achievements JSONB,
  milestone_flags JSONB,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  CHECK (total_points >= 0 AND current_level >= 1 AND streak_days >= 0)
);

-- インデックス
CREATE UNIQUE INDEX index_calming_points_on_user_id ON calming_points(user_id);
CREATE INDEX index_calming_points_on_current_level ON calming_points(current_level);
```

##### TriggerWords テーブル（統計データ）
```sql
CREATE TABLE trigger_words (
  id BIGINT PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  count INTEGER DEFAULT 1,
  anger_level_avg FLOAT,
  category VARCHAR,
  last_triggered_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- インデックス
CREATE INDEX index_trigger_words_on_user_id_and_count ON trigger_words(user_id, count);
CREATE UNIQUE INDEX index_trigger_words_on_user_id_and_name ON trigger_words(user_id, name);
CREATE INDEX index_trigger_words_on_category ON trigger_words(category);
```

##### ContactMessages テーブル
```sql
CREATE TABLE contact_messages (
  id BIGINT PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  email VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  category VARCHAR,
  subject VARCHAR NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed')),
  admin_reply TEXT,
  replied_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- インデックス
CREATE INDEX index_contact_messages_on_user_id ON contact_messages(user_id);
CREATE INDEX index_contact_messages_on_status ON contact_messages(status);
CREATE INDEX index_contact_messages_on_category ON contact_messages(category);
```

#### MVP以降拡張テーブル（4テーブル）

##### Badges テーブル
```sql
CREATE TABLE badges (
  id BIGINT PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon_url VARCHAR,
  badge_type VARCHAR,
  requirements JSONB,
  points_reward INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- インデックス
CREATE UNIQUE INDEX index_badges_on_name ON badges(name);
CREATE INDEX index_badges_on_badge_type ON badges(badge_type);
CREATE INDEX index_badges_on_is_active ON badges(is_active);
```

##### UserBadges テーブル
```sql
CREATE TABLE user_badges (
  id BIGINT PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id BIGINT NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- インデックス
CREATE INDEX index_user_badges_on_user_id ON user_badges(user_id);
CREATE INDEX index_user_badges_on_badge_id ON user_badges(badge_id);
CREATE UNIQUE INDEX index_user_badges_on_user_id_and_badge_id ON user_badges(user_id, badge_id);
CREATE INDEX index_user_badges_on_earned_at ON user_badges(earned_at);
```

##### WiseSayings テーブル
```sql
CREATE TABLE wise_sayings (
  id BIGINT PRIMARY KEY,
  content TEXT NOT NULL,
  author VARCHAR,
  category VARCHAR,
  anger_level_range VARCHAR,
  is_active BOOLEAN DEFAULT true,
  display_count INTEGER DEFAULT 0,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- インデックス
CREATE INDEX index_wise_sayings_on_category ON wise_sayings(category);
CREATE INDEX index_wise_sayings_on_anger_level_range ON wise_sayings(anger_level_range);
CREATE INDEX index_wise_sayings_on_is_active ON wise_sayings(is_active);
```

##### Reminders テーブル
```sql
CREATE TABLE reminders (
  id BIGINT PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reminder_type VARCHAR,
  title VARCHAR NOT NULL,
  message TEXT,
  schedule_time TIME,
  days_of_week JSONB,
  is_active BOOLEAN DEFAULT true,
  last_sent_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- インデックス
CREATE INDEX index_reminders_on_user_id ON reminders(user_id);
CREATE INDEX index_reminders_on_reminder_type ON reminders(reminder_type);
CREATE INDEX index_reminders_on_is_active ON reminders(is_active);
CREATE INDEX index_reminders_on_schedule_time ON reminders(schedule_time);
```

## 🔌 API設計

### RESTful API エンドポイント

#### 認証API
```
POST   /api/v1/auth/register     # ユーザー登録
POST   /api/v1/auth/login        # ログイン
DELETE /api/v1/auth/logout       # ログアウト
GET    /api/v1/auth/me           # 現在のユーザー情報
```

#### アンガーログAPI
```
GET    /api/v1/anger_logs        # ログ一覧取得
POST   /api/v1/anger_logs        # ログ作成
GET    /api/v1/anger_logs/:id    # ログ詳細取得
PUT    /api/v1/anger_logs/:id    # ログ更新
DELETE /api/v1/anger_logs/:id    # ログ削除
```

#### 分析API
```
GET    /api/v1/analytics/trends        # 傾向分析データ
GET    /api/v1/analytics/bubble_map    # バブルマップ用データ
GET    /api/v1/analytics/calendar      # カレンダー用データ
GET    /api/v1/analytics/summary       # サマリー統計
```

#### AI相談API
```
POST   /api/v1/consultations           # AI相談リクエスト
GET    /api/v1/consultations           # 相談履歴取得
GET    /api/v1/consultations/:id       # 相談詳細取得
```

### API レスポンス例

#### アンガーログ作成
```http
POST /api/v1/anger_logs
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>

{
  "anger_log": {
    "anger_level": 7,
    "trigger_event": "会議での批判的なコメント",
    "coping_method": "深呼吸を10回",
    "notes": "同僚の発言にイライラした",
    "occurred_at": "2025-07-26T14:30:00Z",
    "trigger_words": ["批判", "否定", "プレッシャー"]
  }
}

# Response
{
  "id": 123,
  "anger_level": 7,
  "trigger_event": "会議での批判的なコメント",
  "coping_method": "深呼吸を10回",
  "notes": "同僚の発言にイライラした",
  "occurred_at": "2025-07-26T14:30:00Z",
  "trigger_words": [
    {"word": "批判", "intensity": 4},
    {"word": "否定", "intensity": 3},
    {"word": "プレッシャー", "intensity": 5}
  ],
  "created_at": "2025-07-26T14:35:00Z",
  "updated_at": "2025-07-26T14:35:00Z"
}
```

#### 分析データ取得
```http
GET /api/v1/analytics/bubble_map?period=30days
Authorization: Bearer <JWT_TOKEN>

# Response
{
  "data": [
    {
      "trigger_word": "批判",
      "frequency": 15,
      "avg_anger_level": 6.2,
      "effectiveness_score": 3.8,
      "size": 25,
      "color": "#ff6b6b"
    },
    {
      "trigger_word": "締切",
      "frequency": 8,
      "avg_anger_level": 7.1,
      "effectiveness_score": 4.2,
      "size": 18,
      "color": "#4ecdc4"
    }
  ],
  "meta": {
    "period": "30days",
    "total_logs": 45,
    "avg_anger_level": 5.8
  }
}
```

## 🎨 フロントエンド設計

### コンポーネント設計思想

#### Atomic Design 採用
```
Atoms (原子)
├── Button/          # 基本ボタン
├── Input/           # 入力フィールド
├── Icon/            # アイコン
└── Label/           # ラベル

Molecules (分子)
├── FormField/       # ラベル + 入力 + エラー
├── SearchBox/       # 検索ボックス
└── AngerLevelSlider/ # 怒りレベルスライダー

Organisms (有機体)
├── Header/          # ヘッダー
├── AngerLogForm/    # ログ作成フォーム
├── BubbleMap/       # D3.js バブルマップ
└── AIConsultation/  # AI相談インターフェース

Templates (テンプレート)
├── AuthLayout/      # 認証画面レイアウト
├── DashboardLayout/ # ダッシュボードレイアウト
└── AnalysisLayout/  # 分析画面レイアウト

Pages (ページ)
├── LoginPage/       # ログインページ
├── DashboardPage/   # ダッシュボード
├── RecordsPage/     # 記録一覧
└── AnalysisPage/    # 分析画面
```

### 状態管理設計（Zustand）

#### Store 構成
```typescript
// authStore.ts - 認証状態
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
}

// angerLogStore.ts - アンガーログ状態
interface AngerLogState {
  logs: AngerLog[]
  currentLog: AngerLog | null
  loading: boolean
  fetchLogs: () => Promise<void>
  createLog: (log: CreateAngerLogRequest) => Promise<void>
  updateLog: (id: number, log: UpdateAngerLogRequest) => Promise<void>
  deleteLog: (id: number) => Promise<void>
}

// uiStore.ts - UI状態
interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  notifications: Notification[]
  loading: boolean
  toggleSidebar: () => void
  setTheme: (theme: 'light' | 'dark') => void
  addNotification: (notification: Notification) => void
}
```

### ゴリラテーマシステム

#### テーマ構成
```typescript
// theme/gorilla.ts
export const gorillaTheme = createTheme({
  palette: {
    primary: {
      main: '#8B4513',      // サドルブラウン（ゴリラ）
      light: '#A0522D',     // シエンナ
      dark: '#654321',      // ダークブラウン
    },
    secondary: {
      main: '#FFD700',      // ゴールド（バナナ）
      light: '#FFFF99',     // ライトイエロー
      dark: '#FFB347',      // ピーチ
    },
    // 怒りレベル別カラーパレット
    anger: {
      1: '#E8F5E8',         // 極薄緑（落ち着き）
      2: '#C8E6C9',         # 薄緑
      3: '#A5D6A7',         # 緑
      4: '#81C784',         # 明緑
      5: '#FFD54F',         # 黄色（注意）
      6: '#FFB74D',         # オレンジ
      7: '#FF8A65',         # 濃オレンジ
      8: '#FF7043',         # 赤オレンジ
      9: '#F44336',         # 赤（警告）
      10: '#C62828',        # 濃赤（危険）
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          background: 'linear-gradient(45deg, #8B4513 30%, #A0522D 90%)',
        }
      }
    }
  }
})
```

## 🧩 主要機能アーキテクチャ

### 1. 認証システム

#### JWT フロー
```
1. ユーザーログイン
   ↓
2. Rails: JWT生成（user.jti含む）
   ↓
3. Next.js: JWTをクッキーに保存
   ↓
4. API リクエスト: Authorization Headerに JWT
   ↓
5. Rails: JWT検証 + user.jti確認
```

#### Session Management
```typescript
// lib/auth/session.ts
export async function createSession(token: string) {
  const encryptedSession = await encrypt({ token })
  cookies().set('session', encryptedSession, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })
}
```

### 2. データ可視化（D3.js）

#### バブルマップ実装
```typescript
// features/visualization/d3-utils/bubbleChart.ts
export class BubbleChartRenderer {
  private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>
  private simulation: d3.Simulation<BubbleNode, undefined>

  constructor(container: HTMLElement, data: BubbleData[]) {
    this.svg = d3.select(container).append('svg')
    this.simulation = d3.forceSimulation<BubbleNode>()
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => d.radius + 2))
  }

  render(data: BubbleData[]) {
    const nodes = this.processData(data)
    this.updateSimulation(nodes)
    this.renderBubbles(nodes)
  }
}
```

### 3. AI相談機能

#### OpenAI統合アーキテクチャ
```ruby
# app/services/openai_service.rb
class OpenAIService
  def generate_advice(anger_log, user_context)
    prompt = build_prompt(anger_log, user_context)
    
    response = client.chat(
      parameters: {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: system_prompt },
          { role: "user", content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.7
      }
    )
    
    parse_response(response)
  end

  private

  def build_prompt(anger_log, user_context)
    # ユーザーの過去の傾向、現在の状況を考慮したプロンプト生成
  end
end
```

## 🚀 パフォーマンス最適化

### フロントエンド最適化

#### Next.js 最適化
```typescript
// next.config.js
const nextConfig = {
  experimental: {
    turbo: true,        // Turbopack使用
    optimizeCss: true,  # CSS最適化
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  }
}
```

#### Code Splitting
```typescript
// Dynamic imports for heavy components
const BubbleMap = dynamic(() => import('@/features/visualization/BubbleMap'), {
  loading: () => <LoadingSpinner />,
  ssr: false
})

const AIConsultation = dynamic(() => import('@/features/consultation/AIConsultation'), {
  loading: () => <LoadingSpinner />
})
```

### バックエンド最適化

#### データベース最適化
```ruby
# app/models/anger_log.rb
class AngerLog < ApplicationRecord
  # インデックス設定
  # INDEX: user_id, occurred_at (複合インデックス)
  # INDEX: anger_level (分析クエリ用)
  
  scope :for_analysis, ->(period) {
    includes(:trigger_words, :ai_advices)
      .where(occurred_at: period)
      .order(:occurred_at)
  }
  
  # N+1問題回避
  scope :with_associations, -> { includes(:trigger_words, :ai_advices) }
end
```

#### キャッシュ戦略
```ruby
# app/controllers/api/v1/analytics_controller.rb
class Api::V1::AnalyticsController < ApplicationController
  def bubble_map
    cache_key = "analytics:bubble_map:#{current_user.id}:#{params[:period]}"
    
    data = Rails.cache.fetch(cache_key, expires_in: 1.hour) do
      AngerAnalysisService.new(current_user).bubble_map_data(params[:period])
    end
    
    render json: data
  end
end
```

## 🔒 セキュリティ設計

### 認証・認可
```ruby
# app/controllers/application_controller.rb
class ApplicationController < ActionController::API
  before_action :authenticate_user!
  before_action :configure_permitted_parameters, if: :devise_controller?

  private

  def authenticate_user!
    token = request.headers['Authorization']&.split(' ')&.last
    return render_unauthorized unless token

    payload = JWT.decode(token, Rails.application.credentials.devise_jwt_secret_key!).first
    user = User.find_by(id: payload['sub'], jti: payload['jti'])
    
    return render_unauthorized unless user
    
    @current_user = user
  rescue JWT::DecodeError, JWT::ExpiredSignature
    render_unauthorized
  end
end
```

### CORS設定
```ruby
# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ['localhost:3000', 'https://angori.vercel.app']
    resource '/api/*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end
end
```

## 🧪 テスト戦略

### フロントエンドテスト
```typescript
// __tests__/features/auth/LoginForm.test.tsx
describe('LoginForm', () => {
  it('should submit form with valid credentials', async () => {
    const mockLogin = jest.fn()
    render(<LoginForm onLogin={mockLogin} />)
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /login/i }))
    
    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    })
  })
})
```

### バックエンドテスト
```ruby
# spec/requests/api/v1/anger_logs_spec.rb
RSpec.describe 'API::V1::AngerLogs', type: :request do
  let(:user) { create(:user) }
  let(:headers) { { 'Authorization' => "Bearer #{jwt_token_for(user)}" } }

  describe 'POST /api/v1/anger_logs' do
    let(:params) do
      {
        anger_log: {
          anger_level: 7,
          trigger_event: 'Meeting stress',
          coping_method: 'Deep breathing'
        }
      }
    end

    it 'creates anger log successfully' do
      post '/api/v1/anger_logs', params: params, headers: headers
      
      expect(response).to have_http_status(:created)
      expect(json['anger_level']).to eq(7)
      expect(AngerLog.count).to eq(1)
    end
  end
end
```

このアーキテクチャにより、スケーラブルで保守性の高いアンガーマネジメントアプリケーションを実現します。