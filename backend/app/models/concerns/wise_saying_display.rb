module WiseSayingDisplay
  extend ActiveSupport::Concern

  CATEGORY_EMOJIS = {
    'anger_management' => '😤',
    'mindfulness' => '🧘',
    'self_acceptance' => '🤗',
    'self_care' => '💚',
    'breathing_techniques' => '🫁',
    'motivation' => '💪',
    'wisdom' => '🦉',
    'general' => '💭'
  }.freeze

  CATEGORY_NAMES = {
    'anger_management' => 'アンガーマネジメント',
    'mindfulness' => 'マインドフルネス',
    'self_acceptance' => '自己受容',
    'self_care' => 'セルフケア',
    'breathing_techniques' => '呼吸法',
    'motivation' => 'モチベーション',
    'wisdom' => '知恵・智慧',
    'general' => '一般的な格言'
  }.freeze

  ANGER_LEVEL_NAMES = {
    'low' => '軽度の怒り (1-3)',
    'medium' => '中程度の怒り (4-6)',
    'high' => '強い怒り (7-10)',
    'all' => '全レベル対応'
  }.freeze

  def category_emoji
    CATEGORY_EMOJIS[category] || '📝'
  end

  def category_name
    CATEGORY_NAMES[category] || 'その他'
  end

  def anger_level_name
    ANGER_LEVEL_NAMES[anger_level_range] || '不明'
  end

  def display_category
    "#{category_emoji} #{category_name}"
  end

  def formatted_content
    content.gsub('\n', "\n")
  end

  def short_preview(length = 50)
    content.length > length ? "#{content[0..length]}..." : content
  end

  def sharing_text
    "「#{content}」 - #{author} #Angori #アンガーマネジメント ##{category_name.gsub(' ', '')}"
  end
end
