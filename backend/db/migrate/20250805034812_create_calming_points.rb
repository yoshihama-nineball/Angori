class CreateCalmingPoints < ActiveRecord::Migration[7.1]
  def change
    create_table :calming_points do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :total_points, default: 0
      t.integer :current_level, default: 1
      t.integer :streak_days, default: 0
      t.datetime :last_action_date
      t.jsonb :level_achievements
      t.jsonb :milestone_flags
      t.timestamps null: false
    end
    add_index :calming_points, :user_id, unique: true
    add_index :calming_points, :total_points
    add_index :calming_points, :current_level
  end
end
