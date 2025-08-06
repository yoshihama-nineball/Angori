class ContactMessage < ApplicationRecord
  belongs_to :user, optional: true

  # Validations
  validates :email, presence: true, format: {
    with: URI::MailTo::EMAIL_REGEXP,
    message: 'の形式が正しくありません'
  }
  validates :name, presence: true, length: { maximum: 50 }
  validates :subject, presence: true, length: { maximum: 100 }
  validates :message, presence: true, length: { maximum: 2000 }
  validates :category, inclusion: {
    in: %w[bug_report feature_request general_inquiry account_issue other],
    message: 'が無効です'
  }
  validates :status, inclusion: {
    in: %w[pending in_progress resolved closed],
    message: 'が無効です'
  }
  validates :admin_reply, length: { maximum: 3000 }, allow_blank: true

  # Scopes
  scope :pending, -> { where(status: 'pending') }
  scope :in_progress, -> { where(status: 'in_progress') }
  scope :resolved, -> { where(status: 'resolved') }
  scope :closed, -> { where(status: 'closed') }
  scope :unresolved, -> { where(status: %w[pending in_progress]) }
  scope :recent, -> { order(created_at: :desc) }
  scope :by_category, ->(category) { where(category: category) }
  scope :replied, -> { where.not(admin_reply: [nil, '']) }
  scope :unreplied, -> { where(admin_reply: [nil, '']) }

  # Callbacks
  before_validation :set_defaults, on: :create
  after_update :set_replied_at, if: :saved_change_to_admin_reply?

  # Instance Methods
  def status_color
    case status
    when 'pending' then 'yellow'
    when 'in_progress' then 'blue'
    when 'resolved' then 'green'
    when 'closed' then 'gray'
    end
  end

  def status_emoji
    case status
    when 'pending' then '⏳'
    when 'in_progress' then '🔄'
    when 'resolved' then '✅'
    when 'closed' then '🔒'
    end
  end

  def category_name
    case category
    when 'bug_report' then 'バグ報告'
    when 'feature_request' then '機能要望'
    when 'general_inquiry' then '一般的な問い合わせ'
    when 'account_issue' then 'アカウント問題'
    when 'other' then 'その他'
    end
  end

  def category_emoji
    case category
    when 'bug_report' then '🐛'
    when 'feature_request' then '💡'
    when 'general_inquiry' then '❓'
    when 'account_issue' then '👤'
    when 'other' then '📝'
    end
  end

  def display_category
    "#{category_emoji} #{category_name}"
  end

  def replied?
    admin_reply.present? && replied_at.present?
  end

  def response_time_hours
    return nil unless replied_at

    ((replied_at - created_at) / 1.hour).round(1)
  end

  def from_registered_user?
    user.present?
  end

  def priority_score
    base_score = case category
                 when 'account_issue' then 10
                 when 'bug_report' then 8
                 when 'feature_request' then 5
                 when 'general_inquiry' then 3
                 else 1
                 end

    # 登録ユーザーは優先度アップ
    base_score += 2 if from_registered_user?

    # 古いメッセージは優先度アップ
    days_old = (Time.current - created_at) / 1.day
    base_score += (days_old / 2).to_i

    base_score
  end

  def can_be_closed?
    %w[resolved].include?(status)
  end

  def auto_close_eligible?
    resolved? && replied_at && replied_at < 7.days.ago
  end

  # Class Methods
  def self.priority_order
    order(Arel.sql("
      CASE
        WHEN status = 'pending' THEN 1
        WHEN status = 'in_progress' THEN 2
        WHEN status = 'resolved' THEN 3
        ELSE 4
      END,
      CASE category
        WHEN 'account_issue' THEN 1
        WHEN 'bug_report' THEN 2
        WHEN 'feature_request' THEN 3
        WHEN 'general_inquiry' THEN 4
        ELSE 5
      END,
      created_at ASC
    "))
  end

  def self.need_attention
    unresolved.where(created_at: ...24.hours.ago)
  end

  def self.response_time_stats
    replied_messages = replied.where.not(replied_at: nil)
    return {} if replied_messages.empty?

    response_times = replied_messages.map(&:response_time_hours).compact
    {
      average: (response_times.sum / response_times.count).round(1),
      median: response_times.sort[response_times.count / 2].round(1),
      min: response_times.min.round(1),
      max: response_times.max.round(1)
    }
  end

  def self.category_stats
    group(:category, :status).count
  end

  private

  def set_defaults
    self.status ||= 'pending'
    self.category ||= 'general_inquiry'
  end

  def set_replied_at
    return unless admin_reply.present? && admin_reply_was.blank?

    update_column(:replied_at, Time.current)
    update_column(:status, 'resolved') if status == 'pending'
  end
end
