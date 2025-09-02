class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  # Associations
  has_many :anger_logs, dependent: :destroy
  has_one :calming_point, dependent: :destroy
  has_many :trigger_words, dependent: :destroy
  has_many :contact_messages, dependent: :nullify
  has_many :user_badges, dependent: :destroy
  has_many :badges, through: :user_badges
  has_many :reminders, dependent: :destroy

  # Validations
  validates :name, presence: true, length: { maximum: 50 }
  validates :email, presence: true, uniqueness: { case_sensitive: false }
  validates :password, length: { minimum: 8 }, if: :password_required?
  validate :password_complexity, if: :password_required?

  # Callbacks
  after_create :create_calming_point

  private

  def create_calming_point
    CalmingPoint.create!(user: self)
  end

  def password_complexity
    return if password.blank?

    errors.add :password, 'は大文字、小文字、数字を含む必要があります' unless
      password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  end

  def password_required?
    !persisted? || !password.nil? || !password_confirmation.nil?
  end
end
