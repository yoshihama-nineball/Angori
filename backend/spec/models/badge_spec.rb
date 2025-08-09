require 'rails_helper'

RSpec.describe Badge, type: :model do
  describe 'バリデーション' do
    it '有効な属性を持つ場合は有効であること' do
      expect(build(:badge)).to be_valid
    end

    it 'nameが空の場合は無効であること' do
      expect(build(:badge, name: nil)).not_to be_valid
    end

    it 'nameが100文字を超える場合は無効であること' do
      expect(build(:badge, name: 'a' * 101)).not_to be_valid
    end

    it 'nameが重複する場合は無効であること' do
      create(:badge, name: 'テストバッジ')
      expect(build(:badge, name: 'テストバッジ')).not_to be_valid
    end

    it 'descriptionが空の場合は無効であること' do
      expect(build(:badge, description: nil)).not_to be_valid
    end

    it 'descriptionが500文字を超える場合は無効であること' do
      expect(build(:badge, description: 'a' * 501)).not_to be_valid
    end

    it 'badge_typeが無効な値の場合は無効であること' do
      expect(build(:badge, badge_type: 'invalid_type')).not_to be_valid
    end

    %w[milestone achievement special rare].each do |type|
      it "#{type}は有効であること" do
        expect(build(:badge, badge_type: type)).to be_valid
      end
    end

    it 'points_rewardが0以下の場合は無効であること' do
      expect(build(:badge, points_reward: 0)).not_to be_valid
    end

    it 'points_rewardが1000以上の場合は無効であること' do
      expect(build(:badge, points_reward: 1000)).not_to be_valid
    end

    it 'requirementsが空の場合は無効であること' do
      expect(build(:badge, requirements: nil)).not_to be_valid
    end
  end

  describe 'アソシエーション' do
    let(:badge) { create(:badge) }

    it 'user_badgesにアクセスできること' do
      expect(badge).to respond_to(:user_badges)
    end

    it 'user_badgesがCollectionProxyであること' do
      expect(badge.user_badges).to be_a(ActiveRecord::Associations::CollectionProxy)
    end

    it 'usersにアクセスできること' do
      expect(badge).to respond_to(:users)
    end

    it 'usersがCollectionProxyであること' do
      expect(badge.users).to be_a(ActiveRecord::Associations::CollectionProxy)
    end
  end

  describe 'スコープ' do
    let!(:milestone_badge) { create(:badge, badge_type: 'milestone', points_reward: 30) }
    let!(:achievement_badge) { create(:badge, badge_type: 'achievement', points_reward: 60) }
    let!(:special_badge) { create(:badge, badge_type: 'special', points_reward: 100) }

    it 'milestoneタイプを取得できること' do
      expect(described_class.by_type('milestone')).to include(milestone_badge)
    end

    it 'achievementタイプを取得できること' do
      expect(described_class.by_type('achievement')).to include(achievement_badge)
    end

    it 'milestone_badgesにmilestoneバッジが含まれること' do
      expect(described_class.milestone_badges).to include(milestone_badge)
    end

    it 'milestone_badgesにachievementバッジが含まれないこと' do
      expect(described_class.milestone_badges).not_to include(achievement_badge)
    end

    it 'high_rewardにachievementとspecialバッジが含まれること' do
      expect(described_class.high_reward).to include(achievement_badge, special_badge)
    end

    it 'high_rewardにmilestoneバッジが含まれないこと' do
      expect(described_class.high_reward).not_to include(milestone_badge)
    end
  end

  describe 'インスタンスメソッド' do
    describe '#badge_emoji' do
      it 'milestoneタイプなら🎯を返すこと' do
        expect(create(:badge, badge_type: 'milestone').badge_emoji).to eq('🎯')
      end

      it 'achievementタイプなら🏆を返すこと' do
        expect(create(:badge, badge_type: 'achievement').badge_emoji).to eq('🏆')
      end

      it 'specialタイプなら⭐を返すこと' do
        expect(create(:badge, badge_type: 'special').badge_emoji).to eq('⭐')
      end

      it 'rareタイプなら💎を返すこと' do
        expect(create(:badge, badge_type: 'rare').badge_emoji).to eq('💎')
      end
    end

    describe '#difficulty_level' do
      it '10ポイントならeasyを返すこと' do
        expect(create(:badge, points_reward: 10).difficulty_level).to eq('easy')
      end

      it '30ポイントならmediumを返すこと' do
        expect(create(:badge, points_reward: 30).difficulty_level).to eq('medium')
      end

      it '70ポイントならhardを返すこと' do
        expect(create(:badge, points_reward: 70).difficulty_level).to eq('hard')
      end

      it '150ポイントならlegendaryを返すこと' do
        expect(create(:badge, points_reward: 150).difficulty_level).to eq('legendary')
      end
    end

    describe '#difficulty_color' do
      it 'easyバッジはgreenを返すこと' do
        expect(create(:badge, points_reward: 10).difficulty_color).to eq('green')
      end

      it 'hardバッジはorangeを返すこと' do
        expect(create(:badge, points_reward: 70).difficulty_color).to eq('orange')
      end
    end

    describe '#display_name' do
      let(:badge) { create(:badge, badge_type: 'achievement', points_reward: 75) }

      it '絵文字を含むこと' do
        expect(badge.display_name).to include('🏆')
      end

      it 'バッジ名を含むこと' do
        expect(badge.display_name).to include(badge.name)
      end
    end

    describe '#earned_by?' do
      let(:user) { create(:user) }

      it '獲得済みならtrueを返すこと' do
        UserBadge.create!(user: user, badge: create(:badge), earned_at: Time.current)
        expect(UserBadge.last.badge.earned_by?(user)).to be true
      end

      it '未獲得ならfalseを返すこと' do
        expect(create(:badge).earned_by?(user)).to be false
      end
    end

    describe '#requirements_text' do
      it '相談回数の要件テキストを返すこと' do
        badge = create(:badge, requirements: { type: 'consultation_count', threshold: 10 })
        expect(badge.requirements_text).to include('AI相談を10回以上完了する')
      end

      it '連続日数の要件テキストを返すこと' do
        badge = create(:badge, requirements: { type: 'consecutive_days', threshold: 7 })
        expect(badge.requirements_text).to include('7日連続でログを記録する')
      end
    end
  end

  describe '#check_eligibility' do
    let(:user) { create(:user) }
    let(:consultation_badge) do
      create(:badge, requirements: { type: 'consultation_count', threshold: 3 })
    end

    it '条件を満たすユーザーはtrueを返すこと' do
      3.times { create(:anger_log, user: user, ai_advice: 'テストアドバイス') }
      expect(consultation_badge.check_eligibility(user)).to be true
    end

    it '条件を満たさないユーザーはfalseを返すこと' do
      create(:anger_log, user: user, ai_advice: 'テストアドバイス')
      expect(consultation_badge.check_eligibility(user)).to be false
    end
  end

  describe '#award_to_user_if_eligible' do
    let(:user) { create(:user) }
    let(:consultation_badge) do
      create(:badge, requirements: { type: 'consultation_count', threshold: 3 })
    end

    context 'when user meets requirements' do
      before do
        3.times { create(:anger_log, user: user, ai_advice: 'テストアドバイス') }
      end

      it 'UserBadgeが1件増えること' do
        expect do
          consultation_badge.award_to_user_if_eligible(user)
        end.to change(UserBadge, :count).by(1)
      end

      it 'ユーザーがバッジを獲得していること' do
        consultation_badge.award_to_user_if_eligible(user)
        expect(user.badges).to include(consultation_badge)
      end
    end

    context 'when user does not meet requirements' do
      before do
        UserBadge.delete_all
        AngerLog.delete_all
        create(:anger_log, user: user, ai_advice: 'テストアドバイス') # 1件だけ
      end

      it 'バッジを授与しないこと' do
        expect do
          consultation_badge.award_to_user_if_eligible(user)
        end.not_to change(UserBadge, :count)
      end
    end

    context 'when user already earned the badge' do
      before do
        3.times { create(:anger_log, user: user, ai_advice: 'テストアドバイス') }
        consultation_badge.award_to_user_if_eligible(user)
      end

      it '重複授与しないこと' do
        expect do
          consultation_badge.award_to_user_if_eligible(user)
        end.not_to change(UserBadge, :count)
      end
    end
  end

  describe 'クラスメソッド' do
    let(:user) { create(:user) }
    let!(:easy_badge) do
      create(:badge, requirements: { type: 'consultation_count', threshold: 1 })
    end
    let!(:hard_badge) do
      create(:badge, requirements: { type: 'consultation_count', threshold: 10 })
    end

    describe '.check_all_badges_for_user' do
      before do
        create(:anger_log, user: user, ai_advice: 'テストアドバイス')
      end

      it 'easy_badgeを獲得できること' do
        awarded_badges = described_class.check_all_badges_for_user(user)
        expect(awarded_badges).to include(easy_badge)
      end

      it 'hard_badgeは獲得できないこと' do
        awarded_badges = described_class.check_all_badges_for_user(user)
        expect(awarded_badges).not_to include(hard_badge)
      end
    end
  end
end
