module UserBadgeProgressCalculatorMethods
  def consultation_progress(user, threshold)
    count = user.anger_logs.where.not(ai_advice: [nil, '']).count
    (count.to_f / threshold) * 100
  end

  def consecutive_days_progress(user, threshold)
    current_streak = user.calming_point&.streak_days.to_i
    (current_streak.to_f / threshold) * 100
  end

  def consultation_count_progress(user, threshold)
    count = user.anger_logs.where.not(ai_advice: [nil, '']).count
    (count.to_f / threshold) * 100
  end

  def emotion_logs_progress(user, threshold)
    count = user.anger_logs.where.not(emotions_felt: [nil, '']).count
    (count.to_f / threshold) * 100
  end

  def trigger_analysis_progress(user, threshold)
    count = user.trigger_words.count
    (count.to_f / threshold) * 100
  end

  def calming_points_progress(user, threshold)
    current_points = user.calming_point&.total_points.to_i
    (current_points.to_f / threshold) * 100
  end

  def level_progress(user, threshold)
    current_level = user.calming_point&.current_level.to_i
    (current_level.to_f / threshold) * 100
  end
end
