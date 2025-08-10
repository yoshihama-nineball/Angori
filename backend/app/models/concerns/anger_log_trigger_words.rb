module AngerLogTriggerWords
  extend ActiveSupport::Concern

  TRIGGER_CATEGORIES = {
    'work' => %w[仕事 会議 締切 残業 上司 同僚 プレゼン],
    'family' => %w[家族 親 子供 兄弟 姉妹 配偶者],
    'social' => %w[友人 恋人 電話 メール SNS],
    'sensory' => %w[音 光 匂い 触感 人混み 騒音]
  }.freeze

  included do
    after_create :update_trigger_words
  end

  private

  def update_trigger_words
    return if trigger_words.blank?

    parse_trigger_words.each do |word|
      process_trigger_word(word)
    end
  end

  def parse_trigger_words
    trigger_words.split(',').map(&:strip).reject(&:empty?)
  end

  def process_trigger_word(word)
    trigger_word = find_or_create_trigger_word(word)
    update_trigger_word_attributes(trigger_word, word)
    trigger_word.save!
  end

  def find_or_create_trigger_word(word)
    user.trigger_words.find_or_initialize_by(name: word)
  end

  def update_trigger_word_attributes(trigger_word, word)
    if trigger_word.persisted?
      update_existing_trigger_word(trigger_word, word)
    else
      initialize_new_trigger_word(trigger_word, word)
    end
  end

  def update_existing_trigger_word(trigger_word, word)
    trigger_word.count += 1
    trigger_word.anger_level_avg = calculate_avg_anger_level(word)
    trigger_word.last_triggered_at = occurred_at
  end

  def initialize_new_trigger_word(trigger_word, word)
    trigger_word.anger_level_avg = anger_level.to_f
    trigger_word.last_triggered_at = occurred_at
    trigger_word.category = categorize_trigger_word(word)
  end

  def calculate_avg_anger_level(word)
    logs_with_word = user.anger_logs.where('trigger_words LIKE ?', "%#{word}%")
    logs_with_word.average(:anger_level).to_f
  end

  def categorize_trigger_word(word)
    TRIGGER_CATEGORIES.each do |category, keywords|
      return category if keywords.any? { |keyword| word.include?(keyword) }
    end
    'other'
  end
end
