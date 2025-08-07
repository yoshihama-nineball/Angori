FactoryBot.define do
  factory :badge do
    sequence(:name) { |n| "バッジ#{n}" }
    sequence(:description) { |n| "バッジ#{n}の説明文です。達成条件を満たすと獲得できます。" }
    badge_type { %w[milestone achievement special rare].sample }
    requirements do
      {
        type: %w[consultation_count consecutive_days anger_improvement].sample,
        threshold: rand(1..30)
      }
    end
    points_reward { rand(10..999) }
    is_active { true }
  end
end
