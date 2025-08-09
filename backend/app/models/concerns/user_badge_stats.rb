module UserBadgeStats
  extend ActiveSupport::Concern

  included do
    extend BadgeAchievementAnalytics
    extend BadgeLeaderboards
  end
end
