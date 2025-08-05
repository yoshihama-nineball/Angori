class CreateAngerLogs < ActiveRecord::Migration[7.1]
  def change
    create_table :anger_logs do |t|
      t.references :user,                   null: false, foreign_key: true
      t.integer :anger_level,               null: false
      t.timestamps :occurred_at             null: false,
      t.string :location,
      t.text :situation_description,        null: false,
      t.string :trigger_words,
      t.jsonb :emotions_felt,
      t.text :ai_advice,
      t.text :reflection,
      t.timestamps
    end
    add_index :anger_logs, :user_id
    add_index :anger_logs, :occurred_at
    add_index :anger_logs, :anger_level
    add_index :anger_logs, :trigger_words, using: :gin
  end
end
