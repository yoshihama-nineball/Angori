FactoryBot.define do
  factory :wise_saying do
    sequence(:content) { |n| "格言#{n}の内容です。心を落ち着けて、深呼吸をしてみましょう。" }
    category { %w[anger_management mindfulness self_acceptance self_care breathing_techniques general].sample }
    anger_level_range { %w[low medium high all].sample }

    transient do
      randomize_author { true }
    end

    author { '心理学者A' }
  end
end
