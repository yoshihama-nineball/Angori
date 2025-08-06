class UserBadge < ApplicationRecord
  belongs_to :user
  belongs_to :badge

  # Validations
  validates :user_id, presence: true
  validates :badge_id, presence: true
  validates :user_id, uniqueness: {
    scope: :badge_id,
    message: 'このバッジは既に獲得済みです'
  }

  # Scopes
  scope :recent, -> { order(created_at: :desc) }
  scope :by_badge_type, ->(type) { joins(:badge).where(badges: { badge_type: type }) }
  scope :milestone_badges, -> { by_badge_type('milestone') }
  scope :achievement_badges, -> { by_badge_type('achievement') }
  scope :special_badges, -> { by_badge_type('special') }
  scope :rare_badges, -> { by_badge_type('rare') }
  scope :high_reward, -> { joins(:badge).where('badges.points_reward >= ?', 50) }
  scope :this_week, -> { where(created_at: 1.week.ago..) }
  scope :this_month, -> { where(created_at: 1.month.ago..) }

  # Callbacks
  after_create :award_points
  after_create :update_user_achievements
  after_create :notify_achievement

  # Instance Methods
  def earned_recently?
    created_at > 1.week.ago
  end

  def points_awarded
    badge.points_reward
  end

  delegate :display_name, to: :badge, prefix: true

  def rarity_level
    badge.difficulty_level
  end

  def achievement_message
    "🎉 「#{badge.name}」バッジを獲得しました！\n#{badge.description}\n+#{badge.points_reward}ポイント獲得！"
  end

  def sharing_text
    "「#{badge.name}」バッジを獲得しました！#{badge.badge_emoji} #Angori #アンガーマネジメント"
  end

  # Class Methods
  def self.recent_achievements(limit = 10)
    recent.includes(:user, :badge).limit(limit)
  end

  def self.achievement_stats_for_user(user)
    user_badges = where(user: user)

    {
      total_badges: user_badges.count,
      milestone_count: user_badges.milestone_badges.count,
      achievement_count: user_badges.achievement_badges.count,
      special_count: user_badges.special_badges.count,
      rare_count: user_badges.rare_badges.count,
      total_points_from_badges: user_badges.joins(:badge).sum('badges.points_reward'),
      recent_badges: user_badges.recent.limit(5),
      completion_percentage: calculate_completion_percentage(user)
    }
  end

  def self.calculate_completion_percentage(user)
    total_badges = Badge.count
    earned_badges = where(user: user).count

    return 0 if total_badges == 0

    ((earned_badges.to_f / total_badges) * 100).round(1)
  end

  def self.next_achievable_badges(user, limit = 3)
    earned_badge_ids = where(user: user).pluck(:badge_id)
    available_badges = Badge.where.not(id: earned_badge_ids)

    achievable_badges = available_badges.select do |badge|
      badge.check_eligibility(user)
    end

    achievable_badges.take(limit)
  end

  def self.progress_towards_badges(user)
    earned_badge_ids = where(user: user).pluck(:badge_id)
    available_badges = Badge.where.not(id: earned_badge_ids)

    progress_data = []

    available_badges.each do |badge|
      progress = calculate_progress_percentage(user, badge)
      next if progress == 0

      progress_data << {
        badge: badge,
        progress_percentage: progress,
        requirements_text: badge.requirements_text,
        points_reward: badge.points_reward
      }
    end

    progress_data.sort_by { |data| -data[:progress_percentage] }
  end

  def self.badge_leaderboard(limit = 10)
    User.joins(:user_badges)
        .group('users.id')
        .order('COUNT(user_badges.id) DESC')
        .limit(limit)
        .includes(:user_badges)
  end

  def self.monthly_achievers
    this_month
      .joins(:user, :badge)
      .group('users.name')
      .count
      .sort_by { |_, count| -count }
  end

  private

  def award_points
    return unless user.calming_point.present?

    current_points = user.calming_point.total_points
    new_total = current_points + badge.points_reward
    new_level = (new_total / 100) + 1

    user.calming_point.update!(
      total_points: new_total,
      current_level: new_level,
      last_action_date: Date.current
    )
  end

  def update_user_achievements
    # milestone_flagsにバッジ獲得履歴を追加
    return unless user.calming_point.present?

    flags = user.calming_point.milestone_flags || {}
    flags["badge_#{badge.id}_earned"] = true
    unless user.user_badges.by_badge_type(badge.badge_type).where.not(id: id).exists?
      flags["first_#{badge.badge_type}_badge"] =
        true
    end

    user.calming_point.update!(milestone_flags: flags)
  end

  def notify_achievement
    # 将来的に通知機能を実装する際のフック
    Rails.logger.info "🏆 User #{user.id} earned badge: #{badge.name}"
  end

  def self.calculate_progress_percentage(user, badge)
    requirements = badge.requirements

    case requirements['type']
    when 'first_consultation'
      count = user.anger_logs.where.not(ai_advice: [nil, '']).count
      progress = (count.to_f / requirements['threshold']) * 100
    when 'consecutive_days'
      current_streak = user.calming_point&.streak_days.to_i
      progress = (current_streak.to_f / requirements['threshold']) * 100
    when 'consultation_count'
      count = user.anger_logs.where.not(ai_advice: [nil, '']).count
      progress = (count.to_f / requirements['threshold']) * 100
    when 'detailed_emotion_logs'
      count = user.anger_logs.where.not(emotions_felt: [nil, '']).count
      progress = (count.to_f / requirements['threshold']) * 100
    when 'trigger_analysis'
      count = user.trigger_words.count
      progress = (count.to_f / requirements['threshold']) * 100
    when 'calming_points'
      current_points = user.calming_point&.total_points.to_i
      progress = (current_points.to_f / requirements['threshold']) * 100
    when 'level_reached'
      current_level = user.calming_point&.current_level.to_i
      progress = (current_level.to_f / requirements['threshold']) * 100
    else
      progress = 0
    end

    [progress, 100].min.round(1)
  end
end
