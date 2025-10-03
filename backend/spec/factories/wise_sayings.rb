FactoryBot.define do
  factory :wise_saying do
    sequence(:content) { |n| "格言#{n}の内容です。心を落ち着けて、深呼吸をしてみましょう。" }
    category { %w[anger_management mindfulness self_acceptance self_care breathing_techniques general].sample }
    anger_level_range { %w[low medium high all].sample }
    transient do
      randomize_author { true }
    end
    author { '心理学者A' }

    trait :anger_management do
      content { '怒りを感じたら、深呼吸を3回してみましょう' }
      author { 'アンガーマネジメント専門家' }
      category { 'anger_management' }
    end

    trait :mindfulness do
      content { '今この瞬間に意識を向けることで、心が落ち着きます' }
      author { 'マインドフルネス実践者' }
      category { 'mindfulness' }
    end

    trait :self_acceptance do
      content { '自分の感情を認めることが、成長の第一歩です' }
      author { '心理カウンセラー' }
      category { 'self_acceptance' }
    end

    trait :self_care do
      content { '心と体のケアは、怒りのコントロールに欠かせません' }
      author { 'セルフケア専門家' }
      category { 'self_care' }
    end

    trait :breathing_techniques do
      content { '4秒吸って、7秒止めて、8秒吐く。これを繰り返しましょう' }
      author { '呼吸法トレーナー' }
      category { 'breathing_techniques' }
    end

    trait :motivation do
      content { '一歩ずつ進めば、必ず目標に到達できます' }
      author { 'モチベーションコーチ' }
      category { 'motivation' }
    end

    trait :wisdom do
      content { '賢者は怒らず、愚者は怒りに身を任せる' }
      author { '古代の哲学者' }
      category { 'wisdom' }
    end

    trait :general do
      content { '人生は山あり谷あり、すべてが学びの機会です' }
      author { '人生の先輩' }
      category { 'general' }
    end

    trait :for_low_anger do
      anger_level_range { 'low' }
    end

    trait :for_medium_anger do
      anger_level_range { 'medium' }
    end

    trait :for_high_anger do
      anger_level_range { 'high' }
    end

    trait :for_all_levels do
      anger_level_range { 'all' }
    end
  end
end
