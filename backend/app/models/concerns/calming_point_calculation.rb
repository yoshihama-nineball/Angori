module CalmingPointCalculation
  extend ActiveSupport::Concern

  def calculate_points!
    new_points = calculate_base_points + calculate_bonus_points
    new_level = (new_points / 100) + 1
    new_streak = calculate_streak_days

    update_level_achievements(new_level) if new_level > current_level
    update_milestone_flags

    update!(
      total_points: new_points,
      current_level: new_level,
      streak_days: new_streak,
      last_action_date: Date.current
    )
  end

  private

  def calculate_base_points
    log_points = user.anger_logs.count * 5
    consultation_points = user.anger_logs.where.not(ai_advice: [nil, '']).count * 10
    log_points + consultation_points
  end

  def calculate_bonus_points
    streak_bonus + improvement_bonus + milestone_bonus
  end

  def streak_bonus
    case streak_days
    when 7..13  then 50
    when 14..29 then 100
    when 30..   then 200
    else 0
    end
  end

  def improvement_bonus
    recent_avg = user.anger_logs.where(occurred_at: 1.week.ago..).average(:anger_level)
    previous_avg = user.anger_logs.where(occurred_at: 2.weeks.ago..1.week.ago).average(:anger_level)

    return 0 unless recent_avg && previous_avg

    improvement = previous_avg - recent_avg
    case improvement
    when 2.. then 50
    when 1.. then 25
    else 0
    end
  end

  def milestone_bonus
    consultation_count = user.anger_logs.where.not(ai_advice: [nil, '']).count
    case consultation_count
    when 1  then 20
    when 10 then 30
    when 30 then 50
    else 0
    end
  end
end
