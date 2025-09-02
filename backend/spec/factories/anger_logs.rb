FactoryBot.define do
  factory :anger_log do
    association :user
    anger_level { rand(1..10) }
    occurred_at { rand(1.week.ago..Time.current) }
    location { %w[職場 自宅 電車内 コンビニ].sample }
    perception { '何か理不尽に感じてしまった' }
    situation_description { 'テスト用の状況説明です。' }
    trigger_words { 'ストレス,テスト,プレッシャー' }
    emotions_felt { %w[怒り イライラ ストレス].sample(2) }
  end
end
