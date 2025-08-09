module BadgeLeaderboards
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
