module UserBadgeDisplay
  extend ActiveSupport::Concern

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
end
