# app/models/badge.rb
class Badge < ApplicationRecord
  include BadgeDisplay
  include BadgeEligibility
  include BadgeRequirementsText

  has_many :user_badges, dependent: :destroy
  has_many :users, through: :user_badges

  # Validations
  validates :name, presence: true, length: { maximum: 100 }, uniqueness: true
  validates :description, presence: true, length: { maximum: 500 }
  validates :badge_type, presence: true, inclusion: {
    in: %w[milestone achievement special rare],
    message: I18n.t('activerecord.errors.messages.badge_type_inclusion')
  }
  validates :points_reward, presence: true, numericality: { greater_than: 0, less_than: 1000 }
  validates :requirements, presence: true

  # Scopes
  scope :by_type, ->(type) { where(badge_type: type) }
  scope :milestone_badges, -> { where(badge_type: 'milestone') }
  scope :achievement_badges, -> { where(badge_type: 'achievement') }
  scope :special_badges, -> { where(badge_type: 'special') }
  scope :rare_badges, -> { where(badge_type: 'rare') }
  scope :high_reward, -> { where(points_reward: 50..) }
  scope :by_difficulty, -> { order(:points_reward) }
  scope :recently_created, -> { order(created_at: :desc) }

  def earned_by?(user)
    user_badges.exists?(user: user)
  end

  class << self
    def check_all_badges_for_user(user)
      awarded_badges = []

      find_each do |badge|
        awarded_badges << badge if badge.award_to_user_if_eligible(user)
      end

      awarded_badges
    end

    def most_earned
      joins(:user_badges)
        .group('badges.id')
        .order('COUNT(user_badges.id) DESC')
    end

    def rarest
      left_joins(:user_badges)
        .group('badges.id')
        .order('COUNT(user_badges.id) ASC')
    end
  end
end
