class WiseSaying < ApplicationRecord
  include WiseSayingDisplay
  include WiseSayingEffectiveness
  include WiseSayingRecommendations
  include WiseSayingSearch

  validates :content, presence: true, length: { maximum: 500 }
  validates :author, presence: true, length: { maximum: 100 }
  validates :category, presence: true, inclusion: {
    in: %w[anger_management mindfulness self_acceptance self_care breathing_techniques motivation wisdom general],
    message: I18n.t('activerecord.errors.messages.wise_saying_category_inclusion')
  }
  validates :anger_level_range, presence: true, inclusion: {
    in: %w[all low medium high],
    message: I18n.t('activerecord.errors.messages.wise_saying_anger_level_inclusion')
  }

  scope :by_category, ->(category) { where(category: category) }
  scope :general_wisdom, -> { where(anger_level_range: 'all') }
  scope :anger_management, -> { where(category: 'anger_management') }
  scope :mindfulness, -> { where(category: 'mindfulness') }
  scope :recent, -> { order(created_at: :desc) }
  scope :random_order, -> { order('RANDOM()') }
end
