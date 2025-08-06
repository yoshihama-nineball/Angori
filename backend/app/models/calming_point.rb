class CalmingPoint < ApplicationRecord
  belongs_to :user

  # Validations
  validates :total_points, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :current_level, presence: true, numericality: { greater_than_or_equal_to: 1 }
  validates :streak_days, presence: true, numericality: { greater_than_or_equal_to: 0 }

  # Main calculation method
  def calculate_points!
    new_points = calculate_base_points + calculate_bonus_points
    new_level = (new_points / 100) + 1
    new_streak = calculate_streak_days

    # レベルアップ履歴更新
    update_level_achievements(new_level) if new_level > current_level

    # マイルストーン達成チェック
    update_milestone_flags

    update!(
      total_points: new_points,
      current_level: new_level,
      streak_days: new_streak,
      last_action_date: Date.current
    )
  end

  def level_name
    case current_level
    when 1..2   then '生まれたてのゴリラ 🦍😤'
    when 3..5   then '修行中ゴリラ 🦍🧘'
    when 6..10  then '落ち着きゴリラ 🦍😌'
    when 11..15 then '賢者ゴリラ 🦍🧠'
    else             '禅マスターゴリラ 🦍✨'
    end
  end

  def next_level_points
    current_level * 100
  end

  def points_to_next_level
    next_level_points - total_points
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
    when 7..13  then 50   # 1週間連続
    when 14..29 then 100  # 2週間連続
    when 30..   then 200  # 1ヶ月連続
    else 0
    end
  end

  def improvement_bonus
    recent_avg = user.anger_logs.where(occurred_at: 1.week.ago..).average(:anger_level)
    previous_avg = user.anger_logs.where(occurred_at: 2.weeks.ago..1.week.ago).average(:anger_level)

    return 0 unless recent_avg && previous_avg

    improvement = previous_avg - recent_avg
    case improvement
    when 2.. then 50  # 2レベル以上改善
    when 1.. then 25  # 1レベル以上改善
    else 0
    end
  end

  def milestone_bonus
    consultation_count = user.anger_logs.where.not(ai_advice: [nil, '']).count
    case consultation_count
    when 1  then 20   # 初回相談
    when 10 then 30   # 相談マスター
    when 30 then 50   # ゴリラの知恵袋
    else 0
    end
  end

  def calculate_streak_days
    logs = user.anger_logs.order(occurred_at: :desc)
    return 0 if logs.empty?

    streak = 0
    current_date = Date.current
    dates_with_logs = logs.map { |log| log.occurred_at.to_date }.uniq.sort.reverse

    dates_with_logs.each do |log_date|
      expected_date = current_date - streak.days
      break if log_date < expected_date

      streak += 1 if log_date == expected_date
    end

    streak
  end

  def update_level_achievements(new_level)
    achievements = level_achievements || []

    (current_level + 1..new_level).each do |level|
      achievements << {
        level: level,
        achieved_at: Time.current.iso8601,
        points_required: level * 100,
        milestone_type: determine_milestone_type(level)
      }
    end

    self.level_achievements = achievements
  end

  def update_milestone_flags
    flags = milestone_flags || {}

    # 初回ログ作成
    flags['first_log_created'] = true if user.anger_logs.any?

    # 初回AI相談
    flags['first_ai_consultation'] = true if user.anger_logs.where.not(ai_advice: [nil, '']).any?

    # 連続記録
    flags['consecutive_7_days'] = true if streak_days >= 7
    flags['consecutive_30_days'] = true if streak_days >= 30

    # 怒りレベル改善
    recent_avg = user.anger_logs.where(occurred_at: 1.week.ago..).average(:anger_level)
    previous_avg = user.anger_logs.where(occurred_at: 2.weeks.ago..1.week.ago).average(:anger_level)
    flags['anger_level_reduced'] = true if recent_avg && previous_avg && (previous_avg - recent_avg >= 1)

    self.milestone_flags = flags
  end

  def determine_milestone_type(level)
    case level
    when 1..5   then 'beginner'
    when 6..10  then 'intermediate'
    when 11..15 then 'advanced'
    else             'master'
    end
  end
end
