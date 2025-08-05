class CreateBadges < ActiveRecord::Migration[7.1]
  def change
    create_table :badges do |t|
      t.string :name,               null: false
      t.text :description,          null: false
      t.string :badge_type,         null: false
      t.jsonb :requirements
      t.integer :points_reward,     default: 0
      t.timestamps null: false
    end

    add_index :badges, :badge_type
    add_index :badges, :name, unique: true
  end
end
