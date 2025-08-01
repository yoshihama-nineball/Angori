-- ===============================
-- Angori Database Schema - 完全版
-- 🦍 ゴリラのアンガーマネジメントアプリ
-- ===============================

-- データベース作成
CREATE DATABASE angori_development;
CREATE DATABASE angori_test;
CREATE DATABASE angori_production;

-- 拡張機能有効化（JSONB検索用）
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ===============================
-- MVP必須テーブル（5テーブル）
-- ===============================

-- 👤 ユーザー認証・プロフィール（Devise標準構成）
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY, -- プライマリキー（自動採番）
  email VARCHAR NOT NULL UNIQUE, -- メールアドレス（ログイン用・Devise必須）
  encrypted_password VARCHAR NOT NULL, -- Deviseによる暗号化パスワード（必須）
  name VARCHAR NOT NULL, -- ユーザー表示名（アプリ内表示用）
  reset_password_token VARCHAR, -- パスワードリセット用トークン（Devise自動管理）
  reset_password_sent_at TIMESTAMP, -- パスワードリセット送信日時（Devise自動管理）
  remember_created_at TIMESTAMP, -- ログイン記憶開始日時（Devise "Remember me"機能）
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- レコード作成日時（Rails標準）
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- レコード更新日時（Rails標準）
);

-- インデックス
CREATE UNIQUE INDEX index_users_on_email ON users(email); -- メールアドレス検索・重複チェック用
CREATE INDEX index_users_on_reset_password_token ON users(reset_password_token);

-- ===============================

-- 😡 アンガーログ（相談・アドバイス統合）メインデータ
CREATE TABLE anger_logs (
  id BIGSERIAL PRIMARY KEY, -- プライマリキー（自動採番）
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- ユーザーID（外部キー・必須）
  
  -- 🔥 基本怒り情報
  anger_level INTEGER NOT NULL CHECK (anger_level >= 1 AND anger_level <= 10), -- 怒りレベル（1-10段階・必須入力）
  occurred_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 怒り発生日時（デフォルト現在時刻・調整可能）
  location VARCHAR, -- 発生場所（自由記述・任意）例：職場、家、電車内
  
  -- 📝 状況・原因
  situation_description TEXT NOT NULL, -- 状況説明（事実ベース・必須）認知と分離
  trigger_words VARCHAR, -- トリガー要因（選択式or自由記述・任意）
  emotions_felt JSONB, -- 感情タグ配列（任意）["anger","sadness","fear"]
  
  -- 🤖 AIアドバイス
  ai_advice TEXT, -- OpenAI GPT-4o-miniによる生成アドバイス（相談後に自動生成）
  
  -- 💭 振り返り
  reflection TEXT, -- 後からの振り返り・気づき（任意・ユーザーが後で追記）
  
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- レコード作成日時（Rails標準）
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- レコード更新日時（Rails標準）
);

-- インデックス
CREATE INDEX index_anger_logs_on_user_id ON anger_logs(user_id); -- ユーザー別ログ検索用
CREATE INDEX index_anger_logs_on_occurred_at ON anger_logs(occurred_at); -- 時系列ソート用
CREATE INDEX index_anger_logs_on_user_id_and_occurred_at ON anger_logs(user_id, occurred_at); -- ユーザー別時系列検索用（複合）
CREATE INDEX index_anger_logs_on_anger_level ON anger_logs(anger_level); -- レベル別分析用
CREATE INDEX index_anger_logs_on_emotions_felt ON anger_logs USING GIN(emotions_felt); -- JSONB全文検索用

-- ===============================

-- 🍌 落ち着きポイント・スコア（ゲーミフィケーション）
CREATE TABLE calming_points (
  id BIGSERIAL PRIMARY KEY, -- プライマリキー（自動採番）
  user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE, -- ユーザーID（1対1関係・必須）
  total_points INTEGER DEFAULT 0 CHECK (total_points >= 0), -- 累計バナナポイント（ログ記録・相談等で獲得）
  current_level INTEGER DEFAULT 1 CHECK (current_level >= 1), -- 現在レベル（ポイントに応じて自動計算）
  streak_days INTEGER DEFAULT 0 CHECK (streak_days >= 0), -- 連続記録日数（継続モチベーション用）
  last_action_date DATE, -- 最終アクション日（ストリーク計算用）
  
  -- 📊 レベル達成履歴（達成日時・レベル情報の配列）
  level_achievements JSONB DEFAULT '[]'::jsonb,
  -- 例：[
  --   {
  --     "level": 5,
  --     "achieved_at": "2025-01-15T10:30:00Z",
  --     "points_required": 500,
  --     "milestone_type": "continuous_logging",
  --     "badge_earned": "継続記録マスター"
  --   },
  --   {
  --     "level": 10,
  --     "achieved_at": "2025-02-20T14:15:00Z", 
  --     "points_required": 1500,
  --     "milestone_type": "anger_control_improvement"
  --   }
  -- ]
  
  -- 📊 マイルストーン達成フラグ（初回相談・10回記録等）
  milestone_flags JSONB DEFAULT '{}'::jsonb,
  -- 例：{
  --   "first_log_created": true,
  --   "first_ai_consultation": true,
  --   "consecutive_7_days": true,
  --   "consecutive_30_days": false,
  --   "anger_level_reduced": true,
  --   "trigger_words_identified": false,
  --   "achievement_unlocked": {
  --     "gorilla_beginner": true,
  --     "emotion_analyst": false
  --   }
  -- }
  
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- レコード作成日時（Rails標準）
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- レコード更新日時（Rails標準）
);

-- インデックス
CREATE UNIQUE INDEX index_calming_points_on_user_id ON calming_points(user_id); -- 1対1関係保証用
CREATE INDEX index_calming_points_on_current_level ON calming_points(current_level); -- レベル別ランキング用
CREATE INDEX index_calming_points_on_level_achievements ON calming_points USING GIN(level_achievements); -- JSONB検索用（レベル別分析）
CREATE INDEX index_calming_points_on_milestone_flags ON calming_points USING GIN(milestone_flags); -- JSONB検索用（マイルストーン分析）

-- ===============================

-- ⚡ トリガー分析（怒りの傾向マップ用・D3.js Packed Bubble Chart）
CREATE TABLE trigger_words (
  id BIGSERIAL PRIMARY KEY, -- プライマリキー（自動採番）
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- ユーザーID（外部キー・必須）
  name VARCHAR NOT NULL, -- トリガーワード名（D3.jsバブル表示用）
  count INTEGER DEFAULT 1 CHECK (count > 0), -- 出現回数（バブルサイズ決定用）
  anger_level_avg FLOAT CHECK (anger_level_avg >= 1 AND anger_level_avg <= 10), -- 平均怒りレベル（バブル色分け用）計算値
  category VARCHAR, -- カテゴリ分類（work/family/social/sensory/other）
  last_triggered_at TIMESTAMP, -- 最終トリガー発生日時（分析用）
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- レコード作成日時（Rails標準）
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- レコード更新日時（Rails標準）
);

-- インデックス
CREATE INDEX index_trigger_words_on_user_id_and_count ON trigger_words(user_id, count DESC); -- ユーザー別頻度順ソート用（複合）
CREATE UNIQUE INDEX index_trigger_words_on_user_id_and_name ON trigger_words(user_id, name); -- ユーザー内ワード重複防止用（複合）
CREATE INDEX index_trigger_words_on_category ON trigger_words(category); -- カテゴリ別分析用

-- ===============================

-- 📧 お問い合わせ（管理画面での対応管理用）
CREATE TABLE contact_messages (
  id BIGSERIAL PRIMARY KEY, -- プライマリキー（自動採番）
  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL, -- ユーザーID（外部キー・NULL許可：未ログインユーザー対応）
  email VARCHAR NOT NULL, -- 連絡先メールアドレス（返信用・必須）
  name VARCHAR NOT NULL, -- 問い合わせ者名（表示用・必須）
  category VARCHAR, -- 問い合わせカテゴリ（bug/feature/general/business）
  subject VARCHAR NOT NULL, -- 件名（一覧表示用・必須）
  message TEXT NOT NULL, -- 問い合わせ本文（必須）
  status VARCHAR DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed')), -- ステータス（open/in_progress/closed）管理用
  admin_reply TEXT, -- 管理者返信内容（返信時に記録）
  replied_at TIMESTAMP, -- 返信日時（返信完了時に記録）
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- レコード作成日時（Rails標準）
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- レコード更新日時（Rails標準）
);

-- インデックス
CREATE INDEX index_contact_messages_on_user_id ON contact_messages(user_id); -- ユーザー別問い合わせ履歴用
CREATE INDEX index_contact_messages_on_status ON contact_messages(status); -- ステータス別管理用
CREATE INDEX index_contact_messages_on_category ON contact_messages(category); -- カテゴリ別集計用 contact_messages(user_id); -- ユーザー別問い合わせ履歴用
CREATE INDEX index_contact_messages_on_status ON contact_messages(status); -- ステータス別管理用
CREATE INDEX index_contact_messages_on_category ON contact_messages(category); -- カテゴリ別集計用

-- ===============================
-- MVP以降拡張テーブル（4テーブル）
-- ===============================

-- 🏆 バッジマスターデータ（全ユーザー共通）
CREATE TABLE badges (
  id BIGSERIAL PRIMARY KEY, -- プライマリキー（自動採番）
  name VARCHAR NOT NULL UNIQUE, -- バッジ名（一意・表示用）例：初回相談マスター
  description TEXT NOT NULL, -- バッジ説明文（取得条件説明）
  icon_url VARCHAR, -- バッジアイコンURL（画像表示用・任意）
  badge_type VARCHAR, -- バッジ種類（achievement/milestone/special）
  requirements JSONB DEFAULT '{}'::jsonb, -- 取得条件（JSON）例：{"anger_logs_count": 10}
  points_reward INTEGER DEFAULT 0 CHECK (points_reward >= 0), -- 取得時獲得ポイント（ゲーミフィケーション）
  is_active BOOLEAN DEFAULT true, -- 有効フラグ（無効化可能）
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- レコード作成日時（Rails標準）
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- レコード更新日時（Rails標準）
);

-- インデックス
CREATE UNIQUE INDEX index_badges_on_name ON badges(name); -- バッジ名重複防止用
CREATE INDEX index_badges_on_badge_type ON badges(badge_type); -- 種類別検索用
CREATE INDEX index_badges_on_is_active ON badges(is_active); -- 有効バッジ絞り込み用

-- ===============================

-- 🎖️ ユーザーバッジ取得履歴（個人の実績記録）
CREATE TABLE user_badges (
  id BIGSERIAL PRIMARY KEY, -- プライマリキー（自動採番）
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- ユーザーID（外部キー・必須）
  badge_id BIGINT NOT NULL REFERENCES badges(id) ON DELETE CASCADE, -- バッジID（外部キー・必須）
  earned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- バッジ取得日時（実績表示用）
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- レコード作成日時（Rails標準）
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- レコード更新日時（Rails標準）
);

-- インデックス
CREATE INDEX index_user_badges_on_user_id ON user_badges(user_id); -- ユーザー別バッジ一覧用
CREATE INDEX index_user_badges_on_badge_id ON user_badges(badge_id); -- バッジ別取得者一覧用
CREATE UNIQUE INDEX index_user_badges_on_user_id_and_badge_id ON user_badges(user_id, badge_id); -- 同じバッジの重複取得防止用（複合）
CREATE INDEX index_user_badges_on_earned_at ON user_badges(earned_at); -- 取得日時順ソート用

-- ===============================

-- 💭 格言マスターデータ（アドバイス表示用）
CREATE TABLE wise_sayings (
  id BIGSERIAL PRIMARY KEY, -- プライマリキー（自動採番）
  content TEXT NOT NULL, -- 格言・名言本文（表示用・必須）
  author VARCHAR, -- 作者・出典（表示用・任意）
  category VARCHAR, -- カテゴリ（motivation/wisdom/humor/gorilla）
  anger_level_range VARCHAR, -- 対象怒りレベル範囲（1-3/4-6/7-10）表示条件
  is_active BOOLEAN DEFAULT true, -- 有効フラグ（表示ON/OFF切り替え用）
  display_count INTEGER DEFAULT 0 CHECK (display_count >= 0), -- 表示回数（人気度分析用）
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- レコード作成日時（Rails標準）
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- レコード更新日時（Rails標準）
);

-- インデックス
CREATE INDEX index_wise_sayings_on_category ON wise_sayings(category); -- カテゴリ別検索用
CREATE INDEX index_wise_sayings_on_anger_level_range ON wise_sayings(anger_level_range); -- レベル別表示用
CREATE INDEX index_wise_sayings_on_is_active ON wise_sayings(is_active); -- 有効格言絞り込み用

-- ===============================

-- ⏰ リマインダー設定（個人別通知管理）
CREATE TABLE reminders (
  id BIGSERIAL PRIMARY KEY, -- プライマリキー（自動採番）
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- ユーザーID（外部キー・必須）
  reminder_category VARCHAR, -- リマインダーカテゴリ（daily_check/weekly_review/breathing）※STI回避のためtypeから変更
  title VARCHAR NOT NULL, -- リマインダータイトル（通知表示用・必須）
  message TEXT, -- リマインダーメッセージ（通知本文・任意）
  schedule_time TIME, -- 通知時刻（毎日の送信時刻）
  days_of_week JSONB DEFAULT '[]'::jsonb, -- 通知曜日配列（[1,2,3,4,5] = 平日のみ等）
  -- 例：[1,2,3,4,5] = 平日のみ
  -- 例：[0,6] = 土日のみ
  -- （0=日曜日, 1=月曜日, ..., 6=土曜日）
  is_active BOOLEAN DEFAULT true, -- 有効フラグ（通知ON/OFF切り替え用）
  last_sent_at TIMESTAMP, -- 最終送信日時（重複送信防止用）
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- レコード作成日時（Rails標準）
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- レコード更新日時（Rails標準）
);

-- インデックス
CREATE INDEX index_reminders_on_user_id ON reminders(user_id); -- ユーザー別リマインダー一覧用
CREATE INDEX index_reminders_on_reminder_category ON reminders(reminder_category); -- カテゴリ別検索用
CREATE INDEX index_reminders_on_is_active ON reminders(is_active); -- 有効リマインダー絞り込み用
CREATE INDEX index_reminders_on_schedule_time ON reminders(schedule_time); -- 時刻別バッチ処理用
CREATE INDEX index_reminders_on_days_of_week ON reminders USING GIN(days_of_week); -- JSONB検索用（曜日別通知）

-- ===============================
-- JSONB検索クエリ例
-- ===============================

/*
-- 📊 calming_points のJSONB検索例

-- 1. 特定マイルストーン達成者の検索
SELECT * FROM calming_points 
WHERE milestone_flags->>'first_ai_consultation' = 'true';

-- 2. レベル10達成者の検索
SELECT * FROM calming_points
WHERE level_achievements @> '[{"level": 10}]';

-- 3. 連続記録7日達成者の分析
SELECT COUNT(*) FROM calming_points
WHERE milestone_flags->>'consecutive_7_days' = 'true';

-- 4. レベル別達成時期の分析
SELECT 
  user_id,
  (la->>'level')::int as level,
  (la->>'achieved_at')::timestamp as achieved_at,
  la->>'milestone_type' as milestone_type
FROM calming_points,
  jsonb_array_elements(level_achievements) la
ORDER BY (la->>'achieved_at')::timestamp DESC;

-- 5. マイルストーン達成率の分析
SELECT 
  milestone_key,
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE milestone_value = 'true') as achieved_users,
  ROUND(COUNT(*) FILTER (WHERE milestone_value = 'true') * 100.0 / COUNT(*), 2) as achievement_rate
FROM calming_points,
  jsonb_each_text(milestone_flags) as milestones(milestone_key, milestone_value)
GROUP BY milestone_key
ORDER BY achievement_rate DESC;

-- 📊 anger_logs のJSONB検索例

-- 6. 特定の感情タグが含まれるログ検索
SELECT * FROM anger_logs 
WHERE emotions_felt @> '["anger"]';

-- 7. 複数感情の組み合わせ検索
SELECT * FROM anger_logs 
WHERE emotions_felt @> '["anger", "sadness"]';

-- 8. 感情タグの頻度分析
SELECT 
  emotion,
  COUNT(*) as frequency
FROM anger_logs,
  jsonb_array_elements_text(emotions_felt) as emotion
WHERE emotions_felt IS NOT NULL
GROUP BY emotion
ORDER BY frequency DESC;

-- 📊 reminders のJSONB検索例

-- 9. 特定曜日のリマインダー検索（月曜日）
SELECT * FROM reminders 
WHERE days_of_week @> '[1]' AND is_active = true;

-- 10. 平日のみのリマインダー検索
SELECT * FROM reminders 
WHERE days_of_week @> '[1,2,3,4,5]' AND is_active = true;
*/

-- ===============================
-- 初期データ投入（サンプル）
-- ===============================

-- 格言データのサンプル
INSERT INTO wise_sayings (content, author, category, anger_level_range, is_active) VALUES
('怒りは自分に飲ませる毒である', '仏陀', 'wisdom', '7-10', true),
('一呼吸置いてから行動しよう', 'Angori', 'gorilla', '4-6', true),
('🦍 ゴリラのように力強く、バナナのように優しい心で', 'Angori', 'gorilla', '1-3', true),
('怒りは自然な感情です。大切なのは上手に付き合うこと', 'アンガーマネジメント協会', 'motivation', '4-6', true);

-- バッジデータのサンプル
INSERT INTO badges (name, description, badge_type, requirements, points_reward, is_active) VALUES
('初回ログマスター', '最初のアンガーログを記録', 'milestone', '{"anger_logs_count": 1}', 100, true),
('継続記録マスター', '7日連続でログを記録', 'achievement', '{"consecutive_days": 7}', 300, true),
('AI相談デビュー', '初めてAI相談を利用', 'milestone', '{"ai_consultations_count": 1}', 150, true),
('感情分析エキスパート', 'トリガーワードを10個特定', 'achievement', '{"trigger_words_count": 10}', 500, true);

-- ===============================
-- パフォーマンス最適化
-- ===============================

-- 統計情報更新
ANALYZE users;
ANALYZE anger_logs;
ANALYZE calming_points;
ANALYZE trigger_words;
ANALYZE contact_messages;

-- vacuum設定（PostgreSQL推奨）
-- 定期的なメンテナンスコマンド
/*
VACUUM ANALYZE anger_logs;
VACUUM ANALYZE calming_points;
REINDEX INDEX index_anger_logs_on_emotions_felt;
REINDEX INDEX index_calming_points_on_milestone_flags;
*/ contact_messages(user_id);
CREATE INDEX index_contact_messages_on_status ON contact_messages(status);
CREATE INDEX index_contact_messages_on_category ON contact_messages(category);

-- ===============================
-- MVP以降拡張テーブル（4テーブル）
-- ===============================

-- 🏆 バッジマスターデータ（全ユーザー共通）
CREATE TABLE badges (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon_url VARCHAR,
  badge_type VARCHAR, -- achievement/milestone/special
  requirements JSONB DEFAULT '{}'::jsonb, -- 例：{"anger_logs_count": 10}
  points_reward INTEGER DEFAULT 0 CHECK (points_reward >= 0),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- インデックス
CREATE UNIQUE INDEX index_badges_on_name ON badges(name);
CREATE INDEX index_badges_on_badge_type ON badges(badge_type);
CREATE INDEX index_badges_on_is_active ON badges(is_active);

-- ===============================

-- 🎖️ ユーザーバッジ取得履歴（個人の実績記録）
CREATE TABLE user_badges (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id BIGINT NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- インデックス
CREATE INDEX index_user_badges_on_user_id ON user_badges(user_id);
CREATE INDEX index_user_badges_on_badge_id ON user_badges(badge_id);
CREATE UNIQUE INDEX index_user_badges_on_user_id_and_badge_id ON user_badges(user_id, badge_id);
CREATE INDEX index_user_badges_on_earned_at ON user_badges(earned_at);

-- ===============================

-- 💭 格言マスターデータ（アドバイス表示用）
CREATE TABLE wise_sayings (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  author VARCHAR,
  category VARCHAR, -- motivation/wisdom/humor/gorilla
  anger_level_range VARCHAR, -- 1-3/4-6/7-10
  is_active BOOLEAN DEFAULT true,
  display_count INTEGER DEFAULT 0 CHECK (display_count >= 0),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- インデックス
CREATE INDEX index_wise_sayings_on_category ON wise_sayings(category);
CREATE INDEX index_wise_sayings_on_anger_level_range ON wise_sayings(anger_level_range);
CREATE INDEX index_wise_sayings_on_is_active ON wise_sayings(is_active);

-- ===============================

-- ⏰ リマインダー設定（個人別通知管理）
CREATE TABLE reminders (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reminder_category VARCHAR, -- daily_check/weekly_review/breathing ※STI回避のためtypeから変更
  title VARCHAR NOT NULL,
  message TEXT,
  schedule_time TIME,
  days_of_week JSONB DEFAULT '[]'::jsonb, -- 例：[1,2,3,4,5] = 平日のみ
  is_active BOOLEAN DEFAULT true,
  last_sent_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- インデックス
CREATE INDEX index_reminders_on_user_id ON reminders(user_id);
CREATE INDEX index_reminders_on_reminder_category ON reminders(reminder_category);
CREATE INDEX index_reminders_on_is_active ON reminders(is_active);
CREATE INDEX index_reminders_on_schedule_time ON reminders(schedule_time);
CREATE INDEX index_reminders_on_days_of_week ON reminders USING GIN(days_of_week);

-- ===============================
-- JSONB検索クエリ例
-- ===============================

/*
-- 📊 calming_points のJSONB検索例

-- 1. 特定マイルストーン達成者の検索
SELECT * FROM calming_points 
WHERE milestone_flags->>'first_ai_consultation' = 'true';

-- 2. レベル10達成者の検索
SELECT * FROM calming_points
WHERE level_achievements @> '[{"level": 10}]';

-- 3. 連続記録7日達成者の分析
SELECT COUNT(*) FROM calming_points
WHERE milestone_flags->>'consecutive_7_days' = 'true';

-- 4. レベル別達成時期の分析
SELECT 
  user_id,
  (la->>'level')::int as level,
  (la->>'achieved_at')::timestamp as achieved_at,
  la->>'milestone_type' as milestone_type
FROM calming_points,
  jsonb_array_elements(level_achievements) la
ORDER BY (la->>'achieved_at')::timestamp DESC;

-- 5. マイルストーン達成率の分析
SELECT 
  milestone_key,
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE milestone_value = 'true') as achieved_users,
  ROUND(COUNT(*) FILTER (WHERE milestone_value = 'true') * 100.0 / COUNT(*), 2) as achievement_rate
FROM calming_points,
  jsonb_each_text(milestone_flags) as milestones(milestone_key, milestone_value)
GROUP BY milestone_key
ORDER BY achievement_rate DESC;

-- 📊 anger_logs のJSONB検索例

-- 6. 特定の感情タグが含まれるログ検索
SELECT * FROM anger_logs 
WHERE emotions_felt @> '["anger"]';

-- 7. 複数感情の組み合わせ検索
SELECT * FROM anger_logs 
WHERE emotions_felt @> '["anger", "sadness"]';

-- 8. 感情タグの頻度分析
SELECT 
  emotion,
  COUNT(*) as frequency
FROM anger_logs,
  jsonb_array_elements_text(emotions_felt) as emotion
WHERE emotions_felt IS NOT NULL
GROUP BY emotion
ORDER BY frequency DESC;

-- 📊 reminders のJSONB検索例

-- 9. 特定曜日のリマインダー検索（月曜日）
SELECT * FROM reminders 
WHERE days_of_week @> '[1]' AND is_active = true;

-- 10. 平日のみのリマインダー検索
SELECT * FROM reminders 
WHERE days_of_week @> '[1,2,3,4,5]' AND is_active = true;
*/

-- ===============================
-- 初期データ投入（サンプル）
-- ===============================

-- 格言データのサンプル
INSERT INTO wise_sayings (content, author, category, anger_level_range, is_active) VALUES
('怒りは自分に飲ませる毒である', '仏陀', 'wisdom', '7-10', true),
('一呼吸置いてから行動しよう', 'Angori', 'gorilla', '4-6', true),
('🦍 ゴリラのように力強く、バナナのように優しい心で', 'Angori', 'gorilla', '1-3', true),
('怒りは自然な感情です。大切なのは上手に付き合うこと', 'アンガーマネジメント協会', 'motivation', '4-6', true);

-- バッジデータのサンプル
INSERT INTO badges (name, description, badge_type, requirements, points_reward, is_active) VALUES
('初回ログマスター', '最初のアンガーログを記録', 'milestone', '{"anger_logs_count": 1}', 100, true),
('継続記録マスター', '7日連続でログを記録', 'achievement', '{"consecutive_days": 7}', 300, true),
('AI相談デビュー', '初めてAI相談を利用', 'milestone', '{"ai_consultations_count": 1}', 150, true),
('感情分析エキスパート', 'トリガーワードを10個特定', 'achievement', '{"trigger_words_count": 10}', 500, true);

-- ===============================
-- パフォーマンス最適化
-- ===============================

-- 統計情報更新
ANALYZE users;
ANALYZE anger_logs;
ANALYZE calming_points;
ANALYZE trigger_words;
ANALYZE contact_messages;

-- vacuum設定（PostgreSQL推奨）
-- 定期的なメンテナンスコマンド
/*
VACUUM ANALYZE anger_logs;
VACUUM ANALYZE calming_points;
REINDEX INDEX index_anger_logs_on_emotions_felt;
REINDEX INDEX index_calming_points_on_milestone_flags;
*/