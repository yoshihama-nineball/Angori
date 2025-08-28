require 'rails_helper'

RSpec.describe CalmingPoint, type: :model do
  let(:user) { create(:user) }
  let(:calming_point) { user.calming_point }

  describe 'validations' do
    it '有効な属性を持つ場合有効である' do
      expect(calming_point).to be_valid
    end

    it 'total pointは正の整数である' do
      calming_point.total_points = -1
      expect(calming_point).not_to be_valid
    end

    it 'current levelは1以上でない場合無効である' do
      calming_point.current_level = 0
      expect(calming_point).not_to be_valid
    end
  end

  describe '#calculate_points!' do
    it '1つ目のログ作成でポイントが正しく計算される' do
      create(:anger_log, user: user, ai_advice: 'advice')
      expect(calming_point.reload.total_points).to eq(35)
    end

    it '2つ目のログ作成でポイントが累積される' do
      create(:anger_log, user: user, ai_advice: 'advice')
      create(:anger_log, user: user)
      expect(calming_point.reload.total_points).to eq(40)
    end

    it 'pointsによって正しくlevelが更新される' do
      calming_point.update!(total_points: 250)
      expected_level = (250 / 100) + 1
      expect(expected_level).to eq(3)
    end
  end

  describe '#level_name' do
    it 'current level 1で正しい名前を返す' do
      calming_point.update!(current_level: 1)
      expect(calming_point.level_name).to include('生まれたてのゴリラ')
    end

    it 'current level 5で正しい名前を返す' do
      calming_point.update!(current_level: 5)
      expect(calming_point.level_name).to include('修行中ゴリラ')
    end

    it 'current level 10で正しい名前を返す' do
      calming_point.update!(current_level: 10)
      expect(calming_point.level_name).to include('落ち着きゴリラ')
    end
  end
end
