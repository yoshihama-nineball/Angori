class WiseSaying < ApplicationRecord
  # Validations
  validates :content, presence: true, length: { maximum: 500 }
  validates :author, presence: true, length: { maximum: 100 }
  validates :category, presence: true, inclusion: {
    in: %w[anger_management mindfulness self_acceptance self_care breathing_techniques motivation wisdom general],
    message: 'は有効なカテゴリを選択してください'
  }
  validates :anger_level_range, presence: true, inclusion: {
    in: %w[all low medium high],
    message: 'は all, low, medium, high のいずれかである必要があります'
  }

  # Scopes
  scope :by_category, ->(category) { where(category: category) }
  scope :for_anger_level, lambda { |level|
    case level.to_i
    when 1..3 then where(anger_level_range: %w[all low])
    when 4..6 then where(anger_level_range: %w[all medium])
    when 7..10 then where(anger_level_range: %w[all high])
    else where(anger_level_range: 'all')
    end
  }
  scope :general_wisdom, -> { where(anger_level_range: 'all') }
  scope :anger_management, -> { where(category: 'anger_management') }
  scope :mindfulness, -> { where(category: 'mindfulness') }
  scope :recent, -> { order(created_at: :desc) }
  scope :random_order, -> { order('RANDOM()') }

  # Instance Methods
  def category_emoji
    case category
    when 'anger_management' then '😤'
    when 'mindfulness' then '🧘'
    when 'self_acceptance' then '🤗'
    when 'self_care' then '💚'
    when 'breathing_techniques' then '🫁'
    when 'motivation' then '💪'
    when 'wisdom' then '🦉'
    when 'general' then '💭'
    else '📝'
    end
  end

  def category_name
    case category
    when 'anger_management' then 'アンガーマネジメント'
    when 'mindfulness' then 'マインドフルネス'
    when 'self_acceptance' then '自己受容'
    when 'self_care' then 'セルフケア'
    when 'breathing_techniques' then '呼吸法'
    when 'motivation' then 'モチベーション'
    when 'wisdom' then '知恵・智慧'
    when 'general' then '一般的な格言'
    else 'その他'
    end
  end

  def anger_level_name
    case anger_level_range
    when 'low' then '軽度の怒り (1-3)'
    when 'medium' then '中程度の怒り (4-6)'
    when 'high' then '強い怒り (7-10)'
    when 'all' then '全レベル対応'
    else '不明'
    end
  end

  def display_category
    "#{category_emoji} #{category_name}"
  end

  def formatted_content
    # 改行やフォーマットを保持した表示用
    content.gsub('\n', "\n")
  end

  def short_preview(length = 50)
    content.length > length ? "#{content[0..length]}..." : content
  end

  def suitable_for_anger_level?(level)
    case anger_level_range
    when 'all' then true
    when 'low' then level.between?(1, 3)
    when 'medium' then level.between?(4, 6)
    when 'high' then level.between?(7, 10)
    else false
    end
  end

  def effectiveness_for_level(anger_level)
    return 'perfect' if suitable_for_anger_level?(anger_level)
    return 'good' if anger_level_range == 'all'

    level_diff = case anger_level_range
                 when 'low' then (anger_level - 2).abs
                 when 'medium' then (anger_level - 5).abs
                 when 'high' then (anger_level - 8).abs
                 else 10
                 end

    case level_diff
    when 0..1 then 'excellent'
    when 2..3 then 'good'
    when 4..5 then 'fair'
    else 'poor'
    end
  end

  def sharing_text
    "「#{content}」 - #{author} #Angori #アンガーマネジメント ##{category_name.gsub(' ', '')}"
  end

  # Class Methods
  def self.random_for_level(anger_level)
    for_anger_level(anger_level).random_order.first
  end

  def self.daily_wisdom
    # 日替わりで同じ格言を表示（日付をシードにした疑似ランダム）
    seed = Date.current.strftime('%Y%m%d').to_i
    srand(seed)
    all.sample
  ensure
    srand # シードをリセット
  end

  def self.category_counts
    group(:category).count
  end

  def self.anger_level_distribution
    group(:anger_level_range).count
  end

  def self.search_content(query)
    where('content ILIKE ? OR author ILIKE ?', "%#{query}%", "%#{query}%")
  end

  def self.recommend_for_user(user, limit = 3)
    return random_order.limit(limit) unless user.anger_logs.any?

    # ユーザーの最近の怒りレベル傾向を分析
    recent_avg = user.anger_logs.where(occurred_at: 1.week.ago..).average(:anger_level)

    if recent_avg
      anger_level = recent_avg.round
      recommendations = for_anger_level(anger_level).random_order.limit(limit)

      # 足りない場合は全レベル対応で補完
      if recommendations.count < limit
        additional = general_wisdom.random_order.limit(limit - recommendations.count)
        recommendations = (recommendations + additional).uniq
      end

      recommendations.first(limit)
    else
      # データがない場合は汎用的な格言
      general_wisdom.random_order.limit(limit)
    end
  end

  def self.motivational_quotes
    where(category: %w[motivation self_care self_acceptance])
  end

  def self.calming_quotes
    where(category: %w[mindfulness breathing_techniques anger_management])
  end
end
