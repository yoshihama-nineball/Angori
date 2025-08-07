require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'バリデーション' do
    it '有効な属性を持つ場合は有効であること' do
      user = build(:user)
      expect(user).to be_valid
    end

    it '名前がない場合は無効であること' do
      user = build(:user, name: nil)
      expect(user).not_to be_valid
    end

    it 'メールアドレスがない場合は無効であること' do
      user = build(:user, email: nil)
      expect(user).not_to be_valid
    end

    it '重複したメールアドレスの場合は無効であること' do
      create(:user, email: 'test@example.com')
      user = build(:user, email: 'test@example.com')
      expect(user).not_to be_valid
    end
  end

  describe 'アソシエーション' do
    let(:user) { create(:user) }

    it 'anger_logs を複数持つこと' do
      expect(user).to respond_to(:anger_logs)
      expect(user.anger_logs).to be_a(ActiveRecord::Associations::CollectionProxy)
    end

    it 'calming_point を1つ持つこと' do
      expect(user).to respond_to(:calming_point)
      expect(user.calming_point).to be_a(CalmingPoint)
    end

    it 'trigger_words を複数持つこと' do
      expect(user).to respond_to(:trigger_words)
      expect(user.trigger_words).to be_a(ActiveRecord::Associations::CollectionProxy)
    end

    # dependent: :destroy のテスト
    it 'ユーザー削除時に関連する anger_logs も削除されること' do
      user.anger_logs.create!(
        anger_level: 5,
        occurred_at: Time.current,
        situation_description: 'テスト'
      )

      expect { user.destroy! }.to change(AngerLog, :count).by(-1)
    end

    it 'ユーザー削除時に関連する calming_point も削除されること' do
      calming_point_id = user.calming_point.id

      user.destroy!
      expect(CalmingPoint.find_by(id: calming_point_id)).to be_nil
    end

    it 'ユーザー削除時に関連する trigger_words も削除されること' do
      user.trigger_words.create!(
        name: 'テストトリガー',
        anger_level_avg: 5.0,
        category: 'work',
        count: 1
      )

      expect { user.destroy! }.to change(TriggerWord, :count).by(-1)
    end
  end

  describe 'コールバック' do
    it 'ユーザー作成時に calming_point が作成されること' do
      user = create(:user)
      expect(user.calming_point).to be_present
      expect(user.calming_point.total_points).to eq(0)
      expect(user.calming_point.current_level).to eq(1)
    end
  end
end
