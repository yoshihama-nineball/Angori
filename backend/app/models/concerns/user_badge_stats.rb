module UserBadgeStats
  extend ActiveSupport::Concern

  class_methods do
    def recent_achievements(limit = 10)
      recent.includes(:user, :badge).limit(limit)
    end

    def achievement_stats_for_user(user)
      user_badges = where(user: user)

      {
        total_badges: user_badges.count,
        milestone_count: user_badges.milestone_badges.count,
        achievement_count: user_badges.achievement_badges.count,
        special_count: user_badges.special_badges.count,
        rare_count: user_badges.rare_badges.count,
        total_points_from_badges: user_badges.joins(:badge).sum('badges.points_reward'),
        recent_badges: user_badges.recent.limit(5),
        completion_percentage: calculate_completion_percentage(user)
      }
    end

    def calculate_completion_percentage(user)
      total_badges = Badge.count
      earned_badges = where(user: user).count

      return 0 if total_badges.zero?

      ((earned_badges.to_f / total_badges) * 100).round(1)
    end

    def badge_leaderboard(limit = 10)
      User.joins(:user_badges)
          .group('users.id')
          .order('COUNT(user_badges.id) DESC')
          .limit(limit)
          .includes(:user_badges)
    end

    def monthly_achievers
      this_month
        .joins(:user, :badge)
        .group('users.name')
        .count
        .sort_by { |_, count| -count }
    end
  end
end
