class AngerLog < ApplicationRecord
  belongs_to :user

  # Validations
  validates :anger_level, presence: true, inclusion: { in: 1..10 }
  validates :occurred_at, presence: true
  validates :situation_description, presence: true, length: { maximum: 1000 }
  validates :location, length: { maximum: 100 }, allow_blank: true
  validates :ai_advice, length: { maximum: 2000 }, allow_blank: true
  validates :reflection, length: { maximum: 1000 }, allow_blank: true

  # Scopes
  scope :recent, -> { order(occurred_at: :desc) }
  scope :by_anger_level, ->(level) { where(anger_level: level) }  # 追加
  scope :by_date_range, ->(start_date, end_date) { where(occurred_at: start_date..end_date) }  # 追加
  scope :high_anger, -> { where(anger_level: 7..) }  # 追加（オプション）
  scope :with_ai_advice, -> { where.not(ai_advice: [nil, '']) }  # 追加（オプション）

  # Callbacks
  after_create :update_trigger_words
  after_create :update_calming_points

  private

  def update_trigger_words
    return if trigger_words.blank?
    
    trigger_words.split(',').each do |word|
      word = word.strip
      trigger_word = user.trigger_words.find_or_initialize_by(name: word)
      
      if trigger_word.persisted?
        trigger_word.count += 1
        trigger_word.anger_level_avg = calculate_avg_anger_level(word)
        trigger_word.last_triggered_at = occurred_at
      else
        trigger_word.anger_level_avg = anger_level.to_f
        trigger_word.last_triggered_at = occurred_at
        trigger_word.category = categorize_trigger_word(word)
      end
      
      trigger_word.save!
    end
  end

  def update_calming_points
    user.calming_point.calculate_points! if user.calming_point
  end

  def calculate_avg_anger_level(word)
    logs_with_word = user.anger_logs.where("trigger_words LIKE ?", "%#{word}%")
    logs_with_word.average(:anger_level).to_f
  end

  def categorize_trigger_word(word)
    work_keywords = %w[仕事 会議 締切 残業 上司 同僚 プレゼン]
    family_keywords = %w[家族 親 子供 兄弟 姉妹 配偶者]
    social_keywords = %w[友人 恋人 電話 メール SNS]
    sensory_keywords = %w[音 光 匂い 触感 人混み 騒音]

    return 'work' if work_keywords.any? { |keyword| word.include?(keyword) }
    return 'family' if family_keywords.any? { |keyword| word.include?(keyword) }
    return 'social' if social_keywords.any? { |keyword| word.include?(keyword) }
    return 'sensory' if sensory_keywords.any? { |keyword| word.include?(keyword) }
    'other'
  end
end