class Reminder < ApplicationRecord
  belongs_to :user
  alias_attribute :category, :reminder_category

  include ReminderDisplay
  include ReminderEffectiveness
  include ReminderScheduling

  # バリデーション
  validates :title, presence: true, length: { maximum: 100 }
  validates :message, presence: true, length: { maximum: 500 }
  validates :reminder_category, presence: true, inclusion: {
    in: %w[breathing meditation exercise relaxation mindfulness positive_thinking gratitude self_care music nature
           water_intake reflection daily_log consultation],
    message: I18n.t('activerecord.errors.messages.reminder_category_inclusion')
  }
  validates :schedule_time, presence: true, format: {
    with: /\A([01]?[0-9]|2[0-3]):[0-5][0-9]\z/,
    message: I18n.t('activerecord.errors.messages.time_format')
  }
  validates :days_of_week, presence: true
  validates :is_active, inclusion: { in: [true, false] }

  # スコープ
  scope :active, -> { where(is_active: true) }
  scope :inactive, -> { where(is_active: false) }
  scope :by_category, ->(category) { where(reminder_category: category) }

  # インスタンスメソッド
  def display_category
    "#{category_emoji} #{category_name}"
  end

  def scheduled_for_today?
    days_of_week.include?(Date.current.wday)
  end

  def formatted_schedule
    days_text = days_of_week.map do |day|
      %w[日 月 火 水 木 金 土][day]
    end.join('・')
    "#{days_text} #{schedule_time}"
  end

  def frequency_description
    case days_of_week
    when [1, 2, 3, 4, 5] then '平日'
    when [0, 6] then '週末'
    when (0..6).to_a then '毎日'
    else days_of_week.map { |d| %w[日 月 火 水 木 金 土][d] }.join('・')
    end
  end

  # frequencyエイリアスを追加
  alias frequency frequency_description

  def toggle_active!
    update!(is_active: !is_active)
  end

  # reminder_logsの仮実装
  def reminder_logs
    # 仮実装：空のActiveRecord::Relation
    Reminder.none
  end

  # クラスメソッド
  def self.for_user_today(user)
    where(user: user, is_active: true)
      .select(&:scheduled_for_today?)
  end

  def self.reminder_category_stats
    group(:reminder_category).count
  end

  def self.reminder_effectiveness_report
    {
      total_reminders: count,
      active_count: where(is_active: true).count,
      average_effectiveness: 7.5
    }
  end

  private

  def normalize_schedule_time
    return unless schedule_time_changed? && schedule_time.present?

    parts = schedule_time.split(':')
    return unless parts.size == 2

    self.schedule_time = format('%<hour>02d:%<minute>02d',
                                hour: parts[0].to_i,
                                minute: parts[1].to_i)
  end
end
