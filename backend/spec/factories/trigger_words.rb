FactoryBot.define do
  factory :trigger_word do
    association :user
    sequence(:name) { |n| "トリガーワード#{n}" }
    anger_level_avg { rand(1.0..10.0) }
    category { %w[work family social sensory other].sample }
    count { rand(1..10) }
    last_triggered_at { rand(1.week.ago..Time.current) }
  end
end
