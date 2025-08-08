class CalmingPoint < ApplicationRecord
  include CalmingPointCalculation
  include CalmingPointDisplay
  include CalmingPointStreak
  include CalmingPointMilestones

  belongs_to :user

  validates :total_points, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :current_level, presence: true, numericality: { greater_than_or_equal_to: 1 }
  validates :streak_days, presence: true, numericality: { greater_than_or_equal_to: 0 }
end
