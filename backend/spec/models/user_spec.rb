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
      existing_user = create(:user)
      user = build(:user, email: existing_user.email)
      expect(user).not_to be_valid
    end

    it '重複メールアドレスのエラーメッセージが正しいこと' do
      existing_user = create(:user)
      user = build(:user, email: existing_user.email)
      user.valid?
      expect(user.errors[:email]).to include('has already been taken')
    end
  end

  describe 'アソシエーション' do
    let(:user) { create(:user) }

    it 'anger_logsにレスポンドすること' do
      expect(user).to respond_to(:anger_logs)
    end

    it 'anger_logsがCollectionProxyであること' do
      expect(user.anger_logs).to be_a(ActiveRecord::Associations::CollectionProxy)
    end

    it 'calming_pointにレスポンドすること' do
      expect(user).to respond_to(:calming_point)
    end

    it 'calming_pointがCalmingPointであること' do
      expect(user.calming_point).to be_a(CalmingPoint)
    end

    it 'trigger_wordsにレスポンドすること' do
      expect(user).to respond_to(:trigger_words)
    end

    it 'trigger_wordsがCollectionProxyであること' do
      expect(user.trigger_words).to be_a(ActiveRecord::Associations::CollectionProxy)
    end

    it 'ユーザー削除時に関連するanger_logsも削除されること' do
      create(:anger_log, user: user)
      expect { user.destroy! }.to change(AngerLog, :count).by(-1)
    end

    it 'ユーザー削除時に関連するcalming_pointも削除されること' do
      calming_point_id = user.calming_point.id
      user.destroy!
      expect(CalmingPoint.find_by(id: calming_point_id)).to be_nil
    end

    it 'ユーザー削除時に関連するtrigger_wordsも削除されること' do
      create(:trigger_word, user: user)
      expect { user.destroy! }.to change(TriggerWord, :count).by(-1)
    end
  end

  describe 'コールバック' do
    it 'ユーザー作成時にcalming_pointが作成されること' do
      user = create(:user)
      expect(user.calming_point).to be_present
    end

    it 'ユーザー作成時のcalming_pointの初期total_pointsが0であること' do
      user = create(:user)
      expect(user.calming_point.total_points).to eq(0)
    end

    it 'ユーザー作成時のcalming_pointの初期current_levelが1であること' do
      user = create(:user)
      expect(user.calming_point.current_level).to eq(1)
    end
  end
end
