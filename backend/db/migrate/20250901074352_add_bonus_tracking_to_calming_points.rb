class AddBonusTrackingToCalmingPoints < ActiveRecord::Migration[7.0]
  def change
    add_column :calming_points, :last_calculated_base_points, :integer, default: 0
    add_column :calming_points, :last_reflection_date, :date
    add_column :calming_points, :last_improvement_check_date, :date
    add_column :calming_points, :awarded_bonuses, :jsonb, default: {}
  end
end