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
    end

    it '1-10のAnger_level外の場合は無効であること' do
      anger_log = build(:anger_log, user: user, anger_level: 11)
      expect(anger_log).not_to be_valid

      anger_log = build(:anger_log, user: user, anger_level: 0)
      expect(anger_log).not_to be_valid
    end

    it 'situation_descriptionがない場合は無効であること' do
      anger_log = build(:anger_log, user: user, situation_description: nil)
      expect(anger_log).not_to be_valid
    end
  end

  describe 'callbacks' do
    it 'anger_log作成後のtrigger_wordsの更新' do
      expect do
        create(:anger_log,
               user: user,
               trigger_words: 'ストレス,仕事,締切')
      end.to change(user.trigger_words, :count).by(3)
    end

    it 'anger_log作成後のcalming pointsの更新' do
      expect(user.calming_point).to receive(:calculate_points!)
      create(:anger_log, user: user)
    end
  end

  describe 'scopes' do
    let!(:recent_log) { create(:anger_log, user: user, occurred_at: 1.hour.ago) }
    let!(:old_log) { create(:anger_log, user: user, occurred_at: 1.week.ago) }

    it 'recentによるソート' do
      expect(described_class.recent.first).to eq(recent_log)
    end

    it 'anger levelによる絞り込み' do
      high_anger = create(:anger_log, user: user, anger_level: 8)
      low_anger = create(:anger_log, user: user, anger_level: 3)

      expect(described_class.by_anger_level(8)).to include(high_anger)
      expect(described_class.by_anger_level(8)).not_to include(low_anger)
    end
  end
end
