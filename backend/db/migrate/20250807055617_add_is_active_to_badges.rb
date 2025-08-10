class AddIsActiveToBadges < ActiveRecord::Migration[7.1]
  def change
    add_column :badges, :is_active, :boolean
  end
end
