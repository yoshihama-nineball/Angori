class UserBadge < ApplicationRecord
  include UserBadgeDisplay
  include UserBadgeStats
  include UserBadgeProgress
  include UserBadgeCallbacks

  belongs_to :user
  belongs_to :badge

  validates :user_id, uniqueness: {
    scope: :badge_id,
    message: I18n.t('activerecord.errors.messages.user_badge_duplicate')
  }

  scope :recent, -> { order(created_at: :desc) }
  scope :by_badge_type, ->(type) { joins(:badge).where(badges: { badge_type: type }) }
  scope :milestone_badges, -> { by_badge_type('milestone') }
  scope :achievement_badges, -> { by_badge_type('achievement') }
  scope :special_badges, -> { by_badge_type('special') }
  scope :rare_badges, -> { by_badge_type('rare') }
  scope :high_reward, -> { joins(:badge).where(badges: { points_reward: 50.. }) }
  scope :this_week, -> { where(created_at: 1.week.ago..) }
  scope :this_month, -> { where(created_at: 1.month.ago..) }
end
