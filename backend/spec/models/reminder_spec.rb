require 'rails_helper'

RSpec.describe Reminder, type: :model do
  describe 'バリデーション' do
    it '有効な属性を持つ場合は有効であること' do
      expect(build(:reminder)).to be_valid
    end

    it 'titleが空の場合は無効であること' do
      reminder = build(:reminder, title: nil)
      expect(reminder).not_to be_valid
    end

    it 'messageが空の場合は無効であること' do
      reminder = build(:reminder, message: nil)
      expect(reminder).not_to be_valid
    end

    it 'reminder_categoryが無効な値の場合は無効であること' do
      reminder = build(:reminder, reminder_category: 'invalid')
      expect(reminder).not_to be_valid
    end

    it 'schedule_timeが不正な形式の場合は無効であること' do
      reminder = build(:reminder, schedule_time: '9時30分')
      expect(reminder).not_to be_valid
    end

    it 'days_of_weekが空の場合は無効であること' do
      reminder = build(:reminder, days_of_week: [])
      expect(reminder).not_to be_valid
    end

    it 'is_activeがnilの場合は無効であること' do
      reminder = build(:reminder, is_active: nil)
      expect(reminder).not_to be_valid
    end
  end

  describe 'スコープ' do
    let!(:active_reminder) { create(:reminder, is_active: true) }
    let!(:inactive_reminder) { create(:reminder, is_active: false) }

    it 'activeスコープで取得できること' do
      expect(Reminder.active).to include(active_reminder)
      expect(Reminder.active).not_to include(inactive_reminder)
    end

    it 'inactiveスコープで取得できること' do
      expect(Reminder.inactive).to include(inactive_reminder)
      expect(Reminder.inactive).not_to include(active_reminder)
    end

    it 'by_categoryスコープでカテゴリ別に取得できること' do
      expect(Reminder.by_category('water_intake')).to include(active_reminder)
    end
  end

  describe 'インスタンスメソッド' do
    let(:reminder) { build(:reminder, reminder_category: 'reflection', schedule_time: '21:00', days_of_week: [Date.current.wday]) }

    it '#category_emojiが正しい絵文字を返すこと' do
      expect(reminder.category_emoji).to eq('🪞')
    end

    it '#category_nameが正しい日本語名を返すこと' do
      expect(reminder.category_name).to eq('振り返り・内省')
    end

    it '#display_categoryが絵文字＋日本語名を返すこと' do
      expect(reminder.display_category).to eq('🪞 振り返り・内省')
    end

    it '#scheduled_for_today?が正しく判定すること' do
      expect(reminder.scheduled_for_today?).to be_truthy
    end

    it '#formatted_scheduleが曜日と時刻を返すこと' do
      expect(reminder.formatted_schedule).to include(reminder.schedule_time)
    end

    it '#frequency_descriptionが正しく返ること（平日）' do
      reminder.days_of_week = [1, 2, 3, 4, 5]
      expect(reminder.frequency_description).to eq('平日')
    end

    it '#effectiveness_scoreが数値を返すこと' do
      expect(reminder.effectiveness_score).to be_a(Integer)
    end

    it '#toggle_active!で状態が反転すること' do
      reminder = create(:reminder, is_active: true)
      expect { reminder.toggle_active! }.to change { reminder.reload.is_active }.from(true).to(false)
    end
  end

  describe 'クラスメソッド' do
    let(:user) { create(:user) }

    it '.for_user_todayが今日のリマインダーを返すこと' do
      reminder = create(:reminder, user: user, days_of_week: [Date.current.wday])
      expect(Reminder.for_user_today(user)).to include(reminder)
    end

    it '.category_statsがカテゴリ別件数を返すこと' do
      create(:reminder, user: user, reminder_category: 'reflection')
      stats = Reminder.category_stats(user)
      expect(stats).to include('reflection' => 1)
    end

    it '.effectiveness_reportが統計を返すこと' do
      create(:reminder, user: user, reminder_category: 'reflection')
      report = Reminder.effectiveness_report(user)
      expect(report).to include(:total_reminders, :active_count, :avg_effectiveness)
    end
  end
end
