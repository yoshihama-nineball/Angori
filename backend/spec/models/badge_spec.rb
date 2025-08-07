# backend/spec/models/badge_spec.rb
require 'rails_helper'

RSpec.describe Badge, type: :model do
  describe 'バリデーション' do
    it '有効な属性を持つ場合は有効であること' do
      badge = build(:badge)
      expect(badge).to be_valid
    end

    it 'nameが空の場合は無効であること' do
      badge = build(:badge, name: nil)
      expect(badge).not_to be_valid
    end

    it 'nameが100文字を超える場合は無効であること' do
      badge = build(:badge, name: 'a' * 101)
      expect(badge).not_to be_valid
    end

    it 'nameが重複する場合は無効であること' do
      create(:badge, name: 'テストバッジ')
      badge = build(:badge, name: 'テストバッジ')
      expect(badge).not_to be_valid
    end

    it 'descriptionが空の場合は無効であること' do
      badge = build(:badge, description: nil)
      expect(badge).not_to be_valid
    end

    it 'descriptionが500文字を超える場合は無効であること' do
      badge = build(:badge, description: 'a' * 501)
      expect(badge).not_to be_valid
    end

    it 'badge_typeが無効な値の場合は無効であること' do
      badge = build(:badge, badge_type: 'invalid_type')
      expect(badge).not_to be_valid
    end

    it 'badge_typeが有効な値の場合は有効であること' do
      %w[milestone achievement special rare].each do |type|
        badge = build(:badge, badge_type: type)
        expect(badge).to be_valid
      end
    end

    it 'points_rewardが0以下の場合は無効であること' do
      badge = build(:badge, points_reward: 0)
      expect(badge).not_to be_valid
    end

    it 'points_rewardが1000以上の場合は無効であること' do
      badge = build(:badge, points_reward: 1000)
      expect(badge).not_to be_valid
    end

    it 'requirementsが空の場合は無効であること' do
      badge = build(:badge, requirements: nil)
      expect(badge).not_to be_valid
    end
  end

  describe 'アソシエーション' do
    let(:badge) { create(:badge) }

    it 'user_badgesを複数持つこと' do
      expect(badge).to respond_to(:user_badges)
      expect(badge.user_badges).to be_a(ActiveRecord::Associations::CollectionProxy)
    end

    it 'usersをuser_badges経由で複数持つこと' do
      expect(badge).to respond_to(:users)
      expect(badge.users).to be_a(ActiveRecord::Associations::CollectionProxy)
    end
  end

  describe 'スコープ' do
    let!(:milestone_badge) { create(:badge, badge_type: 'milestone', points_reward: 30) }
    let!(:achievement_badge) { create(:badge, badge_type: 'achievement', points_reward: 60) }
    let!(:special_badge) { create(:badge, badge_type: 'special', points_reward: 100) }

    it 'by_typeでタイプ別に取得できること' do
      expect(described_class.by_type('milestone')).to include(milestone_badge)
      expect(described_class.by_type('achievement')).to include(achievement_badge)
    end

    it 'milestone_badgesでマイルストーンバッジを取得できること' do
      expect(described_class.milestone_badges).to include(milestone_badge)
      expect(described_class.milestone_badges).not_to include(achievement_badge)
    end

    it 'high_rewardで高報酬バッジを取得できること' do
      expect(described_class.high_reward).to include(achievement_badge, special_badge)
      expect(described_class.high_reward).not_to include(milestone_badge)
    end
  end

  describe 'インスタンスメソッド' do
    let(:badge) { create(:badge, badge_type: 'achievement', points_reward: 75) }

    describe '#badge_emoji' do
      it 'badge_typeに応じた絵文字を返すこと' do
        expect(create(:badge, badge_type: 'milestone').badge_emoji).to eq('🎯')
        expect(create(:badge, badge_type: 'achievement').badge_emoji).to eq('🏆')
        expect(create(:badge, badge_type: 'special').badge_emoji).to eq('⭐')
        expect(create(:badge, badge_type: 'rare').badge_emoji).to eq('💎')
      end
    end

    describe '#difficulty_level' do
      it 'points_rewardに応じた難易度を返すこと' do
        expect(create(:badge, points_reward: 10).difficulty_level).to eq('easy')
        expect(create(:badge, points_reward: 30).difficulty_level).to eq('medium')
        expect(create(:badge, points_reward: 70).difficulty_level).to eq('hard')
        expect(create(:badge, points_reward: 150).difficulty_level).to eq('legendary')
      end
    end

    describe '#difficulty_color' do
      it '難易度に応じた色を返すこと' do
        easy_badge = create(:badge, points_reward: 10)
        expect(easy_badge.difficulty_color).to eq('green')

        hard_badge = create(:badge, points_reward: 70)
        expect(hard_badge.difficulty_color).to eq('orange')
      end
    end

    describe '#display_name' do
      it '絵文字付きの表示名を返すこと' do
        expect(badge.display_name).to include('🏆')
        expect(badge.display_name).to include(badge.name)
      end
    end

    describe '#earned_by?' do
      let(:user) { create(:user) }

      it 'ユーザーがバッジを獲得している場合はtrueを返すこと' do
        UserBadge.create!(user: user, badge: badge, earned_at: Time.current)
        expect(badge.earned_by?(user)).to be true
      end

      it 'ユーザーがバッジを獲得していない場合はfalseを返すこと' do
        expect(badge.earned_by?(user)).to be false
      end
    end

    describe '#requirements_text' do
      it '相談回数の要件テキストを返すこと' do
        consultation_badge = create(:badge,
                                    requirements: { type: 'consultation_count', threshold: 10 })
        expect(consultation_badge.requirements_text).to include('AI相談を10回以上完了する')
      end

      it '連続日数の要件テキストを返すこと' do
        streak_badge = create(:badge,
                              requirements: { type: 'consecutive_days', threshold: 7 })
        expect(streak_badge.requirements_text).to include('7日連続でログを記録する')
      end
    end
  end

  describe 'バッジ獲得判定' do
    let(:user) { create(:user) }
    let(:consultation_badge) do
      create(:badge, requirements: { type: 'consultation_count', threshold: 3 })
    end

    describe '#check_eligibility' do
      it '条件を満たすユーザーはtrueを返すこと' do
        # AI相談を3回実行
        3.times do
          create(:anger_log, user: user, ai_advice: 'テストアドバイス')
        end

        expect(consultation_badge.check_eligibility(user)).to be true
      end

      it '条件を満たさないユーザーはfalseを返すこと' do
        # AI相談を1回のみ実行
        create(:anger_log, user: user, ai_advice: 'テストアドバイス')

        expect(consultation_badge.check_eligibility(user)).to be false
      end
    end

    describe '#award_to_user_if_eligible' do
      it '条件を満たすユーザーにバッジを授与すること' do
        # 条件を満たすようにデータ作成
        3.times do
          create(:anger_log, user: user, ai_advice: 'テストアドバイス')
        end

        expect do
          consultation_badge.award_to_user_if_eligible(user)
        end.to change(UserBadge, :count).by(1)

        expect(user.badges).to include(consultation_badge)
      end

      it '条件を満たさないユーザーにはバッジを授与しないこと' do
        # 条件を満たさない
        create(:anger_log, user: user, ai_advice: 'テストアドバイス')

        expect do
          consultation_badge.award_to_user_if_eligible(user)
        end.not_to change(UserBadge, :count)
      end

      it '既に獲得済みのバッジは重複授与しないこと' do
        # 条件を満たす
        3.times do
          create(:anger_log, user: user, ai_advice: 'テストアドバイス')
        end

        # 1回目の授与
        consultation_badge.award_to_user_if_eligible(user)

        # 2回目の授与（重複）
        expect do
          consultation_badge.award_to_user_if_eligible(user)
        end.not_to change(UserBadge, :count)
      end
    end
  end

  describe 'クラスメソッド' do
    let(:user) { create(:user) }
    let!(:easy_badge) { create(:badge, requirements: { type: 'consultation_count', threshold: 1 }) }
    let!(:hard_badge) { create(:badge, requirements: { type: 'consultation_count', threshold: 10 }) }

    describe '.check_all_badges_for_user' do
      it 'ユーザーが獲得可能な全バッジをチェックすること' do
        # 1回の相談で easy_badge のみ獲得可能
        create(:anger_log, user: user, ai_advice: 'テストアドバイス')

        awarded_badges = described_class.check_all_badges_for_user(user)

        expect(awarded_badges).to include(easy_badge)
        expect(awarded_badges).not_to include(hard_badge)
      end
    end
  end
end
