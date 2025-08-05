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

ActiveRecord::Schema[7.1].define(version: 2025_08_05_040310) do
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

  add_foreign_key "anger_logs", "users"
  add_foreign_key "calming_points", "users"
  add_foreign_key "trigger_words", "users"
end
