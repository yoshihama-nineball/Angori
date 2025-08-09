module BadgeEligibility
  extend ActiveSupport::Concern

  ELIGIBILITY_CHECKERS = {
    'first_consultation' => :consultation_eligible?,
    'consecutive_days' => :consecutive_days_eligible?,
    'consultation_count' => :consultation_count_eligible?,
    'detailed_emotion_logs' => :emotion_logs_eligible?,
    'anger_improvement' => :anger_improvement_eligible?,
    'trigger_analysis' => :trigger_analysis_eligible?,
    'calming_points' => :calming_points_eligible?,
    'level_reached' => :level_reached_eligible?
  }.freeze

  def check_eligibility(user)
    checker_method = ELIGIBILITY_CHECKERS[requirements['type']]
    return false unless checker_method

    send(checker_method, user)
  end

  def eligible_for_user?(user)
    return false if earned_by?(user)

    check_eligibility(user)
  end

  def award_badge_to_user!(user)
    return if earned_by?(user)
    return unless check_eligibility(user)

    UserBadge.create!(user: user, badge: self)
  end

  private

  def consultation_eligible?(user)
    user.anger_logs.where.not(ai_advice: [nil, '']).count >= requirements['threshold']
  end

  def consecutive_days_eligible?(user)
    user.calming_point&.streak_days.to_i >= requirements['threshold']
  end

  def consultation_count_eligible?(user)
    user.anger_logs.where.not(ai_advice: [nil, '']).count >= requirements['threshold']
  end

  def emotion_logs_eligible?(user)
    user.anger_logs.where.not(emotions_felt: [nil, '']).count >= requirements['threshold']
  end

  def anger_improvement_eligible?(user)
    recent_avg = user.anger_logs.where(occurred_at: 1.week.ago..).average(:anger_level)
    old_avg = user.anger_logs.where(occurred_at: 1.month.ago..2.weeks.ago).average(:anger_level)
    return false unless recent_avg && old_avg

    (old_avg - recent_avg) >= requirements['threshold']
  end

  def trigger_analysis_eligible?(user)
    user.trigger_words.count >= requirements['threshold']
  end

  def calming_points_eligible?(user)
    user.calming_point&.total_points.to_i >= requirements['threshold']
  end

  def level_reached_eligible?(user)
    user.calming_point&.current_level.to_i >= requirements['threshold']
  end
end
