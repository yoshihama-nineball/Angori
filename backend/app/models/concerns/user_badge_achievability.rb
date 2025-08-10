module UserBadgeAchievability
  def next_achievable_badges(user, limit = 3)
    earned_badge_ids = where(user: user).pluck(:badge_id)
    available_badges = Badge.where.not(id: earned_badge_ids)

    achievable_badges = available_badges.select do |badge|
      badge.check_eligibility(user)
    end

    achievable_badges.take(limit)
  end
end
