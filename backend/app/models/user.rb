class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  # Associations
  has_many :anger_logs, dependent: :destroy
  has_one :calming_points, dependent: :destroy
  has_many :trigger_words, dependent: :destroy
  has_many :contact_messages, dependent: :nullify
  has_many :user_badges, dependent: :destroy
  has_many :badges, through: :user_badges
  has_many :reminders, dependent: :destroy

  # Validations
  validates :name, presence: true, length: { maximum: 50 }
  validates :email, presence: true, uniqueness: true

  # Callbacks
  after_create :create_calming_points

  private

  def create_calming_points
    CalmingPoints.create!(user: self)
  end
end
