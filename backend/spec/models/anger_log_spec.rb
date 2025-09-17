require 'rails_helper'

RSpec.describe AngerLog, type: :model do
  # FactoryBotでの基本的なAngerLogの作成テスト
  describe 'Factory' do
    it '有効なファクトリを持つ' do
      expect(build(:anger_log)).to be_valid
    end
  end

  # バリデーションテスト
  describe 'バリデーション' do
    let(:anger_log) { build(:anger_log) }

    describe 'user_id（ユーザー）' do
      it '必須である' do
        anger_log.user = nil
        expect(anger_log).not_to be_valid
        expect(anger_log.errors[:user]).to include('must exist')
      end
    end

    describe 'anger_level（怒りレベル）' do
      it '必須である' do
        anger_log.anger_level = nil
        expect(anger_log).not_to be_valid
        expect(anger_log.errors[:anger_level]).to include("can't be blank")
      end

      it '1以上10以下の値である必要がある' do
        [0, 11, -1, 15].each do |invalid_level|
          anger_log.anger_level = invalid_level
          expect(anger_log).not_to be_valid
          expect(anger_log.errors[:anger_level]).to include('is not included in the list')
        end
      end

      it '1から10の値の場合は有効' do
        (1..10).each do |valid_level|
          anger_log.anger_level = valid_level
          expect(anger_log).to be_valid
        end
      end
    end

    describe 'occurred_at（発生日時）' do
      it '必須である' do
        anger_log.occurred_at = nil
        expect(anger_log).not_to be_valid
        expect(anger_log.errors[:occurred_at]).to include("can't be blank")
      end

      it '有効な日時の場合は有効' do
        anger_log.occurred_at = Time.current
        expect(anger_log).to be_valid
      end
    end

    describe 'situation_description（状況説明）' do
      it '必須である' do
        anger_log.situation_description = nil
        expect(anger_log).not_to be_valid
        expect(anger_log.errors[:situation_description]).to include("can't be blank")
      end

      it '空文字の場合は無効' do
        anger_log.situation_description = ''
        expect(anger_log).not_to be_valid
        expect(anger_log.errors[:situation_description]).to include("can't be blank")
      end

      it '1000文字を超える場合は無効' do
        anger_log.situation_description = 'a' * 1001
        expect(anger_log).not_to be_valid
        expect(anger_log.errors[:situation_description]).to include('is too long (maximum is 1000 characters)')
      end

      it '1000文字の場合は有効' do
        anger_log.situation_description = 'a' * 1000
        expect(anger_log).to be_valid
      end
    end

    describe 'location（場所）' do
      it '空の場合は有効' do
        anger_log.location = nil
        expect(anger_log).to be_valid
      end

      it '100文字を超える場合は無効' do
        anger_log.location = 'a' * 101
        expect(anger_log).not_to be_valid
        expect(anger_log.errors[:location]).to include('is too long (maximum is 100 characters)')
      end

      it '100文字の場合は有効' do
        anger_log.location = 'a' * 100
        expect(anger_log).to be_valid
      end
    end

    describe 'ai_advice（AIアドバイス）' do
      it '空の場合は有効' do
        anger_log.ai_advice = nil
        expect(anger_log).to be_valid
      end

      it '2000文字を超える場合は無効' do
        anger_log.ai_advice = 'a' * 2001
        expect(anger_log).not_to be_valid
        expect(anger_log.errors[:ai_advice]).to include('is too long (maximum is 2000 characters)')
      end

      it '2000文字の場合は有効' do
        anger_log.ai_advice = 'a' * 2000
        expect(anger_log).to be_valid
      end
    end

    describe 'reflection（振り返り）' do
      it '空の場合は有効' do
        anger_log.reflection = nil
        expect(anger_log).to be_valid
      end

      it '1000文字を超える場合は無効' do
        anger_log.reflection = 'a' * 1001
        expect(anger_log).not_to be_valid
        expect(anger_log.errors[:reflection]).to include('is too long (maximum is 1000 characters)')
      end

      it '1000文字の場合は有効' do
        anger_log.reflection = 'a' * 1000
        expect(anger_log).to be_valid
      end
    end

    describe 'perception（認識）' do
      it '空の場合は有効' do
        anger_log.perception = nil
        expect(anger_log).to be_valid
      end

      it '1000文字を超える場合は無効' do
        anger_log.perception = 'a' * 1001
        expect(anger_log).not_to be_valid
        expect(anger_log.errors[:perception]).to include('is too long (maximum is 1000 characters)')
      end

      it '1000文字の場合は有効' do
        anger_log.perception = 'a' * 1000
        expect(anger_log).to be_valid
      end
    end
  end

  # アソシエーションテスト
  describe 'アソシエーション' do
    it { is_expected.to belong_to(:user) }
  end

  # スコープテスト
  describe 'スコープ' do
    let(:user) { create(:user) }
    let!(:old_log) { create(:anger_log, user: user, occurred_at: 3.days.ago, anger_level: 5) }
    let!(:recent_log) { create(:anger_log, user: user, occurred_at: 1.day.ago, anger_level: 8) }
    let!(:with_advice) { create(:anger_log, user: user, ai_advice: 'テストアドバイス') }
    let!(:without_advice) { create(:anger_log, user: user, ai_advice: nil) }

    describe '.recent' do
      it 'occurred_atの降順で取得する' do
        # 今回作成したテストデータのみに絞って確認
        test_logs = [old_log, recent_log, with_advice, without_advice]
        results = described_class.where(id: test_logs.map(&:id)).recent

        expect(results.first.occurred_at).to be >= results.last.occurred_at
        expect(results.include?(recent_log)).to be true
        expect(results.include?(old_log)).to be true
      end
    end

    describe '.by_anger_level' do
      it '指定されたanger_levelのレコードを取得する' do
        results = described_class.by_anger_level(8)
        expect(results).to include(recent_log)
        expect(results).not_to include(old_log)
      end
    end

    describe '.by_date_range' do
      it '指定された期間のレコードを取得する' do
        start_date = 2.days.ago
        end_date = Time.current
        results = described_class.by_date_range(start_date, end_date)
        expect(results).to include(recent_log)
        expect(results).not_to include(old_log)
      end
    end

    describe '.high_anger' do
      it 'anger_levelが7以上のレコードを取得する' do
        results = described_class.high_anger
        expect(results).to include(recent_log)
        expect(results).not_to include(old_log)
      end
    end

    describe '.with_ai_advice' do
      it 'ai_adviceが存在するレコードを取得する' do
        results = described_class.with_ai_advice
        expect(results).to include(with_advice)
        expect(results).not_to include(without_advice)
      end
    end

    describe '.search_by_keyword' do
      let!(:searchable_log) do
        create(:anger_log,
               user: user,
               situation_description: '会議で上司に怒られた',
               trigger_words: '上司,会議',
               reflection: '冷静になるべきだった',
               perception: '理不尽だと感じた')
      end

      it 'situation_descriptionで検索できる' do
        results = described_class.search_by_keyword('会議')
        expect(results).to include(searchable_log)
      end

      it 'trigger_wordsで検索できる' do
        results = described_class.search_by_keyword('上司')
        expect(results).to include(searchable_log)
      end

      it 'reflectionで検索できる' do
        results = described_class.search_by_keyword('冷静')
        expect(results).to include(searchable_log)
      end

      it 'perceptionで検索できる' do
        results = described_class.search_by_keyword('理不尽')
        expect(results).to include(searchable_log)
      end

      it 'キーワードが空の場合は全レコードを返す' do
        results = described_class.search_by_keyword('')
        expect(results.count).to eq(described_class.count)
      end

      it 'キーワードがnilの場合は全レコードを返す' do
        results = described_class.search_by_keyword(nil)
        expect(results.count).to eq(described_class.count)
      end
    end
  end

  # コールバックテスト
  describe 'コールバック' do
    describe 'after_create' do
      it 'ユーザーのcalming_pointを更新する' do
        user = create(:user)
        calming_point = user.calming_point

        allow(calming_point).to receive(:calculate_points!)
        create(:anger_log, user: user)
        expect(calming_point).to have_received(:calculate_points!)
      end
    end
  end

  # AngerLogTriggerWords concernのテスト
  describe 'AngerLogTriggerWords concern' do
    let(:user) { create(:user) }

    describe 'トリガーワード更新' do
      it 'anger_log作成時にtrigger_wordsを解析してTriggerWordレコードを作成する' do
        expect do
          create(:anger_log, user: user, trigger_words: '仕事,上司,残業')
        end.to change(TriggerWord, :count).by(3)

        trigger_words = user.trigger_words.pluck(:name)
        expect(trigger_words).to include('仕事', '上司', '残業')
      end

      it '既存のtrigger_wordがある場合はカウントと平均レベルを更新する' do
        # 最初のログ作成
        create(:anger_log, user: user, trigger_words: '仕事', anger_level: 5)

        # 2回目のログ作成で既存trigger_wordを更新
        create(:anger_log, user: user, trigger_words: '仕事', anger_level: 7)

        trigger_word = user.trigger_words.find_by(name: '仕事')
        expect(trigger_word.count).to eq(2)
        expect(trigger_word.anger_level_avg).to eq(6.0)
      end

      it 'カテゴリを自動設定する' do
        create(:anger_log, user: user, trigger_words: '仕事,家族,友人,騒音')

        work_trigger = user.trigger_words.find_by(name: '仕事')
        family_trigger = user.trigger_words.find_by(name: '家族')
        social_trigger = user.trigger_words.find_by(name: '友人')
        sensory_trigger = user.trigger_words.find_by(name: '騒音')

        expect(work_trigger.category).to eq('work')
        expect(family_trigger.category).to eq('family')
        expect(social_trigger.category).to eq('social')
        expect(sensory_trigger.category).to eq('sensory')
      end

      it 'その他のカテゴリに該当しない場合はotherに設定する' do
        create(:anger_log, user: user, trigger_words: '特殊なキーワード')

        trigger_word = user.trigger_words.find_by(name: '特殊なキーワード')
        expect(trigger_word.category).to eq('other')
      end
    end
  end
end
