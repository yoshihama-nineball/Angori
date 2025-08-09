class ContactMessage < ApplicationRecord
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
    in: %w[general bug_report feature_request support feedback],
    message: I18n.t('activerecord.errors.messages.contact_category_inclusion')
  }
  validates :priority, presence: true, inclusion: {
    in: %w[low medium high urgent],
    message: I18n.t('activerecord.errors.messages.contact_priority_inclusion')
  }
  validates :status, inclusion: { in: %w[pending in_progress resolved closed] }

  scope :pending, -> { where(status: 'pending') }
  scope :in_progress, -> { where(status: 'in_progress') }
  scope :resolved, -> { where(status: 'resolved') }
  scope :closed, -> { where(status: 'closed') }
  scope :by_category, ->(category) { where(category: category) }
  scope :by_priority, ->(priority) { where(priority: priority) }
  scope :recent, -> { order(created_at: :desc) }
  scope :overdue, -> { pending.where(created_at: ..1.day.ago) }

  before_validation :set_default_status, on: :create
  before_validation :set_default_priority, on: :create

  private

  def set_default_status
    self.status ||= 'pending'
  end

  def set_default_priority
    self.priority ||= 'medium'
  end
end
