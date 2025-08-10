module UserBadgeProgressCalculation
  def progress_towards_badges(user)
    earned_badge_ids = where(user: user).pluck(:badge_id)
    available_badges = Badge.where.not(id: earned_badge_ids)

    progress_data = []

    available_badges.each do |badge|
      progress = calculate_progress_percentage(user, badge)
      next if progress.zero?

      progress_data << build_progress_data(badge, progress)
    end

    progress_data.sort_by { |data| -data[:progress_percentage] }
  end

  private

  def build_progress_data(badge, progress)
    {
      badge: badge,
      progress_percentage: progress,
      requirements_text: badge.requirements_text,
      points_reward: badge.points_reward
    }
  end

  def calculate_progress_percentage(user, badge)
    requirements = badge.requirements
    calculator_method = UserBadgeProgress::PROGRESS_CALCULATORS[requirements['type']]

    return 0 unless calculator_method

    progress = send(calculator_method, user, requirements['threshold'])
    [progress, 100].min.round(1)
  end
end
