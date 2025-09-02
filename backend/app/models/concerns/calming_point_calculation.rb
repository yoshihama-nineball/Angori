module CalmingPointCalculation
  extend ActiveSupport::Concern

  def calculate_points!
    # 基本ポイントを再計算
    new_base_points = calculate_base_points

    # 既存のボーナスポイント（基本ポイント以外の部分）を保持
    current_bonus = total_points - (last_calculated_base_points || 0)

    # 新しいボーナスポイント（未付与分のみ）
    new_bonus_points = calculate_new_bonus_points

    # 合計ポイント = 新しい基本ポイント + 既存ボーナス + 新規ボーナス
    new_total_points = new_base_points + current_bonus + new_bonus_points
    new_level = (new_total_points / 100) + 1
    new_streak = calculate_streak_days

    # レベルアップ処理
    update_level_achievements(new_level) if new_level > current_level

    # マイルストーンフラグ更新
    update_milestone_flags

    update!(
      total_points: new_total_points,
      current_level: new_level,
      streak_days: new_streak,
      last_action_date: Date.current,
      last_calculated_base_points: new_base_points
    )
  end

  # 振り返りポイント追加（詳細モーダル表示時）
  def add_reflection_points!
    today = Date.current
    return if last_reflection_date == today

    update!(
      total_points: total_points + 3,
      last_reflection_date: today
    )

    # レベルチェック
    new_level = (total_points / 100) + 1
    return unless new_level > current_level

    update_level_achievements(new_level)
    update!(current_level: new_level)
  end

  private

  def calculate_base_points
    log_points = user.anger_logs.count * 5
    consultation_points = user.anger_logs.where.not(ai_advice: [nil, '']).count * 10
    log_points + consultation_points
  end

  def calculate_new_bonus_points
    new_streak_bonus + new_improvement_bonus + new_milestone_bonus
  end

  # 新規達成した連続記録ボーナスのみ
  def new_streak_bonus
    current_streak = calculate_streak_days
    previous_streak = streak_days || 0
    bonus = 0

    bonus += check_streak_milestone(current_streak, previous_streak, 7, 50, 'streak_7_days')
    bonus += check_streak_milestone(current_streak, previous_streak, 14, 100, 'streak_14_days')
    bonus += check_streak_milestone(current_streak, previous_streak, 30, 200, 'streak_30_days')

    bonus
  end

  def check_streak_milestone(current, previous, target_days, bonus_points, bonus_type)
    return 0 unless current >= target_days
    return 0 unless previous < target_days
    return 0 if bonus_awarded?(bonus_type)

    mark_bonus_awarded(bonus_type)
    bonus_points
  end

  def new_improvement_bonus
    return 0 unless should_check_weekly_improvement?

    recent_avg, previous_avg = calculate_weekly_averages
    return 0 unless recent_avg && previous_avg

    improvement = previous_avg - recent_avg
    bonus = calculate_improvement_bonus_amount(improvement)

    update_improvement_check_date if bonus.positive?
    bonus
  end

  def calculate_weekly_averages
    recent_avg = user.anger_logs.where(occurred_at: 1.week.ago..).average(:anger_level)
    previous_avg = user.anger_logs.where(occurred_at: 2.weeks.ago..1.week.ago).average(:anger_level)
    [recent_avg, previous_avg]
  end

  def calculate_improvement_bonus_amount(improvement)
    case improvement
    when 2.. then 50
    when 1.. then 25
    else 0
    end
  end

  def update_improvement_check_date
    update!(last_improvement_check_date: Date.current)
  end

  def new_milestone_bonus
    consultation_count = user.anger_logs.where.not(ai_advice: [nil, '']).count
    bonus = 0

    bonus += check_consultation_milestone(consultation_count, 1, 20, 'first_consultation')
    bonus += check_consultation_milestone(consultation_count, 10, 30, 'ten_consultations')
    bonus += check_consultation_milestone(consultation_count, 30, 50, 'thirty_consultations')

    bonus
  end

  def check_consultation_milestone(count, target, bonus_points, bonus_type)
    return 0 unless count >= target
    return 0 if bonus_awarded?(bonus_type)

    mark_bonus_awarded(bonus_type)
    bonus_points
  end

  def should_check_weekly_improvement?
    last_check = last_improvement_check_date
    last_check.nil? || last_check < 1.week.ago
  end

  def bonus_awarded?(bonus_type)
    bonus_flags = awarded_bonuses || {}
    bonus_flags[bonus_type] == true
  end

  def mark_bonus_awarded(bonus_type)
    flags = awarded_bonuses || {}
    flags[bonus_type] = true
    update!(awarded_bonuses: flags)
  end
end
