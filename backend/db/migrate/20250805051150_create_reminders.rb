class CreateReminders < ActiveRecord::Migration[7.1]
  def change
    create_table :reminders do |t|
      t.references :user,           null: false, foreign_key: true
      t.string :reminder_category,  null: false
      t.string :title,              null: false
      t.text :message,              null: false
      t.string :schedule_time
      t.jsonb :days_of_week
      t.boolean :is_active,         default: true
      t.timestamps null: false
    end

    add_index :reminders, [:user_id, :is_active]
    add_index :reminders, :reminder_category
  end
end
