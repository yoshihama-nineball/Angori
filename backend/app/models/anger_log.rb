class AngerLog < ApplicationRecord
  belongs_to :user

  # Validations
  validates :anger_level, presence: true, inclusion: { in: 1..10 }
  validates :occurred_at, presence: true
  validates :situation_description, presence: true, length: { maximum: 300 }
  validates :location, length: { maximum: 30 }
  validates :ai_advice, length: { maximum: 400 }
  validates :reflection, length: { maximum: 300 }

  # Scopes
  scope :recent, -> { order(occurred_at: :desc) } # 新しい順
  scope :oldest, -> { order(occurred_at: :asc) } # 古い順
  scope :high_anger_first, -> { order(anger_level: :desc) } # 怒りレベル高い順
  scope :low_anger_first, -> { order(anger_level: :asc) }   # 怒りレベル低い順
  # 期間の絞り込み
  scope :by_date_range, ->(start_date, end_date) { where(occurred_at: start_date..end_date) }

  # Scopesの使用例:
  # AngerLog.recent.limit(10)                     # 最新10件
  # AngerLog.high_anger_first                     # 怒りレベル高い順
  # AngerLog.by_date_range(1.week.ago, Date.current).recent  # 今週分を最新順

  # Callbacks
  after_create :update_trigger_words
  after_create :update_calming_points

  private

  def update_trigger_words
    return if trigger_words.blank?

    trigger_words.split(/[,、]/).each do |word|
      word = word.strip
      trigger_word = user.trigger_words.find_or_initialize_by(name: word)

      # 既存レコードの場合はカウント更新
      if trigger_word.persisted?
        trigger_word.count += 1
        trigger_word.anger_level_avg = calculate_avg_anger_level(word)
        trigger_word.last_triggered_at = occurred_at
      else
        # 新規レコードの場合は初期値設定
        trigger_word.count = 1
        trigger_word.anger_level_avg = anger_level.to_f
        trigger_word.last_triggered_at = occurred_at
        trigger_word.category = categorize_trigger_word(word)
      end
      trigger_word.save!
    end
  end

  def update_calming_points
    user.calming_points.calculate_points!
  end

  def calculate_avg_anger_level(word)
    logs_with_word = user.anger_logs.where('trigger_words LIKE ?', "%#{word}%")
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
