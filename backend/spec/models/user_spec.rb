require 'rails_helper'

RSpec.describe User, type: :model do
  # FactoryBotでの基本的なUserの作成テスト
  describe 'Factory' do
    it '有効なファクトリを持つ' do
      expect(build(:user)).to be_valid
    end
  end

  # バリデーションテスト
  describe 'バリデーション' do
    let(:user) { build(:user) }

    describe 'name（名前）' do
      it '必須である' do
        user.name = nil
        expect(user).not_to be_valid
        expect(user.errors[:name]).to include("can't be blank")
      end

      it '空文字の場合は無効' do
        user.name = ''
        expect(user).not_to be_valid
        expect(user.errors[:name]).to include("can't be blank")
      end

      it '50文字を超える場合は無効' do
        user.name = 'a' * 51
        expect(user).not_to be_valid
        expect(user.errors[:name]).to include('is too long (maximum is 50 characters)')
      end

      it '50文字の場合は有効' do
        user.name = 'a' * 50
        expect(user).to be_valid
      end
    end

    describe 'email（メールアドレス）' do
      it '必須である' do
        user.email = nil
        expect(user).not_to be_valid
        expect(user.errors[:email]).to include("can't be blank")
      end

      it '空文字の場合は無効' do
        user.email = ''
        expect(user).not_to be_valid
        expect(user.errors[:email]).to include("can't be blank")
      end

      it '一意である必要がある' do
        create(:user, email: 'unique@example.com')
        user.email = 'unique@example.com'
        expect(user).not_to be_valid
        expect(user.errors[:email]).to include('has already been taken')
      end

      it '大文字小文字を区別せずに一意性をチェックする' do
        create(:user, email: 'case.example@example.com')
        user.email = 'CASE.EXAMPLE@EXAMPLE.COM'
        expect(user).not_to be_valid
        expect(user.errors[:email]).to include('has already been taken')
      end

      it '無効なメール形式の場合は無効' do
        invalid_emails = ['invalid', 'invalid@', '@invalid.com', 'invalid.com']
        invalid_emails.each do |invalid_email|
          user.email = invalid_email
          expect(user).not_to be_valid
          expect(user.errors[:email]).to include('is invalid')
        end
      end

      it '有効なメール形式の場合は有効' do
        valid_emails = ['valid1@example.com', 'user.name@example.co.jp', 'test+tag@example.org']
        valid_emails.each_with_index do |valid_email, _index|
          new_user = build(:user, email: valid_email)
          expect(new_user).to be_valid
        end
      end
    end

    describe 'password（パスワード）' do
      context '通常ユーザー（非Google）の場合' do
        it '新規ユーザーの場合は必須' do
          user = build(:user, password: nil, password_confirmation: nil)
          expect(user).not_to be_valid
          expect(user.errors[:password]).to include("can't be blank")
        end

        it '8文字未満の場合は無効' do
          user.password = 'Pass123'
          user.password_confirmation = 'Pass123'
          expect(user).not_to be_valid
          expect(user.errors[:password]).to include('is too short (minimum is 8 characters)')
        end

        it '8文字の場合は有効' do
          user.password = 'Pass1234'
          user.password_confirmation = 'Pass1234'
          expect(user).to be_valid
        end

        it '大文字、小文字、数字を含む必要がある' do
          invalid_passwords = %w[password PASSWORD 12345678 Password password123 PASSWORD123]
          invalid_passwords.each do |invalid_password|
            user.password = invalid_password
            user.password_confirmation = invalid_password
            expect(user).not_to be_valid
            expect(user.errors[:password]).to include('は大文字、小文字、数字を含む必要があります')
          end
        end

        it '複雑性の条件を満たす場合は有効' do
          valid_passwords = %w[Password123 MyPassword1 Complex1Pass]
          valid_passwords.each do |valid_password|
            new_user = build(:user)
            new_user.password = valid_password
            new_user.password_confirmation = valid_password
            expect(new_user).to be_valid
          end
        end
      end

      context 'Googleユーザーの場合' do
        let(:google_user) { build(:user, provider: 'google_oauth2', uid: '123456') }

        it 'パスワード複雑性チェックは不要' do
          google_user.password = 'simple'
          google_user.password_confirmation = 'simple'
          expect(google_user).to be_valid
        end
      end
    end
  end

  # アソシエーションテスト
  describe 'アソシエーション' do
    it { is_expected.to have_many(:anger_logs).dependent(:destroy) }
    it { is_expected.to have_one(:calming_point).dependent(:destroy) }
    it { is_expected.to have_many(:trigger_words).dependent(:destroy) }
    it { is_expected.to have_many(:contact_messages).dependent(:nullify) }
    it { is_expected.to have_many(:user_badges).dependent(:destroy) }
    it { is_expected.to have_many(:badges).through(:user_badges) }
    it { is_expected.to have_many(:reminders).dependent(:destroy) }
  end

  # コールバックテスト
  describe 'コールバック' do
    describe 'after_create' do
      it 'CalmingPointを自動作成する' do
        user = build(:user)
        expect { user.save! }.to change(CalmingPoint, :count).by(1)
        expect(user.calming_point).to be_present
      end
    end
  end

  # インスタンスメソッドテスト
  describe 'インスタンスメソッド' do
    describe '#google_user?' do
      it 'Google OAuthユーザーの場合はtrueを返す' do
        user = build(:user, provider: 'google_oauth2')
        expect(user.google_user?).to be true
      end

      it '通常ユーザーの場合はfalseを返す' do
        user = build(:user, provider: nil)
        expect(user.google_user?).to be false
      end
    end

    describe '#regular_user?' do
      it '通常ユーザーの場合はtrueを返す' do
        user = build(:user, provider: nil)
        expect(user.regular_user?).to be true
      end

      it 'Google OAuthユーザーの場合はfalseを返す' do
        user = build(:user, provider: 'google_oauth2')
        expect(user.regular_user?).to be false
      end
    end
  end

  # クラスメソッドテスト
  describe 'クラスメソッド' do
    describe '.from_google_info' do
      let(:google_info) do
        {
          'id' => '123456789',
          'email' => 'google.user@example.com',
          'name' => 'Google User',
          'picture' => 'https://example.com/picture.jpg'
        }
      end

      context 'ユーザーが存在しない場合' do
        it 'Google情報を使って新しいユーザーを作成する' do
          expect do
            described_class.from_google_info(google_info)
          end.to change(described_class, :count).by(1)

          user = described_class.last
          expect(user.email).to eq('google.user@example.com')
          expect(user.name).to eq('Google User')
          expect(user.provider).to eq('google_oauth2')
          expect(user.uid).to eq('123456789')
          expect(user.google_image_url).to eq('https://example.com/picture.jpg')
        end
      end

      context 'ユーザーが既に存在する場合' do
        before do
          create(:user, provider: 'google_oauth2', uid: '123456789', email: 'google.user@example.com')
        end

        it '新しいユーザーを作成せずに既存ユーザーを返す' do
          expect do
            described_class.from_google_info(google_info)
          end.not_to change(described_class, :count)
        end
      end
    end
  end
end
