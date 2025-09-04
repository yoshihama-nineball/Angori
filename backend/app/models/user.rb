class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, :omniauthable,
         jwt_revocation_strategy: JwtDenylist,
         omniauth_providers: [:google_oauth2]

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
  validate :password_complexity, if: :password_complexity_required?

  # Callbacks
  after_create :create_calming_point

  # OmniAuth用のクラスメソッド
  def self.from_omniauth(auth)
    find_or_create_oauth_user(auth)
  end

  def self.from_google_info(google_info)
    where(provider: 'google_oauth2', uid: google_info['id']).first_or_create do |user|
      user.email = google_info['email']
      user.name = google_info['name']
      user.google_image_url = google_info['picture']
      user.password = Devise.friendly_token[0, 20]
    end
  end

  # Googleログインユーザーかどうかを判定
  def google_user?
    provider == 'google_oauth2'
  end

  # 通常のユーザー（メール/パスワード）かどうかを判定
  def regular_user?
    provider.blank?
  end

  # クラスメソッドをprivateにする
  class << self
    private

    # OAuthユーザーを検索または作成
    def find_or_create_oauth_user(auth)
      where(email: auth.info.email).first_or_create do |user|
        assign_basic_attributes(user, auth)
        assign_oauth_specific_attributes(user, auth)
      end
    end

    # 基本属性の設定
    def assign_basic_attributes(user, auth)
      user.email = auth.info.email
      user.name = auth.info.name
      user.password = Devise.friendly_token[0, 20]
    end

    # OAuth固有属性の設定
    def assign_oauth_specific_attributes(user, auth)
      user.provider = auth.provider
      user.uid = auth.uid
      user.google_image_url = auth.info.image
    end
  end

  private

  def create_calming_point
    CalmingPoint.create!(user: self)
  end

  def password_complexity
    return if password.blank?

    errors.add :password, 'は大文字、小文字、数字を含む必要があります' unless
      password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  end

  # パスワードの複雑性チェックが必要かどうか
  def password_complexity_required?
    password_required? && regular_user?
  end

  # パスワードが必要かどうか（Googleユーザーは不要）
  def password_required?
    return false if google_user?

    !persisted? || !password.nil? || !password_confirmation.nil?
  end

  # email必須バリデーションをDeviseに任せるため、独自バリデーションを無効化
  def email_required?
    true
  end
end
