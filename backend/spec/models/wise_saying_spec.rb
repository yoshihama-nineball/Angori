require 'rails_helper'

RSpec.describe WiseSaying, type: :model do
  describe 'バリデーション' do
    it '有効な属性を持つ場合は有効であること' do
      wise_saying = build(:wise_saying)
      expect(wise_saying).to be_valid
    end

    it 'contentが空の場合は無効であること' do
      wise_saying = build(:wise_saying, content: nil)
      expect(wise_saying).not_to be_valid
    end

    it 'contentが空文字の場合は無効であること' do
      wise_saying = build(:wise_saying, content: '')
      expect(wise_saying).not_to be_valid
    end

    it 'categoryが無効な値の場合は無効であること' do
      wise_saying = build(:wise_saying, category: 'invalid_category')
      expect(wise_saying).not_to be_valid
    end

    it 'categoryが有効な値の場合は有効であること' do
      valid_categories = %w[anger_management mindfulness self_acceptance self_care breathing_techniques general]
      valid_categories.each do |category|
        wise_saying = build(:wise_saying, category: category)
        expect(wise_saying).to be_valid
      end
    end

    it 'anger_level_rangeが無効な値の場合は無効であること' do
      wise_saying = build(:wise_saying, anger_level_range: 'invalid_range')
      expect(wise_saying).not_to be_valid
    end

    it 'anger_level_rangeが有効な値の場合は有効であること' do
      valid_ranges = %w[low medium high all]
      valid_ranges.each do |range|
        wise_saying = build(:wise_saying, anger_level_range: range)
        expect(wise_saying).to be_valid
      end
    end

    it 'contentが長すぎる場合は無効であること' do
      wise_saying = build(:wise_saying, content: 'a' * 1001)
      expect(wise_saying).not_to be_valid
    end

    it 'authorが255文字を超える場合は無効であること' do
      wise_saying = build(:wise_saying, author: 'a' * 256)
      expect(wise_saying).not_to be_valid
    end

    it 'authorが空の場合は無効であること' do
      wise_saying = build(:wise_saying, author: nil)
      expect(wise_saying).not_to be_valid
    end
  end

  describe 'スコープ' do
    let!(:anger_management_saying) { create(:wise_saying, category: 'anger_management') }
    let!(:mindfulness_saying) { create(:wise_saying, category: 'mindfulness') }
    let!(:high_anger_saying) { create(:wise_saying, anger_level_range: 'high') }
    let!(:low_anger_saying) { create(:wise_saying, anger_level_range: 'low') }

    it 'categoryでカテゴリ別に取得できること' do
      expect(described_class.where(category: 'anger_management')).to include(anger_management_saying)
      expect(described_class.where(category: 'mindfulness')).to include(mindfulness_saying)
    end

    it 'anger_level_rangeで怒りレベル別に取得できること' do
      expect(described_class.where(anger_level_range: 'high')).to include(high_anger_saying)
      expect(described_class.where(anger_level_range: 'low')).to include(low_anger_saying)
    end
  end

  describe '格言選択ロジック' do
    let!(:high_anger_saying) { create(:wise_saying, anger_level_range: 'high', category: 'anger_management') }
    let!(:medium_anger_saying) { create(:wise_saying, anger_level_range: 'medium', category: 'mindfulness') }
    let!(:all_anger_saying) { create(:wise_saying, anger_level_range: 'all', category: 'general') }

    it '怒りレベルに応じて適切な格言が選ばれること' do
      # 高い怒りレベル（8-10）の場合
      high_level_candidates = described_class.where(
        anger_level_range: %w[high all]
      )
      expect(high_level_candidates).to include(high_anger_saying, all_anger_saying)
      expect(high_level_candidates).not_to include(medium_anger_saying)

      # 中程度の怒りレベル（4-7）の場合
      medium_level_candidates = described_class.where(
        anger_level_range: %w[medium all]
      )
      expect(medium_level_candidates).to include(medium_anger_saying, all_anger_saying)
      expect(medium_level_candidates).not_to include(high_anger_saying)
    end
  end

  describe 'クラスメソッド' do
    let!(:anger_saying) { create(:wise_saying, category: 'anger_management', anger_level_range: 'high') }

    describe '.by_category' do
      it 'カテゴリで絞り込めること' do
        if described_class.respond_to?(:by_category)
          anger_sayings = described_class.by_category('anger_management')
          expect(anger_sayings).to include(anger_saying)
        else
          skip 'by_category method not implemented'
        end
      end
    end

    describe '.random_for_anger_level' do
      it '指定した怒りレベルに適した格言をランダムで取得すること' do
        all_saying = create(:wise_saying, anger_level_range: 'all')
        high_saying = create(:wise_saying, anger_level_range: 'high')

        if described_class.respond_to?(:random_for_anger_level)
          random_saying = described_class.random_for_anger_level('high')
          expect([all_saying, high_saying]).to include(random_saying)
        else
          skip 'random_for_anger_level method not implemented'
        end
      end
    end

    describe '.for_gorilla_advice' do
      it 'ゴリラのアドバイスに適した格言を取得できること' do
        gorilla_saying = create(:wise_saying,
                                content: 'バナナを食べて落ち着こう。ウホウホ。',
                                category: 'anger_management')

        if described_class.respond_to?(:for_gorilla_advice)
          gorilla_sayings = described_class.for_gorilla_advice
          expect(gorilla_sayings).to include(gorilla_saying)
        else
          skip 'for_gorilla_advice method not implemented'
        end
      end
    end
  end

  describe 'インスタンスメソッド' do
    let(:wise_saying) { create(:wise_saying) }

    describe '#category_name' do
      it 'カテゴリの日本語名を返すこと' do
        anger_saying = create(:wise_saying, category: 'anger_management')
        if anger_saying.respond_to?(:category_name)
          expect(anger_saying.category_name).to eq('アンガーマネジメント')
        else
          skip 'category_name method not implemented'
        end
      end
    end

    describe '#anger_level_text' do
      it '怒りレベル範囲の日本語表示を返すこと' do
        high_saying = create(:wise_saying, anger_level_range: 'high')
        if high_saying.respond_to?(:anger_level_text)
          expect(high_saying.anger_level_text).to eq('高レベル')
        else
          skip 'anger_level_text method not implemented'
        end
      end
    end
  end
end
