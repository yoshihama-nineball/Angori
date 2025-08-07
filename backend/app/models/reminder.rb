class Reminder < ApplicationRecord
  belongs_to :user

  # Validations
  validates :title, presence: true, length: { maximum: 100 }
  validates :message, presence: true, length: { maximum: 500 }
  validates :reminder_category, presence: true, inclusion: {
    in: %w[daily_log consultation reflection breathing exercise meditation break water_intake positive_thinking],
    message: 'は有効なカテゴリを選択してください'
  }
  validates :schedule_time, presence: true, format: {
    with: /\A([01]?[0-9]|2[0-3]):[0-5][0-9]\z/,
    message: 'は HH:MM 形式で入力してください（例: 09:30）'
  }
  validates :days_of_week, presence: true
  validates :is_active, inclusion: { in: [true, false] }

  # Scopes
  scope :active, -> { where(is_active: true) }
  scope :inactive, -> { where(is_active: false) }
  scope :by_category, ->(category) { where(reminder_category: category) }
  scope :daily_logs, -> { where(reminder_category: 'daily_log') }
  scope :consultations, -> { where(reminder_category: 'consultation') }
  scope :reflection_reminders, -> { where(reminder_category: 'reflection') }
  scope :breathing_exercises, -> { where(reminder_category: 'breathing') }
  scope :for_today, -> { where('days_of_week @> ?', [Date.current.wday].to_json) }
  scope :for_day, ->(day) { where('days_of_week @> ?', [day].to_json) }
  scope :morning, -> { where('schedule_time < ?', '12:00') }
  scope :afternoon, -> { where('schedule_time BETWEEN ? AND ?', '12:00', '18:00') }
  scope :evening, -> { where('schedule_time > ?', '18:00') }
  scope :recent, -> { order(created_at: :desc) }

  # Instance Methods
  def category_emoji
    case reminder_category
    when 'daily_log' then '📝'
    when 'consultation' then '🤖'
    when 'reflection' then '🪞'
    when 'breathing' then '🫁'
    when 'exercise' then '🏃'
    when 'meditation' then '🧘'
    when 'break' then '☕'
    when 'water_intake' then '💧'
    when 'positive_thinking' then '✨'
    else '⏰'
    end
  end

  def category_name
    case reminder_category
    when 'daily_log' then '日記・ログ記録'
    when 'consultation' then 'AI相談'
    when 'reflection' then '振り返り・内省'
    when 'breathing' then '呼吸法・深呼吸'
    when 'exercise' then '運動・ストレッチ'
    when 'meditation' then '瞑想・マインドフルネス'
    when 'break' then '休憩・リラックス'
    when 'water_intake' then '水分補給'
    when 'positive_thinking' then 'ポジティブ思考'
    else 'その他'
    end
  end

  def display_category
    "#{category_emoji} #{category_name}"
  end

  def scheduled_for_today?
    days_of_week.include?(Date.current.wday)
  end

  def scheduled_for_day?(day)
    days_of_week.include?(day)
  end

  def next_scheduled_time
    return nil unless is_active?

    time_parts = schedule_time.split(':')
    hour = time_parts[0].to_i
    minute = time_parts[1].to_i

    # 今日が対象曜日の場合
    if scheduled_for_today?
      today_time = Time.current.beginning_of_day + hour.hours + minute.minutes
      return today_time if today_time > Time.current
    end

    # 次の対象曜日を探す
    (1..7).each do |days_ahead|
      target_date = Date.current + days_ahead.days
      return target_date.beginning_of_day + hour.hours + minute.minutes if days_of_week.include?(target_date.wday)
    end

    nil
  end

  def time_until_next
    next_time = next_scheduled_time
    return nil unless next_time

    seconds = (next_time - Time.current).to_i
    return '過去の時刻です' if seconds < 0

    if seconds < 3600
      "#{seconds / 60}分後"
    elsif seconds < 86_400
      hours = seconds / 3600
      minutes = (seconds % 3600) / 60
      "#{hours}時間#{minutes}分後"
    else
      days = seconds / 86_400
      hours = (seconds % 86_400) / 3600
      "#{days}日#{hours}時間後"
    end
  end

  def days_of_week_names
    day_names = %w[日 月 火 水 木 金 土]
    days_of_week.sort.map { |day| day_names[day] }.join('・')
  end

  def formatted_schedule
    "#{days_of_week_names} #{schedule_time}"
  end

  def should_trigger_now?
    return false unless is_active? && scheduled_for_today?

    current_time = Time.current.strftime('%H:%M')
    current_time == schedule_time
  end

  def frequency_description
    case days_of_week.length
    when 7 then '毎日'
    when 5 then days_of_week.sort == [1, 2, 3, 4, 5] ? '平日' : "週#{days_of_week.length}日"
    when 2 then days_of_week.sort == [0, 6] ? '週末' : "週#{days_of_week.length}日"
    when 1 then '週1回'
    else "週#{days_of_week.length}日"
    end
  end

  def effectiveness_score
    # リマインダーの効果を測定（簡略版）
    base_score = case reminder_category
                 when 'daily_log' then 8
                 when 'consultation' then 9
                 when 'reflection' then 7
                 when 'breathing' then 8
                 when 'meditation' then 9
                 else 6
                 end

    # 頻度による調整
    frequency_bonus = case days_of_week.length
                      when 7 then 2    # 毎日
                      when 5..6 then 1 # ほぼ毎日
                      else 0
                      end

    # アクティブ状態による調整
    active_bonus = is_active? ? 1 : -2

    [base_score + frequency_bonus + active_bonus, 1].max
  end

  def toggle_active!
    update!(is_active: !is_active?)
  end

  def snooze_until(minutes)
    # 指定した分数後に再通知するためのロジック（将来の通知機能用）
    new_time = Time.current + minutes.minutes
    {
      snooze_until: new_time,
      original_time: schedule_time,
      snooze_duration: minutes
    }
  end

  # Class Methods
  def self.due_now
    active.where('? = ANY(days_of_week)', Date.current.wday)
          .where(schedule_time: Time.current.strftime('%H:%M'))
  end

  def self.due_in_minutes(minutes)
    target_time = (Time.current + minutes.minutes).strftime('%H:%M')
    active.where('? = ANY(days_of_week)', Date.current.wday)
          .where(schedule_time: target_time)
  end

  def self.for_user_today(user)
    where(user: user).active.for_today.order(:schedule_time)
  end

  def self.next_for_user(user, limit = 3)
    user_reminders = where(user: user).active
    next_reminders = []

    user_reminders.each do |reminder|
      next_time = reminder.next_scheduled_time
      next if next_time.nil?

      next_reminders << {
        reminder: reminder,
        next_time: next_time,
        time_until: reminder.time_until_next
      }
    end

    next_reminders.sort_by { |r| r[:next_time] }.first(limit)
  end

  def self.category_stats(user)
    where(user: user).group(:reminder_category).count
  end

  def self.effectiveness_report(user)
    reminders = where(user: user)
    active_reminders = reminders.active

    effectiveness_scores = active_reminders.map(&:effectiveness_score)
    avg_effectiveness = effectiveness_scores.any? ? (effectiveness_scores.sum.to_f / effectiveness_scores.size).round(1) : 0

    {
      total_reminders: reminders.count,
      active_count: active_reminders.count,
      inactive_count: reminders.inactive.count,
      avg_effectiveness: avg_effectiveness,
      daily_frequency: active_reminders.sum { |r| r.days_of_week.length },
      most_common_category: reminders.group(:reminder_category).count.max_by { |_k, v| v }&.first
    }
  end


  def self.suggest_optimal_times(user)
    # ユーザーの行動パターンに基づいて最適な時間を提案（簡略版）
    user_logs = user.anger_logs.where(occurred_at: 1.month.ago..)

    if user_logs.any?
      # よく記録する時間帯を分析
      hours = user_logs.map { |log| log.occurred_at.hour }
      most_active_hour = hours.group_by(&:itself).max_by { |_k, v| v.length }&.first

      suggestions = []

      # 朝のリマインダー
      suggestions << {
        time: '08:00',
        category: 'daily_log',
        reason: '一日の始まりに目標設定'
      }

      # ユーザーがよく活動する時間の1時間前
      if most_active_hour && most_active_hour > 1
        prev_hour = format('%02d:00', most_active_hour - 1)
        suggestions << {
          time: prev_hour,
          category: 'breathing',
          reason: 'よく活動する時間の前に準備'
        }
      end

      # 夜の振り返り
      suggestions << {
        time: '21:00',
        category: 'reflection',
        reason: '一日の振り返りと整理'
      }

      suggestions
    else
      # デフォルトの提案
      [
        { time: '08:00', category: 'daily_log', reason: '朝の習慣として' },
        { time: '12:00', category: 'breathing', reason: '昼休みのリフレッシュ' },
        { time: '20:00', category: 'reflection', reason: '夜の振り返り' }
      ]
    end
  end

  private

  def normalize_schedule_time
    # 時刻フォーマットの正規化（必要に応じて）
    return unless schedule_time.present? && schedule_time.match(/\A\d{1,2}:\d{2}\z/)

    parts = schedule_time.split(':')
    self.schedule_time = format('%02d:%02d', parts[0].to_i, parts[1].to_i)
  end
end
