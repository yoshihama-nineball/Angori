require 'rails_helper'

RSpec.describe CalmingPoint, type: :model do
  describe 'Factory' do
    it '有効なファクトリを持つ' do
      expect(build(:calming_point)).to be_valid
    end

    it 'with_pointsトレイトが機能する' do
      calming_point = build(:calming_point, :with_points)
      expect(calming_point.total_points).to eq(150)
      expect(calming_point.current_level).to eq(2)
    end

    it 'with_streakトレイトが機能する' do
      calming_point = build(:calming_point, :with_streak)
      expect(calming_point.streak_days).to eq(7)
      expect(calming_point.last_action_date).to be_present
    end

    it 'high_levelトレイトが機能する' do
      calming_point = build(:calming_point, :high_level)
      expect(calming_point.total_points).to eq(1000)
      expect(calming_point.current_level).to eq(10)
      expect(calming_point.streak_days).to eq(30)
    end
  end

  describe 'アソシエーション' do
    it { is_expected.to belong_to(:user) }
  end

  describe 'バリデーション' do
    let(:calming_point) { build(:calming_point) }

    describe 'total_points（累計ポイント）' do
      it '必須である' do
        calming_point.total_points = nil
        expect(calming_point).not_to be_valid
        expect(calming_point.errors[:total_points]).to include("can't be blank")
      end

      it '数値である必要がある' do
        calming_point.total_points = 'abc'
        expect(calming_point).not_to be_valid
        expect(calming_point.errors[:total_points]).to include('is not a number')
      end

      it '0以上である必要がある' do
        calming_point.total_points = -1
        expect(calming_point).not_to be_valid
        expect(calming_point.errors[:total_points]).to include('must be greater than or equal to 0')
      end

      it '0の場合は有効' do
        calming_point.total_points = 0
        expect(calming_point).to be_valid
      end

      it '正の整数の場合は有効' do
        calming_point.total_points = 100
        expect(calming_point).to be_valid
      end
    end

    describe 'current_level（現在のレベル）' do
      it '必須である' do
        calming_point.current_level = nil
        expect(calming_point).not_to be_valid
        expect(calming_point.errors[:current_level]).to include("can't be blank")
      end

      it '数値である必要がある' do
        calming_point.current_level = 'abc'
        expect(calming_point).not_to be_valid
        expect(calming_point.errors[:current_level]).to include('is not a number')
      end

      it '1以上である必要がある' do
        calming_point.current_level = 0
        expect(calming_point).not_to be_valid
        expect(calming_point.errors[:current_level]).to include('must be greater than or equal to 1')
      end

      it '1の場合は有効' do
        calming_point.current_level = 1
        expect(calming_point).to be_valid
      end

      it '正の整数の場合は有効' do
        calming_point.current_level = 5
        expect(calming_point).to be_valid
      end
    end

    describe 'streak_days（連続日数）' do
      it '必須である' do
        calming_point.streak_days = nil
        expect(calming_point).not_to be_valid
        expect(calming_point.errors[:streak_days]).to include("can't be blank")
      end

      it '数値である必要がある' do
        calming_point.streak_days = 'abc'
        expect(calming_point).not_to be_valid
        expect(calming_point.errors[:streak_days]).to include('is not a number')
      end

      it '0以上である必要がある' do
        calming_point.streak_days = -1
        expect(calming_point).not_to be_valid
        expect(calming_point.errors[:streak_days]).to include('must be greater than or equal to 0')
      end

      it '0の場合は有効' do
        calming_point.streak_days = 0
        expect(calming_point).to be_valid
      end

      it '正の整数の場合は有効' do
        calming_point.streak_days = 7
        expect(calming_point).to be_valid
      end
    end
  end

  describe 'concern modules' do
    it 'CalmingPointCalculationモジュールをincludeしている' do
      expect(described_class.included_modules).to include(CalmingPointCalculation)
    end

    it 'CalmingPointDisplayモジュールをincludeしている' do
      expect(described_class.included_modules).to include(CalmingPointDisplay)
    end

    it 'CalmingPointStreakモジュールをincludeしている' do
      expect(described_class.included_modules).to include(CalmingPointStreak)
    end

    it 'CalmingPointMilestonesモジュールをincludeしている' do
      expect(described_class.included_modules).to include(CalmingPointMilestones)
    end
  end
end
