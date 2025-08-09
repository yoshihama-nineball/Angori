class Reminder < ApplicationRecord
  include ReminderDisplay
  include ReminderScheduling
  include ReminderEffectiveness

  belongs_to :user
  has_many :reminder_logs, dependent: :destroy

  validates :title, presence: true, length: { maximum: 100 }
  validates :message, presence: true, length: { maximum: 500 }
  validates :category, presence: true, inclusion: {
    in: %w[breathing meditation exercise relaxation mindfulness positive_thinking gratitude self_care music nature],
    message: I18n.t('activerecord.errors.messages.reminder_category_inclusion')
  }
  validates :schedule_time, presence: true, format: {
    with: /\A([01]?[0-9]|2[0-3]):[0-5][0-9]\z/,
    message: I18n.t('activerecord.errors.messages.reminder_time_format')
  }
  validates :frequency, presence: true, inclusion: { in: %w[daily weekly monthly] }

  scope :active, -> { where(active: true) }
  scope :inactive, -> { where(active: false) }
  scope :by_category, ->(category) { where(category: category) }
  scope :morning, -> { where(schedule_time: ..'12:00') }
  scope :afternoon, -> { where(schedule_time: '12:01'..'17:59') }
  scope :evening, -> { where(schedule_time: '18:00'..) }

  before_save :normalize_schedule_time

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
