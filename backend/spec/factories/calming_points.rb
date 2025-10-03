FactoryBot.define do
  factory :calming_point do
    association :user
    total_points { 0 }
    current_level { 1 }
    streak_days { 0 }
    last_action_date { nil }

    trait :with_points do
      total_points { 150 }
      current_level { 2 }
    end

    trait :with_streak do
      streak_days { 7 }
      last_action_date { Time.current }
    end

    trait :high_level do
      total_points { 1000 }
      current_level { 10 }
      streak_days { 30 }
    end

    trait :beginner do
      total_points { 0 }
      current_level { 1 }
      streak_days { 0 }
    end
  end
end
