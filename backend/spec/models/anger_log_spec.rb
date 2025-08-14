require 'rails_helper'

RSpec.describe AngerLog, type: :model do
  let(:user) { create(:user) }

  describe 'validations' do
    it '有効な属性を持つ場合は有効であること' do
      anger_log = build(:anger_log, user: user)
      expect(anger_log).to be_valid
    end

    it 'anger_levelがない場合は無効であること' do
      anger_log = build(:anger_log, user: user, anger_level: nil)
      expect(anger_log).not_to be_valid
      expect(anger_log.errors[:anger_level]).to include("can't be blank")
    end

    it 'anger_levelが11の場合は無効であること' do
      anger_log = build(:anger_log, user: user, anger_level: 11)
      expect(anger_log).not_to be_valid
      expect(anger_log.errors[:anger_level]).to include("is not included in the list")
    end

    it 'anger_levelが0の場合は無効であること' do
      anger_log = build(:anger_log, user: user, anger_level: 0)
      expect(anger_log).not_to be_valid
      expect(anger_log.errors[:anger_level]).to include("is not included in the list")
    end

    it 'situation_descriptionがない場合は無効であること' do
      anger_log = build(:anger_log, user: user, situation_description: nil)
      expect(anger_log).not_to be_valid
      expect(anger_log.errors[:situation_description]).to include("can't be blank")
    end
  end

  describe 'callbacks' do
    it 'anger_log作成後のtrigger_wordsの更新' do
      # user作成時にcalming_pointが自動作成されることを前提
      expect(user.calming_point).to be_present
      
      expect do
        create(:anger_log,
               user: user,
               trigger_words: 'ストレス,仕事,締切')
      end.to change(user.trigger_words, :count).by(3)
    end

    it 'anger_log作成後のcalming pointsの更新' do
      # user作成時にcalming_pointが既に存在することを確認
      expect(user.calming_point).to be_present
      
      # calculate_points!メソッドがモックされていることを確認
      allow(user.calming_point).to receive(:calculate_points!)
      
      create(:anger_log, user: user)
      expect(user.calming_point).to have_received(:calculate_points!)
    end
  end

  describe 'scopes' do
    before do
      # テストデータを事前に作成
      @recent_log = create(:anger_log, user: user, occurred_at: 1.hour.ago)
      @old_log = create(:anger_log, user: user, occurred_at: 1.week.ago)
    end

    it 'recentによるソート' do
      expect(described_class.recent.first).to eq(@recent_log)
    end

    it 'anger levelの高いログを絞り込むこと' do
      high_anger = create(:anger_log, user: user, anger_level: 8)
      expect(described_class.by_anger_level(8)).to include(high_anger)
    end

    it 'anger levelの低いログは絞り込まれないこと' do
      low_anger = create(:anger_log, user: user, anger_level: 3)
      expect(described_class.by_anger_level(8)).not_to include(low_anger)
    end
  end
end