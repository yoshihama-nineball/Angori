class ContactMessage < ApplicationRecord
  belongs_to :user, optional: true

  include ContactMessageDisplay
  include ContactMessageStats
  include ContactMessageWorkflow

  validates :name, presence: true, length: { maximum: 100 }
  validates :email, presence: true, format: {
    with: URI::MailTo::EMAIL_REGEXP,
    message: I18n.t('activerecord.errors.messages.email_format')
  }
  validates :subject, presence: true, length: { maximum: 200 }
  validates :message, presence: true, length: { maximum: 2000 }
  validates :category, presence: true, inclusion: {
    in: %w[general general_inquiry bug_report feature_request support feedback],
    message: I18n.t('activerecord.errors.messages.contact_category_inclusion')
  }

  validates :status, inclusion: { in: %w[pending in_progress resolved closed] }
  validates :admin_reply, length: { maximum: 3000 }

  scope :pending, -> { where(status: 'pending') }
  scope :in_progress, -> { where(status: 'in_progress') }
  scope :resolved, -> { where(status: 'resolved') }
  scope :closed, -> { where(status: 'closed') }
  scope :by_category, ->(category) { where(category: category) }
  scope :by_priority, ->(_priority) { all } # priority機能無効化
  scope :recent, -> { order(created_at: :desc) }
  scope :overdue, -> { pending.where(created_at: ..1.day.ago) }

  scope :priority_order, -> { order(:created_at) }
  scope :need_attention, lambda {
    pending.where(created_at: ...24.hours.ago)
  }

  def self.response_time_stats
    replied_messages = where.not(replied_at: nil)
    return default_stats if replied_messages.empty?

    response_times = calculate_response_times(replied_messages)
    build_stats(response_times)
  end

  def self.default_stats
    { average: 0, median: 0, min: 0, max: 0, count: 0 }
  end

  def self.calculate_response_times(messages)
    messages.map { |msg| (msg.replied_at - msg.created_at) / 1.hour }
  end

  def self.build_stats(response_times)
    sorted_times = response_times.sort
    {
      average: response_times.sum / response_times.size,
      median: sorted_times[sorted_times.size / 2],
      min: sorted_times.first,
      max: sorted_times.last,
      count: response_times.size
    }
  end

  def self.category_stats
    group(:category).count
  end

  # インスタンスメソッド
  def status_emoji
    case status
    when 'pending' then '⏳'
    when 'in_progress' then '🔄'
    when 'resolved' then '✅'
    when 'closed' then '🔒'
    else '❓'
    end
  end

  def category_emoji
    case category
    when 'general' then '💬'
    when 'bug_report' then '🐛'
    when 'feature_request' then '✨'
    when 'support' then '🆘'
    when 'feedback' then '💭'
    else '📝'
    end
  end

  def category_name
    case category
    when 'general' then '一般問い合わせ'
    when 'bug_report' then 'バグ報告'
    when 'feature_request' then '機能要望'
    when 'support' then 'サポート'
    when 'feedback' then 'フィードバック'
    else category
    end
  end

  def display_category
    "#{category_emoji} #{category_name}"
  end

  def from_registered_user?
    user_id.present?
  end

  before_validation :set_default_status, on: :create

  private

  def set_default_status
    self.status ||= 'pending'
  end
end
