module BadgeDisplay
  extend ActiveSupport::Concern

  BADGE_EMOJIS = {
    'milestone' => '🎯',
    'achievement' => '🏆',
    'special' => '⭐',
    'rare' => '💎'
  }.freeze

  DIFFICULTY_LEVELS = {
    (1..19) => 'easy',
    (20..49) => 'medium',
    (50..99) => 'hard'
  }.freeze

  DIFFICULTY_COLORS = {
    'easy' => 'green',
    'medium' => 'yellow',
    'hard' => 'orange',
    'legendary' => 'purple'
  }.freeze

  def badge_emoji
    BADGE_EMOJIS[badge_type]
  end

  def difficulty_level
    DIFFICULTY_LEVELS.each do |range, level|
      return level if range.include?(points_reward)
    end
    'legendary'
  end

  def difficulty_color
    DIFFICULTY_COLORS[difficulty_level]
  end

  def display_name
    "#{badge_emoji} #{name}"
  end

  def rarity_percentage
    total_users = User.count
    return 0 if total_users.zero?

    ((earned_count.to_f / total_users) * 100).round(1)
  end

  def rare?
    rarity_percentage < 10.0
  end

  def earned_count
    user_badges.count
  end
end
