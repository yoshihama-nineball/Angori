require 'rails_helper'

RSpec.describe TriggerWord, type: :model do
  let(:user) { create(:user) }

  describe 'バリデーション' do
    it '有効な属性を持つ場合は有効であること' do
      trigger_word = build(:trigger_word, user: user)
      expect(trigger_word).to be_valid
    end

    it 'nameが空の場合は無効であること' do
      trigger_word = build(:trigger_word, user: user, name: nil)
      expect(trigger_word).not_to be_valid
    end

    it 'nameが50文字を超える場合は無効であること' do
      trigger_word = build(:trigger_word, user: user, name: 'a' * 51)
      expect(trigger_word).not_to be_valid
    end

    it 'anger_level_avgが1.0未満の場合は無効であること' do
      trigger_word = build(:trigger_word, user: user, anger_level_avg: 0.5)
      expect(trigger_word).not_to be_valid
    end

    it 'anger_level_avgが10.0を超える場合は無効であること' do
      trigger_word = build(:trigger_word, user: user, anger_level_avg: 10.5)
      expect(trigger_word).not_to be_valid
    end

    it 'categoryが無効な値の場合は無効であること' do
      trigger_word = build(:trigger_word, user: user, category: 'invalid')
      expect(trigger_word).not_to be_valid
    end

    it 'countが0以下の場合は無効であること' do
      trigger_word = build(:trigger_word, user: user, count: 0)
      expect(trigger_word).not_to be_valid
    end

    it '同じユーザー内でnameが重複する場合は無効であること' do
      create(:trigger_word, user: user, name: 'ストレス')
      trigger_word = build(:trigger_word, user: user, name: 'ストレス')
      expect(trigger_word).not_to be_valid
    end

    it '異なるユーザー間でnameが重複する場合は有効であること' do
      other_user = create(:user)
      create(:trigger_word, user: other_user, name: 'ストレス')
      trigger_word = build(:trigger_word, user: user, name: 'ストレス')
      expect(trigger_word).to be_valid
    end
  end

  describe 'アソシエーション' do
    it 'userに属すること' do
      trigger_word = create(:trigger_word, user: user)
      expect(trigger_word.user).to eq(user)
    end
  end

  describe 'スコープ' do
    let(:work_trigger) { create(:trigger_word, user: user, category: 'work', count: 5, anger_level_avg: 8.0) }
    let(:family_trigger) { create(:trigger_word, user: user, category: 'family', count: 1, anger_level_avg: 5.0) }
    let(:high_trigger) { create(:trigger_word, user: user, category: 'social', count: 8, anger_level_avg: 9.0) }

    it 'by_categoryでworkカテゴリを取得できること' do
      work_trigger
      family_trigger
      expect(described_class.by_category('work')).to include(work_trigger)
    end

    it 'by_categoryで他カテゴリが除外されること' do
      work_trigger
      family_trigger
      expect(described_class.by_category('work')).not_to include(family_trigger)
    end

    it 'high_frequencyで高頻度トリガーを取得できること' do
      work_trigger
      family_trigger
      high_trigger
      expect(described_class.high_frequency).to include(work_trigger)
    end

    it 'high_frequencyで低頻度トリガーが除外されること' do
      work_trigger
      family_trigger
      high_trigger
      expect(described_class.high_frequency).not_to include(family_trigger)
    end

    it 'high_angerで高怒りレベルトリガーを取得できること' do
      work_trigger
      family_trigger
      high_trigger
      expect(described_class.high_anger).to include(work_trigger)
    end

    it 'high_angerで低怒りレベルトリガーが除外されること' do
      work_trigger
      family_trigger
      high_trigger
      expect(described_class.high_anger).not_to include(family_trigger)
    end

    it 'dangerousで危険なトリガーを取得できること' do
      work_trigger
      family_trigger
      high_trigger
      expect(described_class.dangerous).to include(work_trigger)
    end

    it 'dangerousで安全なトリガーが除外されること' do
      work_trigger
      family_trigger
      high_trigger
      expect(described_class.dangerous).not_to include(family_trigger)
    end
  end

  describe 'インスタンスメソッド' do
    let(:trigger_word) { create(:trigger_word, user: user, count: 5, anger_level_avg: 7.5) }

    describe '#needs_attention?' do
      it '注意が必要な場合はtrueを返すこと' do
        high_trigger = create(:trigger_word, user: user, anger_level_avg: 6.0, count: 3)
        expect(high_trigger.needs_attention?).to be true
      end

      it '注意が不要な場合はfalseを返すこと' do
        low_trigger = create(:trigger_word, user: user, anger_level_avg: 5.0, count: 2)
        expect(low_trigger.needs_attention?).to be false
      end
    end

    describe '#frequency_level' do
      it 'count 1でlowを返すこと' do
        trigger = create(:trigger_word, user: user, count: 1)
        expect(trigger.frequency_level).to eq('low')
      end

      it 'count 4でmediumを返すこと' do
        trigger = create(:trigger_word, user: user, count: 4)
        expect(trigger.frequency_level).to eq('medium')
      end

      it 'count 7でhighを返すこと' do
        trigger = create(:trigger_word, user: user, count: 7)
        expect(trigger.frequency_level).to eq('high')
      end

      it 'count 15でvery_highを返すこと' do
        trigger = create(:trigger_word, user: user, count: 15)
        expect(trigger.frequency_level).to eq('very_high')
      end
    end

    describe '#anger_severity' do
      it 'anger_level_avg 2.0でmildを返すこと' do
        trigger = create(:trigger_word, user: user, anger_level_avg: 2.0)
        expect(trigger.anger_severity).to eq('mild')
      end

      it 'anger_level_avg 5.0でmoderateを返すこと' do
        trigger = create(:trigger_word, user: user, anger_level_avg: 5.0)
        expect(trigger.anger_severity).to eq('moderate')
      end

      it 'anger_level_avg 7.0でsevereを返すこと' do
        trigger = create(:trigger_word, user: user, anger_level_avg: 7.0)
        expect(trigger.anger_severity).to eq('severe')
      end

      it 'anger_level_avg 9.0でextremeを返すこと' do
        trigger = create(:trigger_word, user: user, anger_level_avg: 9.0)
        expect(trigger.anger_severity).to eq('extreme')
      end
    end
  end

  describe 'クラスメソッド' do
    let(:common_trigger) { create(:trigger_word, user: user, count: 10) }
    let(:dangerous_trigger) { create(:trigger_word, user: user, count: 5, anger_level_avg: 8.0) }

    describe '.most_common_for_user' do
      it 'ユーザーの最も一般的なトリガーを取得すること' do
        common_trigger
        result = described_class.most_common_for_user(user, 2)
        expect(result.first).to eq(common_trigger)
      end
    end

    describe '.most_dangerous_for_user' do
      it 'ユーザーの最も危険なトリガーを取得すること' do
        dangerous_trigger
        result = described_class.most_dangerous_for_user(user, 2)
        expect(result).to include(dangerous_trigger)
      end
    end
  end
end
