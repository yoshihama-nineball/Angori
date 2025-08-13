module UserBadgeCallbacks
  extend ActiveSupport::Concern

  included do
    before_create :set_earned_at
    after_create :award_points, :update_user_achievements, :notify_achievement
  end

  private

  def set_earned_at
    self.earned_at ||= Time.current
  end

  def award_points
    return if user.calming_point.blank?

    current_points = user.calming_point.total_points
    new_total = current_points + badge.points_reward
    new_level = (new_total / 100) + 1

    user.calming_point.update!(
      total_points: new_total,
      current_level: new_level,
      last_action_date: Date.current
    )
  end

  def update_user_achievements
    return if user.calming_point.blank?

    flags = user.calming_point.milestone_flags || {}
    flags["badge_#{badge.id}_earned"] = true

    flags["first_#{badge.badge_type}_badge"] = true unless first_badge_of_type_already_earned?

    user.calming_point.update!(milestone_flags: flags)
  end

  def notify_achievement
    Rails.logger.info "🏆 User #{user.id} earned badge: #{badge.name}"
  end

  def first_badge_of_type_already_earned?
    user.user_badges.by_badge_type(badge.badge_type).where.not(id: id).exists?
  end
end
