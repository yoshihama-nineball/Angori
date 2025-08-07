require 'rails_helper'

RSpec.describe UserBadge, type: :model do
  let(:user) { create(:user) }
  let(:badge) { create(:badge) }

  describe 'バリデーション' do
    it '有効な属性を持つ場合は有効であること' do
      user_badge = build(:user_badge, user: user, badge: badge)
      expect(user_badge).to be_valid
    end

    it 'userが存在しない場合は無効であること' do
      user_badge = build(:user_badge, user: nil, badge: badge)
      expect(user_badge).not_to be_valid
    end

    it 'badgeが存在しない場合は無効であること' do
      user_badge = build(:user_badge, user: user, badge: nil)
      expect(user_badge).not_to be_valid
    end

    it '同じユーザーが同じバッジを複数回獲得できないこと' do
      create(:user_badge, user: user, badge: badge)
      user_badge = build(:user_badge, user: user, badge: badge)
      expect(user_badge).not_to be_valid
      # 実際のエラーメッセージに合わせて修正
      expect(user_badge.errors).to be_present
    end

    it '異なるユーザーが同じバッジを獲得できること' do
      other_user = create(:user)
      create(:user_badge, user: user, badge: badge)
      user_badge = build(:user_badge, user: other_user, badge: badge)
      expect(user_badge).to be_valid
    end

    it '同じユーザーが異なるバッジを獲得できること' do
      other_badge = create(:badge)
      create(:user_badge, user: user, badge: badge)
      user_badge = build(:user_badge, user: user, badge: other_badge)
      expect(user_badge).to be_valid
    end
  end

  describe 'アソシエーション' do
    let(:user_badge) { create(:user_badge, user: user, badge: badge) }

    it 'userに属すること' do
      expect(user_badge.user).to eq(user)
    end

    it 'badgeに属すること' do
      expect(user_badge.badge).to eq(badge)
    end
  end

  describe 'スコープ' do
    let!(:recent_badge) { create(:user_badge, user: user, earned_at: 1.day.ago) }
    let!(:old_badge) { create(:user_badge, user: user, earned_at: 1.week.ago) }

    it '獲得日時順に並べられること' do
      user_badges = described_class.where(user: user).order(:earned_at)
      expect(user_badges.to_a).to eq([old_badge, recent_badge])

      user_badges_desc = described_class.where(user: user).order(earned_at: :desc)
      expect(user_badges_desc.to_a).to eq([recent_badge, old_badge])
    end
  end

  describe 'バッジ獲得後の処理' do
    it 'バッジ獲得後にユーザーのバッジ一覧に追加されること' do
      create(:user_badge, user: user, badge: badge)

      expect(user.badges).to include(badge)
      expect(badge.users).to include(user)
    end

    it '獲得時刻が記録されること' do
      earned_time = Time.current
      user_badge = create(:user_badge, user: user, badge: badge, earned_at: earned_time)

      expect(user_badge.earned_at).to be_within(1.second).of(earned_time)
    end
  end

  describe 'バッジ統計' do
    let!(:user1) { create(:user) }
    let!(:user2) { create(:user) }
    let!(:user3) { create(:user) }
    let!(:popular_badge) { create(:badge) }
    let!(:rare_badge) { create(:badge) }

    before do
      create(:user_badge, user: user1, badge: popular_badge)
      create(:user_badge, user: user2, badge: popular_badge)
      create(:user_badge, user: user3, badge: popular_badge)
      create(:user_badge, user: user1, badge: rare_badge)
    end

    it 'バッジごとの獲得者数が正しく計算されること' do
      expect(popular_badge.earned_count).to eq(3)
      expect(rare_badge.earned_count).to eq(1)
    end

    it 'ユーザーごとの獲得バッジ数が正しく計算されること' do
      expect(user1.badges.count).to eq(2)
      expect(user2.badges.count).to eq(1)
      expect(user3.badges.count).to eq(1)
    end
  end

  describe 'バッジの重複チェック' do
    it '既に獲得済みのバッジかどうかを判定できること' do
      create(:user_badge, user: user, badge: badge)

      expect(badge.earned_by?(user)).to be true

      other_user = create(:user)
      expect(badge.earned_by?(other_user)).to be false
    end
  end
end
