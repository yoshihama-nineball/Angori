# backend/spec/models/trigger_word_spec.rb
require 'rails_helper'

RSpec.describe TriggerWord, type: :model do
  # ========================================
  # アソシエーション
  # ========================================
  describe 'アソシエーション' do
    it { is_expected.to belong_to(:user) }
  end

  # ========================================
  # バリデーション
  # ========================================
  describe 'バリデーション' do
    subject { build(:trigger_word) }

    context 'name' do
      it { is_expected.to validate_presence_of(:name) }
      it { is_expected.to validate_length_of(:name).is_at_most(50) }

      it 'ユーザーごとに一意である' do
        user = create(:user)
        create(:trigger_word, user: user, name: 'テストワード')
        duplicate = build(:trigger_word, user: user, name: 'テストワード')

        expect(duplicate).not_to be_valid
        expect(duplicate.errors[:name]).to include('has already been taken')
      end

      it '異なるユーザーなら同じ名前でも有効' do
        user1 = create(:user)
        user2 = create(:user)
        create(:trigger_word, user: user1, name: 'テストワード')
        duplicate = build(:trigger_word, user: user2, name: 'テストワード')

        expect(duplicate).to be_valid
      end
    end

    context 'count' do
      it { is_expected.to validate_presence_of(:count) }
      it { is_expected.to validate_numericality_of(:count).is_greater_than(0) }

      it '0以下は無効' do
        trigger_word = build(:trigger_word, count: 0)
        expect(trigger_word).not_to be_valid
      end

      it '負の数は無効' do
        trigger_word = build(:trigger_word, count: -1)
        expect(trigger_word).not_to be_valid
      end
    end

    context 'anger_level_avg' do
      it { is_expected.to validate_presence_of(:anger_level_avg) }
      it { is_expected.to validate_numericality_of(:anger_level_avg).is_in(1.0..10.0) }

      it '1.0未満は無効' do
        trigger_word = build(:trigger_word, anger_level_avg: 0.9)
        expect(trigger_word).not_to be_valid
      end

      it '10.0超は無効' do
        trigger_word = build(:trigger_word, anger_level_avg: 10.1)
        expect(trigger_word).not_to be_valid
      end

      it '1.0ちょうどは有効' do
        trigger_word = build(:trigger_word, anger_level_avg: 1.0)
        expect(trigger_word).to be_valid
      end

      it '10.0ちょうどは有効' do
        trigger_word = build(:trigger_word, anger_level_avg: 10.0)
        expect(trigger_word).to be_valid
      end
    end

    context 'category' do
      it { is_expected.to validate_presence_of(:category) }
      it { is_expected.to validate_inclusion_of(:category).in_array(%w[work family social sensory other]) }

      it '無効なカテゴリは拒否される' do
        trigger_word = build(:trigger_word, category: 'invalid_category')
        expect(trigger_word).not_to be_valid
      end

      it '有効なカテゴリはすべて受け入れられる' do
        %w[work family social sensory other].each do |category|
          trigger_word = build(:trigger_word, category: category)
          expect(trigger_word).to be_valid
        end
      end
    end
  end

  # ========================================
  # スコープ
  # ========================================
  describe 'スコープ' do
    let(:user) { create(:user) }

    describe '.by_category' do
      it '指定したカテゴリのトリガーワードを返す' do
        work_trigger = create(:trigger_word, :work_category, user: user)
        create(:trigger_word, :family_category, user: user)

        results = user.trigger_words.by_category('work')
        expect(results).to include(work_trigger)
        expect(results.count).to eq(1)
      end

      it '複数のトリガーワードがある場合すべて返す' do
        work1 = create(:trigger_word, category: 'work', user: user)
        work2 = create(:trigger_word, category: 'work', user: user)
        create(:trigger_word, category: 'family', user: user)

        results = user.trigger_words.by_category('work')
        expect(results).to include(work1, work2)
        expect(results.count).to eq(2)
      end
    end

    describe '.high_frequency' do
      it 'count >= 3のトリガーワードを返す' do
        high = create(:trigger_word, count: 5, user: user)
        create(:trigger_word, count: 2, user: user)

        results = user.trigger_words.high_frequency
        expect(results).to include(high)
        expect(results.count).to eq(1)
      end

      it 'count = 3のトリガーワードも含む（境界値）' do
        boundary = create(:trigger_word, count: 3, user: user)
        create(:trigger_word, count: 2, user: user)

        results = user.trigger_words.high_frequency
        expect(results).to include(boundary)
      end
    end

    describe '.high_anger' do
      it 'anger_level_avg >= 7.0のトリガーワードを返す' do
        high = create(:trigger_word, anger_level_avg: 8.0, user: user)
        create(:trigger_word, anger_level_avg: 5.0, user: user)

        results = user.trigger_words.high_anger
        expect(results).to include(high)
        expect(results.count).to eq(1)
      end

      it 'anger_level_avg = 7.0のトリガーワードも含む（境界値）' do
        boundary = create(:trigger_word, anger_level_avg: 7.0, user: user)
        create(:trigger_word, anger_level_avg: 6.9, user: user)

        results = user.trigger_words.high_anger
        expect(results).to include(boundary)
      end
    end

    describe '.recent' do
      it 'last_triggered_atの降順で返す' do
        old = create(:trigger_word, last_triggered_at: 3.days.ago, user: user)
        new = create(:trigger_word, last_triggered_at: 1.day.ago, user: user)
        newest = create(:trigger_word, last_triggered_at: Time.current, user: user)

        results = user.trigger_words.recent
        expect(results.to_a).to eq([newest, new, old])
      end
    end

    describe '.frequent' do
      it 'countの降順で返す' do
        low = create(:trigger_word, count: 2, user: user)
        high = create(:trigger_word, count: 10, user: user)
        medium = create(:trigger_word, count: 5, user: user)

        results = user.trigger_words.frequent
        expect(results.to_a).to eq([high, medium, low])
      end
    end

    describe '.dangerous' do
      it 'anger_level_avg >= 6.0 かつ count >= 2のトリガーワードを返す' do
        dangerous = create(:trigger_word, anger_level_avg: 7.0, count: 3, user: user)
        create(:trigger_word, anger_level_avg: 5.0, count: 3, user: user)
        create(:trigger_word, anger_level_avg: 7.0, count: 1, user: user)

        results = described_class.dangerous
        expect(results).to include(dangerous)
        expect(results.count).to eq(1)
      end

      it '境界値テスト（anger_level_avg = 6.0, count = 2）' do
        boundary = create(:trigger_word, anger_level_avg: 6.0, count: 2, user: user)

        results = described_class.dangerous
        expect(results).to include(boundary)
      end

      it '条件を満たさないものは除外される' do
        create(:trigger_word, anger_level_avg: 5.9, count: 5, user: user)
        create(:trigger_word, anger_level_avg: 8.0, count: 1, user: user)

        results = described_class.dangerous
        expect(results.count).to eq(0)
      end
    end
  end

  # ========================================
  # インスタンスメソッド
  # ========================================
  describe 'インスタンスメソッド' do
    describe '#needs_attention?' do
      it 'anger_level_avg >= 6.0 かつ count >= 3の場合trueを返す' do
        trigger = build(:trigger_word, anger_level_avg: 7.0, count: 5)
        expect(trigger.needs_attention?).to be true
      end

      it 'anger_level_avg < 6.0の場合falseを返す' do
        trigger = build(:trigger_word, anger_level_avg: 5.9, count: 5)
        expect(trigger.needs_attention?).to be false
      end

      it 'count < 3の場合falseを返す' do
        trigger = build(:trigger_word, anger_level_avg: 7.0, count: 2)
        expect(trigger.needs_attention?).to be false
      end

      it '境界値テスト（anger_level_avg = 6.0, count = 3）' do
        trigger = build(:trigger_word, anger_level_avg: 6.0, count: 3)
        expect(trigger.needs_attention?).to be true
      end
    end

    describe '#frequency_level' do
      it 'count 1の場合"low"を返す' do
        trigger = build(:trigger_word, count: 1)
        expect(trigger.frequency_level).to eq('low')
      end

      it 'count 2の場合"low"を返す' do
        trigger = build(:trigger_word, count: 2)
        expect(trigger.frequency_level).to eq('low')
      end

      it 'count 3の場合"medium"を返す' do
        trigger = build(:trigger_word, count: 3)
        expect(trigger.frequency_level).to eq('medium')
      end

      it 'count 5の場合"medium"を返す' do
        trigger = build(:trigger_word, count: 5)
        expect(trigger.frequency_level).to eq('medium')
      end

      it 'count 6の場合"high"を返す' do
        trigger = build(:trigger_word, count: 6)
        expect(trigger.frequency_level).to eq('high')
      end

      it 'count 10の場合"high"を返す' do
        trigger = build(:trigger_word, count: 10)
        expect(trigger.frequency_level).to eq('high')
      end

      it 'count 11の場合"very_high"を返す' do
        trigger = build(:trigger_word, count: 11)
        expect(trigger.frequency_level).to eq('very_high')
      end

      it 'count 100の場合"very_high"を返す' do
        trigger = build(:trigger_word, count: 100)
        expect(trigger.frequency_level).to eq('very_high')
      end
    end

    describe '#anger_severity' do
      it 'anger_level_avg 1.0の場合"mild"を返す' do
        trigger = build(:trigger_word, anger_level_avg: 1.0)
        expect(trigger.anger_severity).to eq('mild')
      end

      it 'anger_level_avg 3.0の場合"mild"を返す' do
        trigger = build(:trigger_word, anger_level_avg: 3.0)
        expect(trigger.anger_severity).to eq('mild')
      end

      it 'anger_level_avg 3.1の場合"moderate"を返す' do
        trigger = build(:trigger_word, anger_level_avg: 3.1)
        expect(trigger.anger_severity).to eq('moderate')
      end

      it 'anger_level_avg 6.0の場合"moderate"を返す' do
        trigger = build(:trigger_word, anger_level_avg: 6.0)
        expect(trigger.anger_severity).to eq('moderate')
      end

      it 'anger_level_avg 6.1の場合"severe"を返す' do
        trigger = build(:trigger_word, anger_level_avg: 6.1)
        expect(trigger.anger_severity).to eq('severe')
      end

      it 'anger_level_avg 8.0の場合"severe"を返す' do
        trigger = build(:trigger_word, anger_level_avg: 8.0)
        expect(trigger.anger_severity).to eq('severe')
      end

      it 'anger_level_avg 8.1の場合"extreme"を返す' do
        trigger = build(:trigger_word, anger_level_avg: 8.1)
        expect(trigger.anger_severity).to eq('extreme')
      end

      it 'anger_level_avg 10.0の場合"extreme"を返す' do
        trigger = build(:trigger_word, anger_level_avg: 10.0)
        expect(trigger.anger_severity).to eq('extreme')
      end
    end
  end

  # ========================================
  # クラスメソッド
  # ========================================
  describe 'クラスメソッド' do
    let(:user) { create(:user) }
    let(:other_user) { create(:user) }

    describe '.most_common_for_user' do
      it '指定ユーザーの頻度が高いトリガーワードを返す' do
        high = create(:trigger_word, user: user, count: 10)
        low = create(:trigger_word, user: user, count: 2)
        other_user_trigger = create(:trigger_word, user: other_user, count: 20)

        results = described_class.most_common_for_user(user, 5)
        expect(results).to include(high, low)
        expect(results).not_to include(other_user_trigger)
        expect(results.first).to eq(high)
      end

      it 'limit数を指定できる' do
        5.times { |i| create(:trigger_word, user: user, count: i + 1) }

        results = described_class.most_common_for_user(user, 3)
        expect(results.count).to eq(3)
      end

      it 'countの降順で返す' do
        t1 = create(:trigger_word, user: user, count: 5)
        t2 = create(:trigger_word, user: user, count: 10)
        t3 = create(:trigger_word, user: user, count: 3)

        results = described_class.most_common_for_user(user, 5)
        expect(results.to_a).to eq([t2, t1, t3])
      end
    end

    describe '.most_dangerous_for_user' do
      it '指定ユーザーの危険なトリガーワードを返す' do
        dangerous = create(:trigger_word, user: user, anger_level_avg: 8.0, count: 5)
        create(:trigger_word, user: user, anger_level_avg: 5.0, count: 5)
        other_dangerous = create(:trigger_word, user: other_user, anger_level_avg: 9.0, count: 10)

        results = described_class.most_dangerous_for_user(user, 3)
        expect(results).to include(dangerous)
        expect(results).not_to include(other_dangerous)
      end

      it 'limit数を指定できる' do
        3.times { create(:trigger_word, :dangerous, user: user) }

        results = described_class.most_dangerous_for_user(user, 2)
        expect(results.count).to eq(2)
      end

      it 'anger_level_avg < 6.0 または count < 2は除外される' do
        create(:trigger_word, user: user, anger_level_avg: 5.9, count: 5)
        create(:trigger_word, user: user, anger_level_avg: 8.0, count: 1)

        results = described_class.most_dangerous_for_user(user, 5)
        expect(results.count).to eq(0)
      end
    end

    describe '.improvement_candidates' do
      it '改善候補（anger_level_avg >= 5.0 かつ count >= 2）を重み付けして返す' do
        high_priority = create(:trigger_word, user: user, anger_level_avg: 8.0, count: 5)
        low_priority = create(:trigger_word, user: user, anger_level_avg: 5.0, count: 2)
        create(:trigger_word, user: user, anger_level_avg: 4.9, count: 5)
        create(:trigger_word, user: user, anger_level_avg: 8.0, count: 1)

        results = described_class.improvement_candidates(user)
        expect(results).to include(high_priority, low_priority)
        expect(results.first).to eq(high_priority) # 8.0 * 5 = 40 (最大)
        expect(results.count).to eq(2)
      end

      it '重み付け計算が正しい（anger_level_avg * count）' do
        t1 = create(:trigger_word, user: user, anger_level_avg: 6.0, count: 5) # 30
        t2 = create(:trigger_word, user: user, anger_level_avg: 8.0, count: 3) # 24
        t3 = create(:trigger_word, user: user, anger_level_avg: 5.0, count: 7) # 35

        results = described_class.improvement_candidates(user)
        expect(results.to_a).to eq([t3, t1, t2])
      end

      it '他のユーザーのデータは含まれない' do
        user_trigger = create(:trigger_word, user: user, anger_level_avg: 7.0, count: 3)
        create(:trigger_word, user: other_user, anger_level_avg: 9.0, count: 10)

        results = described_class.improvement_candidates(user)
        expect(results).to include(user_trigger)
        expect(results.count).to eq(1)
      end
    end

    describe '.by_category_stats' do
      it 'カテゴリごとの統計情報を返す' do
        create(:trigger_word, user: user, category: 'work', count: 3, anger_level_avg: 6.0)
        create(:trigger_word, user: user, category: 'work', count: 2, anger_level_avg: 4.0)
        create(:trigger_word, user: user, category: 'family', count: 5, anger_level_avg: 7.0)

        stats = described_class.by_category_stats(user)

        expect(stats['work'][:count]).to eq(5) # 3 + 2
        expect(stats['work'][:avg_anger]).to eq(5.2) # (6.0*3 + 4.0*2) / 5
        expect(stats['work'][:triggers_count]).to eq(2)

        expect(stats['family'][:count]).to eq(5)
        expect(stats['family'][:avg_anger]).to eq(7.0)
        expect(stats['family'][:triggers_count]).to eq(1)
      end

      it 'トリガーがない場合は空のハッシュを返す' do
        stats = described_class.by_category_stats(user)
        expect(stats).to eq({})
      end

      it '他のユーザーのデータは含まれない' do
        create(:trigger_word, user: user, category: 'work', count: 3, anger_level_avg: 6.0)
        create(:trigger_word, user: other_user, category: 'work', count: 10, anger_level_avg: 9.0)

        stats = described_class.by_category_stats(user)
        expect(stats['work'][:count]).to eq(3)
        expect(stats['work'][:triggers_count]).to eq(1)
      end

      it '複数カテゴリを正しく集計する' do
        create(:trigger_word, user: user, category: 'work', count: 2, anger_level_avg: 5.0)
        create(:trigger_word, user: user, category: 'family', count: 3, anger_level_avg: 6.0)
        create(:trigger_word, user: user, category: 'social', count: 1, anger_level_avg: 4.0)

        stats = described_class.by_category_stats(user)
        expect(stats.keys).to match_array(%w[work family social])
        expect(stats['work'][:count]).to eq(2)
        expect(stats['family'][:count]).to eq(3)
        expect(stats['social'][:count]).to eq(1)
      end

      it '平均の計算が正しい（重み付け平均）' do
        create(:trigger_word, user: user, category: 'work', count: 1, anger_level_avg: 10.0)
        create(:trigger_word, user: user, category: 'work', count: 9, anger_level_avg: 5.0)

        stats = described_class.by_category_stats(user)
        # (10.0*1 + 5.0*9) / 10 = 55 / 10 = 5.5
        expect(stats['work'][:avg_anger]).to eq(5.5)
      end
    end
  end
end
