FactoryBot.define do
  factory :trigger_word do
    association :user
    sequence(:name) { |n| "トリガーワード#{n}" }
    anger_level_avg { rand(1.0..10.0).round(1) }
    category { %w[work family social sensory other].sample }
    count { rand(1..10) }
    last_triggered_at { rand(1.week.ago..Time.current) }

    # ========================================
    # 頻度レベル別のtrait
    # ========================================
    trait :low_frequency do
      count { rand(1..2) }
    end

    trait :medium_frequency do
      count { rand(3..5) }
    end

    trait :high_frequency do
      count { rand(6..10) }
    end

    trait :very_high_frequency do
      count { rand(11..20) }
    end

    # ========================================
    # 怒りレベル別のtrait
    # ========================================
    trait :mild_anger do
      anger_level_avg { rand(1.0..3.0).round(1) }
    end

    trait :moderate_anger do
      anger_level_avg { rand(3.1..6.0).round(1) }
    end

    trait :severe_anger do
      anger_level_avg { rand(6.1..8.0).round(1) }
    end

    trait :extreme_anger do
      anger_level_avg { rand(8.1..10.0).round(1) }
    end

    # ========================================
    # ビジネスロジック用のtrait
    # ========================================
    # needs_attention? が true になる条件
    trait :needs_attention do
      anger_level_avg { rand(6.0..10.0).round(1) }
      count { rand(3..10) }
    end

    # dangerous スコープに該当する条件
    trait :dangerous do
      anger_level_avg { rand(6.0..10.0).round(1) }
      count { rand(2..10) }
    end

    # improvement_candidates に該当する条件
    trait :improvement_candidate do
      anger_level_avg { rand(5.0..10.0).round(1) }
      count { rand(2..10) }
    end

    # ========================================
    # カテゴリ別のtrait
    # ========================================
    trait :work_category do
      category { 'work' }
      name { %w[上司 残業 会議 締切 クレーム].sample }
    end

    trait :family_category do
      category { 'family' }
      name { %w[親 兄弟 配偶者 子供 親戚].sample }
    end

    trait :social_category do
      category { 'social' }
      name { %w[友人 隣人 マナー違反 行列 SNS].sample }
    end

    trait :sensory_category do
      category { 'sensory' }
      name { %w[騒音 匂い 混雑 暑さ 眩しさ].sample }
    end

    trait :other_category do
      category { 'other' }
    end
  end
end
