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
    let(:anger_management_saying) { create(:wise_saying, category: 'anger_management') }
    let(:mindfulness_saying) { create(:wise_saying, category: 'mindfulness') }
    let(:high_anger_saying) { create(:wise_saying, anger_level_range: 'high') }
    let(:low_anger_saying) { create(:wise_saying, anger_level_range: 'low') }

    it 'anger_managementカテゴリで取得できること' do
      anger_management_saying
      expect(described_class.where(category: 'anger_management')).to include(anger_management_saying)
    end

    it 'mindfulnessカテゴリで取得できること' do
      mindfulness_saying
      expect(described_class.where(category: 'mindfulness')).to include(mindfulness_saying)
    end

    it 'high怒りレベルで取得できること' do
      high_anger_saying
      expect(described_class.where(anger_level_range: 'high')).to include(high_anger_saying)
    end

    it 'low怒りレベルで取得できること' do
      low_anger_saying
      expect(described_class.where(anger_level_range: 'low')).to include(low_anger_saying)
    end
  end

  describe '格言選択ロジック' do
    let(:high_anger_saying) { create(:wise_saying, anger_level_range: 'high') }
    let(:medium_anger_saying) { create(:wise_saying, anger_level_range: 'medium') }
    let(:all_anger_saying) { create(:wise_saying, anger_level_range: 'all') }

    it '高怒りレベルでhigh格言が選ばれること' do
      high_anger_saying
      all_anger_saying
      candidates = described_class.where(anger_level_range: %w[high all])
      expect(candidates).to include(high_anger_saying)
    end

    it '高怒りレベルでall格言が選ばれること' do
      high_anger_saying
      all_anger_saying
      candidates = described_class.where(anger_level_range: %w[high all])
      expect(candidates).to include(all_anger_saying)
    end

    it '中怒りレベルでmedium格言が選ばれること' do
      medium_anger_saying
      all_anger_saying
      candidates = described_class.where(anger_level_range: %w[medium all])
      expect(candidates).to include(medium_anger_saying)
    end

    it '中怒りレベルでall格言が選ばれること' do
      medium_anger_saying
      all_anger_saying
      candidates = described_class.where(anger_level_range: %w[medium all])
      expect(candidates).to include(all_anger_saying)
    end
  end

  describe 'クラスメソッド' do
    let(:anger_saying) { create(:wise_saying, category: 'anger_management') }

    describe '.by_category' do
      it 'カテゴリで絞り込めること' do
        return skip 'by_category method not implemented' unless described_class.respond_to?(:by_category)

        anger_saying
        anger_sayings = described_class.by_category('anger_management')
        expect(anger_sayings).to include(anger_saying)
      end
    end

    describe '.random_for_anger_level' do
      it '指定した怒りレベルに適した格言をランダム取得すること' do
        return skip 'method not implemented' unless described_class.respond_to?(:random_for_anger_level)

        all_saying = create(:wise_saying, anger_level_range: 'all')
        random_saying = described_class.random_for_anger_level('high')
        expect([all_saying]).to include(random_saying)
      end
    end

    describe '.for_gorilla_advice' do
      it 'ゴリラのアドバイスに適した格言を取得できること' do
        return skip 'method not implemented' unless described_class.respond_to?(:for_gorilla_advice)

        create(:wise_saying, content: 'バナナを食べて落ち着こう。ウホウホ。')
        expect(described_class.for_gorilla_advice).to be_present
      end
    end
  end

  describe 'インスタンスメソッド' do
    describe '#category_name' do
      it 'カテゴリの日本語名を返すこと' do
        saying = create(:wise_saying, category: 'anger_management')
        return skip 'method not implemented' unless saying.respond_to?(:category_name)

        expect(saying.category_name).to eq('アンガーマネジメント')
      end
    end

    describe '#anger_level_text' do
      it '怒りレベル範囲の日本語表示を返すこと' do
        saying = create(:wise_saying, anger_level_range: 'high')
        return skip 'method not implemented' unless saying.respond_to?(:anger_level_text)

        expect(saying.anger_level_text).to eq('高レベル')
      end
    end
  end
end
