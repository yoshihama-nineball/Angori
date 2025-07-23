// Angori Database Schema - 全カラムコメント版
// 🦍 ゴリラのアンガーマネジメントアプリ

Project angori {
  database_type: 'PostgreSQL'
  Note: '''
    Angori - ゴリラのアンガーマネジメントアプリ
    MVP → Phase2 の段階的実装対応
    全カラムにコメント追加で必要性精査
  '''
}

// ===============================
// MVP必須テーブル（5テーブル）
// ===============================

Table users {
  id bigint [primary key, note: 'プライマリキー（自動採番）']
  email varchar [not null, unique, note: 'メールアドレス（ログイン用・Devise必須）']
  encrypted_password varchar [not null, note: 'Deviseによる暗号化パスワード（必須）']
  name varchar [not null, note: 'ユーザー表示名（アプリ内表示用）']
  reset_password_token varchar [note: 'パスワードリセット用トークン（Devise自動管理）']
  reset_password_sent_at timestamp [note: 'パスワードリセット送信日時（Devise自動管理）']
  remember_created_at timestamp [note: 'ログイン記憶開始日時（Devise "Remember me"機能）']
  created_at timestamp [not null, note: 'レコード作成日時（Rails標準）']
  updated_at timestamp [not null, note: 'レコード更新日時（Rails標準）']
  
  Note: '👤 ユーザー認証・プロフィール（Devise標準構成）'
  
  Indexes {
    email [unique, note: 'メールアドレス検索・重複チェック用']
  }
}

Table anger_logs {
  id bigint [primary key, note: 'プライマリキー（自動採番）']
  user_id bigint [not null, note: 'ユーザーID（外部キー・必須）']
  
  // 🔥 基本怒り情報
  anger_level integer [not null, note: '怒りレベル（1-10段階・必須入力）']
  occurred_at timestamp [not null, note: '怒り発生日時（デフォルト現在時刻・調整可能）']
  location varchar [note: '発生場所（自由記述・任意）例：職場、家、電車内']
  
  // 📝 状況・原因
  situation_description text [not null, note: '状況説明（事実ベース・必須）認知と分離']
  trigger_words varchar [note: 'トリガー要因（選択式or自由記述・任意）']
  emotions_felt jsonb [note: '感情タグ配列（任意）["anger","sadness","fear"]']
  
  // 🤖 AIアドバイス
  ai_advice text [note: 'OpenAI GPT-4o-miniによる生成アドバイス（相談後に自動生成）']
  
  // 💭 振り返り
  reflection text [note: '後からの振り返り・気づき（任意・ユーザーが後で追記）']
  
  created_at timestamp [not null, note: 'レコード作成日時（Rails標準）']
  updated_at timestamp [not null, note: 'レコード更新日時（Rails標準）']
  
  Note: '😡 アンガーログ（相談・アドバイス統合）メインデータ'
  
  Indexes {
    user_id [note: 'ユーザー別ログ検索用']
    occurred_at [note: '時系列ソート用']
    (user_id, occurred_at) [note: 'ユーザー別時系列検索用（複合）']
    anger_level [note: 'レベル別分析用']
    emotions_felt [type: gin, note: 'JSONB全文検索用']
  }
}

Table calming_points {
  id bigint [primary key, note: 'プライマリキー（自動採番）']
  user_id bigint [not null, unique, note: 'ユーザーID（1対1関係・必須）']
  total_points integer [default: 0, note: '累計バナナポイント（ログ記録・相談等で獲得）']
  current_level integer [default: 1, note: '現在レベル（ポイントに応じて自動計算）']
  streak_days integer [default: 0, note: '連続記録日数（継続モチベーション用）']
  last_action_date date [note: '最終アクション日（ストリーク計算用）']
  level_achievements jsonb [note: 'レベル達成履歴（達成日時・レベル情報の配列）']
  milestone_flags jsonb [note: 'マイルストーン達成フラグ（初回相談・10回記録等）']
  created_at timestamp [not null, note: 'レコード作成日時（Rails標準）']
  updated_at timestamp [not null, note: 'レコード更新日時（Rails標準）']
  
  Note: '🍌 落ち着きポイント・スコア（ゲーミフィケーション）'
  
  Indexes {
    user_id [unique, note: '1対1関係保証用']
    current_level [note: 'レベル別ランキング用']
  }
}

Table trigger_words {
  id bigint [primary key, note: 'プライマリキー（自動採番）']
  user_id bigint [not null, note: 'ユーザーID（外部キー・必須）']
  name varchar [not null, note: 'トリガーワード名（D3.jsバブル表示用）']
  count integer [default: 1, note: '出現回数（バブルサイズ決定用）']
  anger_level_avg float [note: '平均怒りレベル（バブル色分け用）計算値']
  category varchar [note: 'カテゴリ分類（work/family/social/sensory/other）']
  last_triggered_at timestamp [note: '最終トリガー発生日時（分析用）']
  created_at timestamp [not null, note: 'レコード作成日時（Rails標準）']
  updated_at timestamp [not null, note: 'レコード更新日時（Rails標準）']
  
  Note: '⚡ トリガー分析（怒りの傾向マップ用・D3.js Packed Bubble Chart）'
  
  Indexes {
    (user_id, count) [note: 'ユーザー別頻度順ソート用（複合）']
    (user_id, name) [unique, note: 'ユーザー内ワード重複防止用（複合）']
    category [note: 'カテゴリ別分析用']
  }
}

Table contact_messages {
  id bigint [primary key, note: 'プライマリキー（自動採番）']
  user_id bigint [note: 'ユーザーID（外部キー・NULL許可：未ログインユーザー対応）']
  email varchar [not null, note: '連絡先メールアドレス（返信用・必須）']
  name varchar [not null, note: '問い合わせ者名（表示用・必須）']
  category varchar [note: '問い合わせカテゴリ（bug/feature/general/business）']
  subject varchar [not null, note: '件名（一覧表示用・必須）']
  message text [not null, note: '問い合わせ本文（必須）']
  status varchar [default: 'open', note: 'ステータス（open/in_progress/closed）管理用']
  admin_reply text [note: '管理者返信内容（返信時に記録）']
  replied_at timestamp [note: '返信日時（返信完了時に記録）']
  created_at timestamp [not null, note: 'レコード作成日時（Rails標準）']
  updated_at timestamp [not null, note: 'レコード更新日時（Rails標準）']
  
  Note: '📧 お問い合わせ（管理画面での対応管理用）'
  
  Indexes {
    user_id [note: 'ユーザー別問い合わせ履歴用']
    status [note: 'ステータス別管理用']
    category [note: 'カテゴリ別集計用']
  }
}

// ===============================
// MVP以降拡張テーブル（4テーブル）
// ===============================

Table badges {
  id bigint [primary key, note: 'プライマリキー（自動採番）']
  name varchar [not null, unique, note: 'バッジ名（一意・表示用）例：初回相談マスター']
  description text [not null, note: 'バッジ説明文（取得条件説明）']
  icon_url varchar [note: 'バッジアイコンURL（画像表示用・任意）']
  badge_type varchar [note: 'バッジ種類（achievement/milestone/special）']
  requirements jsonb [note: '取得条件（JSON）例：{"anger_logs_count": 10}']
  points_reward integer [default: 0, note: '取得時獲得ポイント（ゲーミフィケーション）']
  is_active boolean [default: true, note: '有効フラグ（無効化可能）']
  created_at timestamp [not null, note: 'レコード作成日時（Rails標準）']
  updated_at timestamp [not null, note: 'レコード更新日時（Rails標準）']
  
  Note: '🏆 バッジマスターデータ（全ユーザー共通）'
  
  Indexes {
    name [unique, note: 'バッジ名重複防止用']
    badge_type [note: '種類別検索用']
    is_active [note: '有効バッジ絞り込み用']
  }
}

Table user_badges {
  id bigint [primary key, note: 'プライマリキー（自動採番）']
  user_id bigint [not null, note: 'ユーザーID（外部キー・必須）']
  badge_id bigint [not null, note: 'バッジID（外部キー・必須）']
  earned_at timestamp [not null, note: 'バッジ取得日時（実績表示用）']
  created_at timestamp [not null, note: 'レコード作成日時（Rails標準）']
  updated_at timestamp [not null, note: 'レコード更新日時（Rails標準）']
  
  Note: '🎖️ ユーザーバッジ取得履歴（個人の実績記録）'
  
  Indexes {
    user_id [note: 'ユーザー別バッジ一覧用']
    badge_id [note: 'バッジ別取得者一覧用']
    (user_id, badge_id) [unique, note: '同じバッジの重複取得防止用（複合）']
    earned_at [note: '取得日時順ソート用']
  }
}

Table wise_sayings {
  id bigint [primary key, note: 'プライマリキー（自動採番）']
  content text [not null, note: '格言・名言本文（表示用・必須）']
  author varchar [note: '作者・出典（表示用・任意）']
  category varchar [note: 'カテゴリ（motivation/wisdom/humor/gorilla）']
  anger_level_range varchar [note: '対象怒りレベル範囲（1-3/4-6/7-10）表示条件']
  is_active boolean [default: true, note: '有効フラグ（表示ON/OFF切り替え用）']
  display_count integer [default: 0, note: '表示回数（人気度分析用）']
  created_at timestamp [not null, note: 'レコード作成日時（Rails標準）']
  updated_at timestamp [not null, note: 'レコード更新日時（Rails標準）']
  
  Note: '💭 格言マスターデータ（アドバイス表示用）'
  
  Indexes {
    category [note: 'カテゴリ別検索用']
    anger_level_range [note: 'レベル別表示用']
    is_active [note: '有効格言絞り込み用']
  }
}

Table reminders {
  id bigint [primary key, note: 'プライマリキー（自動採番）']
  user_id bigint [not null, note: 'ユーザーID（外部キー・必須）']
  reminder_type varchar [note: 'リマインダー種類（daily_check/weekly_review/breathing）']
  title varchar [not null, note: 'リマインダータイトル（通知表示用・必須）']
  message text [note: 'リマインダーメッセージ（通知本文・任意）']
  schedule_time time [note: '通知時刻（毎日の送信時刻）']
  days_of_week jsonb [note: '通知曜日配列（[1,2,3,4,5] = 平日のみ等）']
  is_active boolean [default: true, note: '有効フラグ（通知ON/OFF切り替え用）']
  last_sent_at timestamp [note: '最終送信日時（重複送信防止用）']
  created_at timestamp [not null, note: 'レコード作成日時（Rails標準）']
  updated_at timestamp [not null, note: 'レコード更新日時（Rails標準）']
  
  Note: '⏰ リマインダー設定（個人別通知管理）'
  
  Indexes {
    user_id [note: 'ユーザー別リマインダー一覧用']
    reminder_type [note: '種類別検索用']
    is_active [note: '有効リマインダー絞り込み用']
    schedule_time [note: '時刻別バッチ処理用']
  }
}

// ===============================
// リレーションシップ定義
// ===============================

// Users中心の1対多関係
Ref: users.id < anger_logs.user_id [delete: cascade]
Ref: users.id < trigger_words.user_id [delete: cascade]
Ref: users.id < contact_messages.user_id [delete: set null]
Ref: users.id < user_badges.user_id [delete: cascade]
Ref: users.id < reminders.user_id [delete: cascade]

// Users 1対1関係
Ref: users.id - calming_points.user_id [delete: cascade]

// バッジ関係
Ref: badges.id < user_badges.badge_id [delete: cascade]

// ===============================
// テーブルグループ
// ===============================

TableGroup "MVP Core (必須)" {
  users
  anger_logs
  calming_points
  trigger_words
  contact_messages
}

TableGroup "MVP以降 (拡張)" {
  badges
  user_badges
  wise_sayings
  reminders
}

// ===============================
// データベース制約
// ===============================

/*
-- anger_logs制約
ALTER TABLE anger_logs ADD CONSTRAINT check_anger_level 
  CHECK (anger_level >= 1 AND anger_level <= 10);

-- contact_messages制約  
ALTER TABLE contact_messages ADD CONSTRAINT check_status 
  CHECK (status IN ('open', 'in_progress', 'closed'));

-- trigger_words制約
-- 削除：categoryカラムが削除されたため

-- calming_points制約
ALTER TABLE calming_points ADD CONSTRAINT check_positive_values 
  CHECK (total_points >= 0 AND current_level >= 1 AND streak_days >= 0);
*/

// ===============================
// カラム必要性精査メモ
// ===============================

/*
🔍 精査ポイント:

【要検討カラム】
- emotions_felt (jsonb) : 必要？シンプルなtextで十分？
- level_achievements (jsonb) : 複雑すぎ？
- milestone_flags (jsonb) : 別テーブルの方が良い？
- display_count : 本当に使う？
- days_of_week (jsonb) : 曜日指定は複雑すぎ？

【シンプル化候補】
- バッジ機能全体 : MVP後回しで削除？
- リマインダー機能 : MVP後回しで削除？
- 格言機能 : シンプルな固定メッセージで十分？

【必須カラム】
- users の Devise関連
- anger_logs の基本情報（level, occurred_at, situation_description）
- calming_points の基本情報（total_points, current_level）
*/