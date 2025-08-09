FactoryBot.define do
  factory :reminder do
    association :user
    title { '水分補給リマインダー' }
    message { 'コップ一杯の水を飲みましょう。' }
    reminder_category { 'water_intake' }
    schedule_time { '09:30' }
    days_of_week { [1, 2, 3, 4, 5] } # 平日
    is_active { true }
  end
end
