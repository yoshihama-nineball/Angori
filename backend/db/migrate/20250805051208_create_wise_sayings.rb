class CreateWiseSayings < ActiveRecord::Migration[7.1]
  def change
    create_table :wise_sayings do |t|
      t.text :content,              null: false
      t.string :author
      t.string :category
      t.string :anger_level_range
      t.timestamps null: false
    end

    add_index :wise_sayings, :category
    add_index :wise_sayings, :anger_level_range
  end
end
