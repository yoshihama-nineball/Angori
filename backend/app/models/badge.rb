class Badge < ApplicationRecord
  has_many :user_badges, dependent: :destroy
  has_many :users, through: :user_badges

  # Validations
  validates :name, presence: true, length: { maximum: 100 }, uniqueness: true
  validates :description, presence: true, length: { maximum: 500 }
  validates :badge_type, presence: true, inclusion: {
    in: %w[milestone achievement special rare],
    message: 'は milestone, achievement, special, rare のいずれかである必要があります'
  }
  validates :points_reward, presence: true, numericality: { greater_than: 0, less_than: 1000 }
  validates :requirements, presence: true

  # Scopes
  scope :by_type, ->(type) { where(badge_type: type) }
  scope :milestone_badges, -> { where(badge_type: 'milestone') }
  scope :achievement_badges, -> { where(badge_type: 'achievement') }
  scope :special_badges, -> { where(badge_type: 'special') }
  scope :rare_badges, -> { where(badge_type: 'rare') }
  scope :high_reward, -> { where('points_reward >= ?', 50) }
  scope :by_difficulty, -> { order(:points_reward) }
  scope :recently_created, -> { order(created_at: :desc) }

  # Instance Methods
  def badge_emoji
    case badge_type
    when 'milestone' then '🎯'
    when 'achievement' then '🏆'
    when 'special' then '⭐'
    when 'rare' then '💎'
    end
  end

  def difficulty_level
    case points_reward
    when 1..19 then 'easy'
    when 20..49 then 'medium'
    when 50..99 then 'hard'
    else 'legendary'
    end
  end

  def difficulty_color
    case difficulty_level
    when 'easy' then 'green'
    when 'medium' then 'yellow'
    when 'hard' then 'orange'
    when 'legendary' then 'purple'
    end
  end

  def display_name
    "#{badge_emoji} #{name}"
  end

  def earned_by?(user)
    user_badges.exists?(user: user)
  end

  def earned_count
    user_badges.count
  end

  def rarity_percentage
    total_users = User.count
    return 0 if total_users == 0

    ((earned_count.to_f / total_users) * 100).round(1)
  end

  def is_rare?
    rarity_percentage < 10.0
  end

  def requirements_text
    case requirements['type']
    when 'first_consultation'
      "AI相談を#{requirements['threshold']}回完了する"
    when 'consecutive_days'
      "#{requirements['threshold']}日連続でログを記録する"
    when 'consultation_count'
      "AI相談を#{requirements['threshold']}回以上完了する"
    when 'detailed_emotion_logs'
      "詳細な感情記録を#{requirements['threshold']}回以上行う"
    when 'anger_improvement'
      "怒りレベルの平均値を#{requirements['threshold']}以上改善する"
    when 'trigger_analysis'
      "トリガーワード分析を#{requirements['threshold']}回以上完了する"
    when 'calming_points'
      "#{requirements['threshold']}ポイント以上を獲得する"
    when 'level_reached'
      "レベル#{requirements['threshold']}に到達する"
    else
      requirements.to_s
    end
  end

  def check_eligibility(user)
    case requirements['type']
    when 'first_consultation'
      user.anger_logs.where.not(ai_advice: [nil, '']).count >= requirements['threshold']
    when 'consecutive_days'
      user.calming_point&.streak_days.to_i >= requirements['threshold']
    when 'consultation_count'
      user.anger_logs.where.not(ai_advice: [nil, '']).count >= requirements['threshold']
    when 'detailed_emotion_logs'
      user.anger_logs.where.not(emotions_felt: [nil, '']).count >= requirements['threshold']
    when 'anger_improvement'
      # 改善度チェック（簡略版）
      recent_avg = user.anger_logs.where(occurred_at: 1.week.ago..).average(:anger_level)
      old_avg = user.anger_logs.where(occurred_at: 1.month.ago..2.weeks.ago).average(:anger_level)
      return false unless recent_avg && old_avg

      (old_avg - recent_avg) >= requirements['threshold']
    when 'trigger_analysis'
      user.trigger_words.count >= requirements['threshold']
    when 'calming_points'
      user.calming_point&.total_points.to_i >= requirements['threshold']
    when 'level_reached'
      user.calming_point&.current_level.to_i >= requirements['threshold']
    else
      false
    end
  end

  def award_to_user_if_eligible(user)
    return false if earned_by?(user)
    return false unless check_eligibility(user)

    UserBadge.create!(user: user, badge: self)
    true
  end

  # Class Methods
  def self.check_all_badges_for_user(user)
    awarded_badges = []

    Badge.all.each do |badge|
      awarded_badges << badge if badge.award_to_user_if_eligible(user)
    end

    awarded_badges
  end

  def self.most_earned
    joins(:user_badges)
      .group('badges.id')
      .order('COUNT(user_badges.id) DESC')
  end

  def self.rarest
    left_joins(:user_badges)
      .group('badges.id')
      .order('COUNT(user_badges.id) ASC')
  end
end
