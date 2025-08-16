class AngerLog < ApplicationRecord
  include AngerLogTriggerWords

  belongs_to :user

  validates :anger_level, presence: true, inclusion: { in: 1..10 }
  validates :occurred_at, presence: true
  validates :situation_description, presence: true, length: { maximum: 1000 }
  validates :location, length: { maximum: 100 }, allow_blank: true
  validates :ai_advice, length: { maximum: 2000 }, allow_blank: true
  validates :reflection, length: { maximum: 1000 }, allow_blank: true
  validates :perception, length: { maximum: 1000 }, allow_blank: true

  scope :recent, -> { order(occurred_at: :desc) }
  scope :by_anger_level, ->(level) { where(anger_level: level) }
  scope :by_date_range, ->(start_date, end_date) { where(occurred_at: start_date..end_date) }
  scope :high_anger, -> { where(anger_level: 7..) }
  scope :with_ai_advice, -> { where.not(ai_advice: [nil, '']) }

  after_create :update_calming_points

  private

  def update_calming_points
    user.calming_point&.calculate_points!
  end
end
