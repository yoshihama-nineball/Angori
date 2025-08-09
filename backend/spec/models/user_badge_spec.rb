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

    it '同じユーザーが同じバッジを複数回獲得する場合は無効であること' do
      create(:user_badge, user: user, badge: badge)
      user_badge = build(:user_badge, user: user, badge: badge)
      expect(user_badge).not_to be_valid
    end

    it '重複獲得時にエラーメッセージが存在すること' do
      create(:user_badge, user: user, badge: badge)
      user_badge = build(:user_badge, user: user, badge: badge)
      user_badge.valid?
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
    let(:recent_badge) { create(:user_badge, user: user, earned_at: 1.day.ago) }
    let(:old_badge) { create(:user_badge, user: user, earned_at: 1.week.ago) }

    it '獲得日時昇順で並べられること' do
      recent_badge
      old_badge
      user_badges = described_class.where(user: user).order(:earned_at)
      expect(user_badges.to_a).to eq([old_badge, recent_badge])
    end

    it '獲得日時降順で並べられること' do
      recent_badge
      old_badge
      user_badges_desc = described_class.where(user: user).order(earned_at: :desc)
      expect(user_badges_desc.to_a).to eq([recent_badge, old_badge])
    end
  end

  describe 'バッジ獲得後の処理' do
    it 'バッジ獲得後にユーザーのバッジ一覧に追加されること' do
      create(:user_badge, user: user, badge: badge)
      expect(user.badges).to include(badge)
    end

    it 'バッジ獲得後にバッジのユーザー一覧に追加されること' do
      create(:user_badge, user: user, badge: badge)
      expect(badge.users).to include(user)
    end

    it '獲得時刻が記録されること' do
      earned_time = Time.current
      user_badge = create(:user_badge, user: user, badge: badge, earned_at: earned_time)
      expect(user_badge.earned_at).to be_within(1.second).of(earned_time)
    end
  end

  describe 'バッジ統計' do
    it 'ポピュラーバッジの獲得者数が正しく計算されること' do
      users = create_list(:user, 3)
      badge = create(:badge)
      users.each { |u| create(:user_badge, user: u, badge: badge) }
      expect(badge.earned_count).to eq(3)
    end

    it 'レアバッジの獲得者数が正しく計算されること' do
      badge = create(:badge)
      create(:user_badge, user: create(:user), badge: badge)
      expect(badge.earned_count).to eq(1)
    end

    it '複数バッジ獲得ユーザーの獲得数が正しく計算されること' do
      test_user = create(:user)
      create_list(:badge, 2).each { |b| create(:user_badge, user: test_user, badge: b) }
      expect(test_user.badges.count).to eq(2)
    end

    it '単一バッジ獲得ユーザーの獲得数が正しく計算されること' do
      test_user = create(:user)
      create(:user_badge, user: test_user, badge: create(:badge))
      expect(test_user.badges.count).to eq(1)
    end
  end

  describe 'バッジの重複チェック' do
    it '獲得済みバッジでtrueを返すこと' do
      create(:user_badge, user: user, badge: badge)
      expect(badge.earned_by?(user)).to be true
    end

    it '未獲得バッジでfalseを返すこと' do
      other_user = create(:user)
      expect(badge.earned_by?(other_user)).to be false
    end
  end
end
