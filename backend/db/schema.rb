# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2025_08_13_070904) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "anger_logs", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.integer "anger_level", null: false
    t.datetime "occurred_at", precision: nil, null: false
    t.string "location"
    t.text "situation_description", null: false
    t.string "trigger_words"
    t.jsonb "emotions_felt"
    t.text "ai_advice"
    t.text "reflection"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["anger_level"], name: "index_anger_logs_on_anger_level"
    t.index ["occurred_at"], name: "index_anger_logs_on_occurred_at"
    t.index ["trigger_words"], name: "index_anger_logs_on_trigger_words"
    t.index ["user_id"], name: "index_anger_logs_on_user_id"
  end

  create_table "badges", force: :cascade do |t|
    t.string "name", null: false
    t.text "description", null: false
    t.string "badge_type", null: false
    t.jsonb "requirements"
    t.integer "points_reward", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "is_active"
    t.index ["badge_type"], name: "index_badges_on_badge_type"
    t.index ["name"], name: "index_badges_on_name", unique: true
  end

  create_table "calming_points", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.integer "total_points", default: 0
    t.integer "current_level", default: 1
    t.integer "streak_days", default: 0
    t.datetime "last_action_date"
    t.jsonb "level_achievements"
    t.jsonb "milestone_flags"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["current_level"], name: "index_calming_points_on_current_level"
    t.index ["total_points"], name: "index_calming_points_on_total_points"
    t.index ["user_id"], name: "index_calming_points_on_user_id", unique: true
  end

  create_table "contact_messages", force: :cascade do |t|
    t.bigint "user_id"
    t.string "email", null: false
    t.string "name", null: false
    t.string "category"
    t.string "subject", null: false
    t.text "message", null: false
    t.string "status", default: "open", null: false
    t.text "admin_reply"
    t.datetime "replied_at", precision: nil
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category"], name: "index_contact_messages_on_category"
    t.index ["status"], name: "index_contact_messages_on_status"
    t.index ["user_id"], name: "index_contact_messages_on_user_id"
  end

  create_table "jwt_denylists", force: :cascade do |t|
    t.string "jti"
    t.datetime "exp"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["jti"], name: "index_jwt_denylists_on_jti"
  end

  create_table "reminders", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "reminder_category", null: false
    t.string "title", null: false
    t.text "message", null: false
    t.string "schedule_time"
    t.jsonb "days_of_week"
    t.boolean "is_active", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["reminder_category"], name: "index_reminders_on_reminder_category"
    t.index ["user_id", "is_active"], name: "index_reminders_on_user_id_and_is_active"
    t.index ["user_id"], name: "index_reminders_on_user_id"
  end

  create_table "trigger_words", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "name", null: false
    t.integer "count", default: 1
    t.float "anger_level_avg", null: false
    t.string "category"
    t.datetime "last_triggered_at", precision: nil
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["anger_level_avg"], name: "index_trigger_words_on_anger_level_avg"
    t.index ["category"], name: "index_trigger_words_on_category"
    t.index ["user_id", "name"], name: "index_trigger_words_on_user_id_and_name", unique: true
    t.index ["user_id"], name: "index_trigger_words_on_user_id"
  end

  create_table "user_badges", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "badge_id", null: false
    t.datetime "earned_at", precision: nil, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["badge_id"], name: "index_user_badges_on_badge_id"
    t.index ["earned_at"], name: "index_user_badges_on_earned_at"
    t.index ["user_id", "badge_id"], name: "index_user_badges_on_user_id_and_badge_id", unique: true
    t.index ["user_id"], name: "index_user_badges_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "name", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "wise_sayings", force: :cascade do |t|
    t.text "content", null: false
    t.string "author"
    t.string "category"
    t.string "anger_level_range"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["anger_level_range"], name: "index_wise_sayings_on_anger_level_range"
    t.index ["category"], name: "index_wise_sayings_on_category"
  end

  add_foreign_key "anger_logs", "users"
  add_foreign_key "calming_points", "users"
  add_foreign_key "contact_messages", "users"
  add_foreign_key "reminders", "users"
  add_foreign_key "trigger_words", "users"
  add_foreign_key "user_badges", "badges"
  add_foreign_key "user_badges", "users"
end
