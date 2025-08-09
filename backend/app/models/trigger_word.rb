class TriggerWord < ApplicationRecord
  belongs_to :user

  # Validations
  validates :name, presence: true, length: { maximum: 50 }
  validates :count, presence: true, numericality: { greater_than: 0 }
  validates :anger_level_avg, presence: true, numericality: { in: 1.0..10.0 }
  validates :category, presence: true, inclusion: { in: %w[work family social sensory other] }
  validates :name, uniqueness: { scope: :user_id }

  # Scopes
  scope :by_category, ->(category) { where(category: category) }
  scope :high_frequency, -> { where(count: 3..) }
  scope :high_anger, -> { where(anger_level_avg: 7.0..) }
  scope :recent, -> { order(last_triggered_at: :desc) }
  scope :frequent, -> { order(count: :desc) }
  scope :dangerous, -> { where('anger_level_avg >= ? AND count >= ?', 6.0, 2) }

  # Instance Methods
  def needs_attention?
    anger_level_avg >= 6.0 && count >= 3
  end

  def frequency_level
    case count
    when 1..2 then 'low'
    when 3..5 then 'medium'
    when 6..10 then 'high'
    else 'very_high'
    end
  end

  def anger_severity
    case anger_level_avg
    when 1.0..3.0 then 'mild'
    when 3.1..6.0 then 'moderate'
    when 6.1..8.0 then 'severe'
    else 'extreme'
    end
  end

  # Class Methods
  def self.most_common_for_user(user, limit = 5)
    where(user: user).frequent.limit(limit)
  end

  def self.most_dangerous_for_user(user, limit = 3)
    where(user: user).dangerous.limit(limit)
  end

  def self.improvement_candidates(user)
    where(user: user)
      .where('anger_level_avg >= ? AND count >= ?', 5.0, 2)
      .order(Arel.sql('anger_level_avg * count DESC'))
  end

  def self.by_category_stats(user)
    result = {}
    categories = where(user: user).distinct.pluck(:category)

    categories.each do |category|
      triggers = where(user: user, category: category)
      total_occurrences = triggers.sum(:count)
      weighted_anger_sum = triggers.sum('anger_level_avg * count')

      result[category] = {
        count: total_occurrences,
        avg_anger: total_occurrences.positive? ? (weighted_anger_sum / total_occurrences).round(1) : 0,
        triggers_count: triggers.count
      }
    end

    result
  end
end
