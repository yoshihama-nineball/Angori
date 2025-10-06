require 'rails_helper'

RSpec.describe WiseSaying, type: :model do
  describe 'Factory' do
    it '有効なファクトリを持つ' do
      expect(build(:wise_saying)).to be_valid
    end

    it '各カテゴリのトレイトが正しく機能する' do
      categories = %i[anger_management mindfulness self_acceptance self_care breathing_techniques]
      categories.each do |category|
        wise_saying = build(:wise_saying, category)
        expect(wise_saying).to be_valid
        expect(wise_saying.category).to eq(category.to_s)
      end
    end
  end

  describe 'バリデーション' do
    let(:wise_saying) { build(:wise_saying) }

    describe 'content（内容）' do
      it '必須である' do
        wise_saying.content = nil
        expect(wise_saying).not_to be_valid
        expect(wise_saying.errors[:content]).to include("can't be blank")
      end

      it '空文字の場合は無効' do
        wise_saying.content = ''
        expect(wise_saying).not_to be_valid
        expect(wise_saying.errors[:content]).to include("can't be blank")
      end

      it '500文字を超える場合は無効' do
        wise_saying.content = 'a' * 501
        expect(wise_saying).not_to be_valid
        expect(wise_saying.errors[:content]).to include('is too long (maximum is 500 characters)')
      end

      it '500文字の場合は有効' do
        wise_saying.content = 'a' * 500
        expect(wise_saying).to be_valid
      end

      it '通常の文字列の場合は有効' do
        wise_saying.content = '怒りは一時的な感情です'
        expect(wise_saying).to be_valid
      end
    end

    describe 'author（著者）' do
      it '必須である' do
        wise_saying.author = nil
        expect(wise_saying).not_to be_valid
        expect(wise_saying.errors[:author]).to include("can't be blank")
      end

      it '空文字の場合は無効' do
        wise_saying.author = ''
        expect(wise_saying).not_to be_valid
        expect(wise_saying.errors[:author]).to include("can't be blank")
      end

      it '100文字を超える場合は無効' do
        wise_saying.author = 'a' * 101
        expect(wise_saying).not_to be_valid
        expect(wise_saying.errors[:author]).to include('is too long (maximum is 100 characters)')
      end

      it '100文字の場合は有効' do
        wise_saying.author = 'a' * 100
        expect(wise_saying).to be_valid
      end

      it '通常の文字列の場合は有効' do
        wise_saying.author = 'アンガーマネジメント専門家'
        expect(wise_saying).to be_valid
      end
    end

    describe 'category（カテゴリ）' do
      it '必須である' do
        wise_saying.category = nil
        expect(wise_saying).not_to be_valid
        expect(wise_saying.errors[:category]).to include("can't be blank")
      end

      it '空文字の場合は無効' do
        wise_saying.category = ''
        expect(wise_saying).not_to be_valid
      end

      it '無効なカテゴリの場合は無効' do
        invalid_categories = %w[invalid_category unknown test]
        invalid_categories.each do |invalid_category|
          wise_saying.category = invalid_category
          expect(wise_saying).not_to be_valid
          expect(wise_saying.errors[:category]).to be_present
        end
      end

      it '有効なカテゴリの場合は有効' do
        valid_categories = %w[
          anger_management mindfulness self_acceptance self_care
          breathing_techniques motivation wisdom general
        ]
        valid_categories.each do |valid_category|
          new_wise_saying = build(:wise_saying, category: valid_category)
          expect(new_wise_saying).to be_valid
        end
      end
    end

    describe 'anger_level_range（怒りレベル範囲）' do
      it '必須である' do
        wise_saying.anger_level_range = nil
        expect(wise_saying).not_to be_valid
        expect(wise_saying.errors[:anger_level_range]).to include("can't be blank")
      end

      it '空文字の場合は無効' do
        wise_saying.anger_level_range = ''
        expect(wise_saying).not_to be_valid
      end

      it '無効な範囲の場合は無効' do
        invalid_ranges = %w[invalid very_high unknown]
        invalid_ranges.each do |invalid_range|
          wise_saying.anger_level_range = invalid_range
          expect(wise_saying).not_to be_valid
          expect(wise_saying.errors[:anger_level_range]).to be_present
        end
      end

      it '有効な範囲の場合は有効' do
        valid_ranges = %w[all low medium high]
        valid_ranges.each do |valid_range|
          new_wise_saying = build(:wise_saying, anger_level_range: valid_range)
          expect(new_wise_saying).to be_valid
        end
      end
    end
  end

  describe 'スコープ' do
    before do
      create_list(:wise_saying, 3, :anger_management)
      create_list(:wise_saying, 2, :mindfulness)
      create(:wise_saying, :general, anger_level_range: 'all')
    end

    describe '.by_category' do
      it '指定したカテゴリの名言のみを返す' do
        result = described_class.by_category('anger_management')
        expect(result.pluck(:category).uniq).to eq(['anger_management'])
        expect(result.count).to be >= 3
      end

      it '別のカテゴリでも正しく機能する' do
        result = described_class.by_category('mindfulness')
        expect(result.pluck(:category).uniq).to eq(['mindfulness'])
        expect(result.count).to be >= 2
      end
    end

    describe '.general_wisdom' do
      it 'anger_level_rangeが"all"の名言のみを返す' do
        result = described_class.general_wisdom
        expect(result.pluck(:anger_level_range).uniq).to eq(['all'])
      end
    end

    describe '.anger_management' do
      it 'anger_managementカテゴリの名言のみを返す' do
        result = described_class.anger_management
        expect(result.pluck(:category).uniq).to eq(['anger_management'])
        expect(result.count).to be >= 3
      end
    end

    describe '.mindfulness' do
      it 'mindfulnessカテゴリの名言のみを返す' do
        result = described_class.mindfulness
        expect(result.pluck(:category).uniq).to eq(['mindfulness'])
        expect(result.count).to be >= 2
      end
    end

    describe '.recent' do
      it '作成日時の降順で返す' do
        result = described_class.recent.limit(3)
        expect(result.first.created_at).to be >= result.last.created_at
      end
    end

    describe '.random_order' do
      it 'ランダムな順序で返す（SQLが正しい）' do
        expect { described_class.random_order.to_a }.not_to raise_error
        expect(described_class.random_order.count).to be > 0
      end
    end

    describe 'スコープの組み合わせ' do
      it '複数のスコープを組み合わせて使用できる' do
        result = described_class.anger_management.recent
        expect(result.pluck(:category).uniq).to eq(['anger_management'])
        expect(result.count).to be >= 3
      end
    end
  end

  describe 'concern modules' do
    it 'WiseSayingDisplayモジュールをincludeしている' do
      expect(described_class.included_modules).to include(WiseSayingDisplay)
    end

    it 'WiseSayingEffectivenessモジュールをincludeしている' do
      expect(described_class.included_modules).to include(WiseSayingEffectiveness)
    end

    it 'WiseSayingRecommendationLogicモジュールをincludeしている' do
      expect(described_class.included_modules).to include(WiseSayingRecommendationLogic)
    end

    it 'WiseSayingSearchモジュールをincludeしている' do
      expect(described_class.included_modules).to include(WiseSayingSearch)
    end
  end

  describe 'データの整合性' do
    it '複数の名言を問題なく作成できる' do
      expect do
        create_list(:wise_saying, 10)
      end.to change(described_class, :count).by(10)
    end

    it '同じ内容でも異なる名言として扱われる' do
      content = '同じ内容の名言'
      wise_saying1 = create(:wise_saying, content: content)
      wise_saying2 = create(:wise_saying, content: content)
      expect(wise_saying1).not_to eq(wise_saying2)
      expect(described_class.where(content: content).count).to eq(2)
    end
  end

  describe 'エッジケース' do
    it '最大文字数の内容と著者で作成できる' do
      wise_saying = build(:wise_saying,
                          content: 'a' * 500,
                          author: 'b' * 100)
      expect(wise_saying).to be_valid
    end

    it 'すべてのカテゴリと怒りレベルの組み合わせが有効' do
      categories = %w[anger_management mindfulness self_acceptance self_care
                      breathing_techniques motivation wisdom general]
      anger_levels = %w[all low medium high]

      categories.each do |category|
        anger_levels.each do |level|
          wise_saying = build(:wise_saying, category: category, anger_level_range: level)
          expect(wise_saying).to be_valid,
                                 "category: #{category}, anger_level: #{level} should be valid"
        end
      end
    end
  end
end
