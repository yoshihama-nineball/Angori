class CreateTriggerWords < ActiveRecord::Migration[7.1]
  def change
    create_table :trigger_words do |t|
      t.references :user,           null: false, foreign_key: true
      t.string :name,               null: false
      t.integer :count,             default: 1
      t.float :anger_level_avg,     null: false
      t.string :category
      t.timestamp :last_triggered_at
      t.timestamps null: false
    end

    add_index :trigger_words, [:user_id, :name], unique: true
    add_index :trigger_words, :category
    add_index :trigger_words, :anger_level_avg
  end
end
