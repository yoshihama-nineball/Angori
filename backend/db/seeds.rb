# データベースクリア（開発環境のみ）
if ENV['RESET_DATABASE'] == 'true'
  Rails.logger.debug '🧹 Cleaning database...'
  UserBadge.destroy_all
  TriggerWord.destroy_all
  CalmingPoint.destroy_all
  AngerLog.destroy_all
  ContactMessage.destroy_all
  Reminder.destroy_all
  User.destroy_all
  Badge.destroy_all
  WiseSaying.destroy_all
end

# ユーザーが存在しない場合のみ作成
if User.none?
  Rails.logger.debug '🦍 Creating initial data...'

  # 管理者ユーザー作成
  admin_user = User.create!(
    email: 'admin@angori.com',
    password: 'Password123!',
    name: 'Angori管理者'
  )
  Rails.logger.debug { "✅ Created admin user: #{admin_user.email}" }

  # テストユーザー作成
  test_users = [
    # {
    #   email: 'test@example.com',
    #   password: 'Password123!',
    #   name: 'テストゴリラ'
    # },
    {
      email: 'asd.user@example.com',
      password: 'Password123!',
      name: 'ASD特性ユーザー'
    },
    {
      email: 'hsp.user@example.com',
      password: 'Password123!',
      name: 'HSP特性ユーザー'
    }
  ]

  created_users = test_users.map do |user_data|
    User.create!(user_data)
  end
  Rails.logger.debug { "✅ Created #{created_users.count} test users" }

  # Badgeデータ作成
  badges_data = [
    {
      name: '初回相談マスター',
      description: 'AI相談を初めて完了した勇気ある一歩',
      badge_type: 'milestone',
      requirements: { type: 'first_consultation', threshold: 1 },
      points_reward: 20
    },
    {
      name: '継続チャンピオン',
      description: '7日連続でログを記録した継続力',
      badge_type: 'achievement',
      requirements: { type: 'consecutive_days', threshold: 7 },
      points_reward: 50
    },
    {
      name: '相談の達人',
      description: 'AI相談を10回完了したベテラン',
      badge_type: 'achievement',
      requirements: { type: 'consultation_count', threshold: 10 },
      points_reward: 100
    },
    {
      name: '感情分析マスター',
      description: '詳細な感情記録を30回以上行った',
      badge_type: 'achievement',
      requirements: { type: 'detailed_emotion_logs', threshold: 30 },
      points_reward: 75
    },
    {
      name: '成長実感者',
      description: '怒りレベルの平均値が1以上改善した',
      badge_type: 'milestone',
      requirements: { type: 'anger_improvement', threshold: 1.0 },
      points_reward: 150
    },
    {
      name: 'レベル5到達者',
      description: 'CalmingPointレベル5に到達した',
      badge_type: 'achievement',
      requirements: { type: 'level_reached', threshold: 5 },
      points_reward: 80
    },
    {
      name: '1000ポイント達成者',
      description: 'CalmingPointで1000ポイントを獲得した',
      badge_type: 'special',
      requirements: { type: 'calming_points', threshold: 1000 },
      points_reward: 200
    },
    {
      name: 'アンガー分析の専門家',
      description: 'トリガーワード分析を20回以上完了した',
      badge_type: 'rare',
      requirements: { type: 'trigger_analysis', threshold: 20 },
      points_reward: 300
    }
  ]

  badges_data.each do |badge_data|
    Badge.create!(badge_data)
  end
  Rails.logger.debug { "✅ Created #{Badge.count} badges" }

  # WiseSayingデータ作成
  wise_sayings_data = [
    # アンガーマネジメント
    {
      content: '怒りは一時の狂気。感情に支配されず、一度深呼吸をして冷静になろう。',
      author: 'アンガーマネジメント研究より',
      category: 'anger_management',
      anger_level_range: 'high'
    },
    {
      content: '怒りは二次感情。その奥にある本当の気持ちを見つめてみよう。',
      author: 'カウンセリング心理学',
      category: 'anger_management',
      anger_level_range: 'medium'
    },

    # マインドフルネス
    {
      content: '今この瞬間に意識を向けよう。過去の後悔や未来の不安は一度脇に置いて。',
      author: 'マインドフルネス実践',
      category: 'mindfulness',
      anger_level_range: 'all'
    },
    {
      content: '感情は天気のようなもの。嵐も必ず過ぎ去り、再び青空が見える。',
      author: '禅の教え',
      category: 'mindfulness',
      anger_level_range: 'medium'
    },

    # 自己受容
    {
      content: '完璧である必要はない。今の自分を受け入れることから成長が始まる。',
      author: 'セルフコンパッション研究',
      category: 'self_acceptance',
      anger_level_range: 'low'
    },
    {
      content: '自分に優しくしよう。他人にするように、自分自身も大切に扱おう。',
      author: 'ポジティブ心理学',
      category: 'self_acceptance',
      anger_level_range: 'all'
    },

    # 呼吸法
    {
      content: '息を吸って4秒、止めて7秒、吐いて8秒。この単純なリズムが心を落ち着かせる。',
      author: '呼吸法指導',
      category: 'breathing_techniques',
      anger_level_range: 'high'
    },
    {
      content: '呼吸は心と体をつなぐ橋。意識的な呼吸で内なる平和を取り戻そう。',
      author: 'ヨガの智慧',
      category: 'breathing_techniques',
      anger_level_range: 'medium'
    },

    # モチベーション
    {
      content: '今日の小さな一歩が、明日の大きな変化につながる。継続は力なり。',
      author: '成長マインドセット',
      category: 'motivation',
      anger_level_range: 'all'
    },
    {
      content: '失敗は学習の機会。完璧を求めず、成長を楽しもう。',
      author: 'レジリエンス研究',
      category: 'motivation',
      anger_level_range: 'low'
    },

    # セルフケア
    {
      content: '自分の感情を大切にしよう。感じることを恥じる必要はない。',
      author: 'エモーショナルケア',
      category: 'self_care',
      anger_level_range: 'all'
    },
    {
      content: '疲れた時は休むこと。それは怠惰ではなく、必要なメンテナンス。',
      author: 'バーンアウト予防',
      category: 'self_care',
      anger_level_range: 'medium'
    },

    # 一般的な智慧
    {
      content: '変えられないものを受け入れ、変えられるものに集中し、その違いを見分ける知恵を持とう。',
      author: 'ニーバーの祈り',
      category: 'wisdom',
      anger_level_range: 'all'
    },
    {
      content: '人生は10%が起こる出来事、90%がそれにどう反応するかで決まる。',
      author: 'スティーブン・コヴィー',
      category: 'wisdom',
      anger_level_range: 'all'
    }
  ]

  wise_sayings_data.each do |saying_data|
    WiseSaying.create!(saying_data)
  end
  Rails.logger.debug { "✅ Created #{WiseSaying.count} wise sayings" }

  # サンプルアンガーログ（多様なパターン）
  anger_log_patterns = [
    # 仕事関連
    {
      anger_level: 8,
      occurred_at: 3.days.ago,
      location: '職場',
      situation_description: '急な締切変更で残業確定。事前連絡もなく、他の予定もキャンセルになった。',
      trigger_words: '締切,残業,突然の変更,コミュニケーション不足',
      emotions_felt: %w[怒り 呆れ ストレス 疲労],
      perception: '急な変更は困るし、事前に相談してくれれば対応できたのに',
      ai_advice: 'この状況では怒りを感じるのは自然です。深呼吸をして、上司との建設的な対話を考えてみましょう。事前の情報共有の改善を提案してみてください。',
      reflection: '確かに急な変更は困るけど、チームでルールを決めて予防できるかも。'
    },
    # 感覚過敏関連
    {
      anger_level: 6,
      occurred_at: 2.days.ago,
      location: '電車内',
      situation_description: '満員電車で隣の人がイヤホンから大音量で音楽を流している。車内も蒸し暑く、不快感が増した。',
      trigger_words: '騒音,満員電車,感覚過敏,マナー違反',
      emotions_felt: %w[イライラ 疲労 不快感],
      perception: '周りの人はあまり気にしてないみたいだけど、私には本当に辛い',
      ai_advice: '感覚過敏の方には辛い状況ですね。ノイズキャンセリングイヤホンや乗車時間の調整などの対策を検討してみてください。',
      reflection: '朝の通勤時間をずらすか、対策グッズを用意しよう。'
    },
    # 家族関連
    {
      anger_level: 7,
      occurred_at: 1.day.ago,
      location: '自宅',
      situation_description: '家族が約束を守らず、掃除当番をサボった。何度も注意しているのに改善されない。',
      trigger_words: '約束破り,家事分担,繰り返し,責任感',
      emotions_felt: %w[怒り 失望 疲れ],
      perception: '何度も言ってるのに何で約束を破るの',
      ai_advice: '家族との約束事は感情的になりやすい問題です。冷静に話し合いの場を設けて、具体的なルールと結果を決めてみましょう。',
      reflection: 'ルールを明文化して、みんなで共有するのが良いかも。'
    },
    # 社会的状況
    {
      anger_level: 5,
      occurred_at: 12.hours.ago,
      location: 'コンビニ',
      situation_description: 'レジで店員の接客態度が悪く、商品を乱雑に扱われた。急いでいたので余計にイライラした。',
      trigger_words: '接客態度,マナー,時間プレッシャー,雑な扱い',
      emotions_felt: %w[イライラ 焦り],
      perception: '商品を乱雑に扱われると不愉快だし、迷惑をかけられた気分になる',
      ai_advice: '急いでいる時は些細なことでもイライラしやすくなります。時間に余裕を持つことと、相手の立場も考えてみることが大切です。',
      reflection: '急いでいたから敏感になってたかも。時間に余裕を持とう。'
    },
    # 軽度の怒り
    {
      anger_level: 3,
      occurred_at: 6.hours.ago,
      location: '自宅',
      situation_description: 'スマホの充電が切れていて、大事な連絡を確認できなかった。充電し忘れた自分にもイライラ。',
      trigger_words: '準備不足,自己管理,連絡ミス,技術トラブル',
      emotions_felt: %w[軽いイライラ 自己嫌悪],
      perception: '何で肝心な時に限って充電が切れるかな...',
      ai_advice: '準備不足による小さなトラブルですね。充電習慣の見直しや、予備バッテリーの準備など、予防策を考えてみましょう。',
      reflection: '毎晩充電する習慣をつけよう。'
    }
  ]

  # 各ユーザーにアンガーログを分散して作成
  created_users.each_with_index do |user, _index|
    # ユーザーごとに2-3個のログを作成
    logs_for_user = anger_log_patterns.sample(rand(2..3))

    logs_for_user.each do |log_data|
      user.anger_logs.create!(log_data)
    end

    Rails.logger.debug { "✅ Created #{logs_for_user.count} anger logs for #{user.name}" }
  end

  # リマインダーサンプル作成（一部ユーザーのみ）
  reminder_samples = [
    {
      reminder_category: 'daily_log',
      title: '今日の気持ちを記録しませんか？',
      message: 'ゴリラと一緒に今日の感情を振り返ってみましょう🦍',
      schedule_time: '20:00',
      days_of_week: [0, 1, 2, 3, 4, 5, 6],
      is_active: true
    },
    {
      reminder_category: 'consultation',
      title: 'AI相談でスッキリしませんか？',
      message: '最近溜め込んでいる気持ち、ゴリラに相談してみませんか？',
      schedule_time: '12:00',
      days_of_week: [1, 3, 5], # 月水金
      is_active: true
    },
    {
      reminder_category: 'reflection',
      title: '過去のログを振り返ってみませんか？',
      message: '成長の軌跡を確認して、自分を褒めてあげましょう✨',
      schedule_time: '09:00',
      days_of_week: [0], # 日曜日
      is_active: true
    },
    {
      reminder_category: 'breathing',
      title: '深呼吸でリフレッシュ',
      message: '4-4-4呼吸法で心を落ち着かせませんか？',
      schedule_time: '15:00',
      days_of_week: [1, 2, 3, 4, 5], # 平日
      is_active: true
    }
  ]

  # 最初の2人のテストユーザーにリマインダー作成
  created_users.first(2).each_with_index do |user, _index|
    reminders_for_user = reminder_samples.sample(rand(2..3))

    reminders_for_user.each do |reminder_data|
      user.reminders.create!(reminder_data)
    end

    Rails.logger.debug { "✅ Created #{user.reminders.count} reminders for #{user.name}" }
  end

  # ContactMessageサンプル作成
  contact_samples = [
    {
      user: nil, # 未登録ユーザー
      email: 'anonymous@example.com',
      name: '匿名ユーザー',
      category: 'general_inquiry',
      subject: 'アプリの使い方について',
      message: 'アンガーログの記録方法がよくわからないので教えてください。',
      status: 'pending'
    },
    {
      user: created_users.first,
      email: created_users.first.email,
      name: created_users.first.name,
      category: 'feature_request',
      subject: '新機能の提案',
      message: 'カレンダー表示機能があると便利だと思います。',
      status: 'in_progress',
      admin_reply: 'ご提案ありがとうございます。開発チームで検討させていただきます。',
      replied_at: 1.day.ago
    },
    {
      user: created_users.second,
      email: created_users.second.email,
      name: created_users.second.name,
      category: 'bug_report',
      subject: 'ログ保存エラー',
      message: 'アンガーログを保存しようとするとエラーが出ます。',
      status: 'resolved',
      admin_reply: 'バグを修正いたしました。ご報告ありがとうございました。',
      replied_at: 2.hours.ago
    }
  ]

  contact_samples.each do |contact_data|
    ContactMessage.create!(contact_data)
  end
  Rails.logger.debug { "✅ Created #{ContactMessage.count} contact messages" }

  # ポイント計算実行（全ユーザー）
  User.includes(:calming_point).find_each do |user|
    user.calming_point&.calculate_points!
    points = user.calming_point&.total_points || 0
    level = user.calming_point&.current_level || 1
    Rails.logger.debug { "📊 Updated points for #{user.name}: #{points} points (Level #{level})" }
  end

  # バッジ獲得チェック（全ユーザー）
  created_users.each do |user|
    awarded_badges = Badge.check_all_badges_for_user(user)
    next unless awarded_badges.any?

    Rails.logger.debug do
      "🏆 #{user.name} earned badges: #{awarded_badges.map(&:name).join(', ')}"
    end
  end

  # 統計出力
  Rails.logger.debug "\n🦍 Angori Seeds completed! 🦍"
  Rails.logger.debug '=' * 50
  Rails.logger.debug { "👥 Users: #{User.count}" }
  Rails.logger.debug { "😡 Anger Logs: #{AngerLog.count}" }
  Rails.logger.debug { "🎯 Calming Points Records: #{CalmingPoint.count}" }
  Rails.logger.debug { "🔤 Trigger Words: #{TriggerWord.count}" }
  Rails.logger.debug { "🏆 Badges: #{Badge.count}" }
  Rails.logger.debug { "🎖️ User Badges: #{UserBadge.count}" }
  Rails.logger.debug { "💭 Wise Sayings: #{WiseSaying.count}" }
  Rails.logger.debug { "⏰ Reminders: #{Reminder.count}" }
  Rails.logger.debug { "📧 Contact Messages: #{ContactMessage.count}" }
  Rails.logger.debug '=' * 50

  # サンプルユーザー情報表示
  Rails.logger.debug "\n📋 Sample User Credentials:"
  Rails.logger.debug 'Admin: admin@angori.com / password123'
  # Rails.logger.debug 'Test User: test@example.com / password123'
  Rails.logger.debug 'ASD User: asd.user@example.com / password123'
  Rails.logger.debug 'HSP User: hsp.user@example.com / password123'

  Rails.logger.debug "\n🎮 Sample Data Overview:"
  Rails.logger.debug '- 多様なアンガーログパターン (仕事・感覚過敏・家族・社会)'
  Rails.logger.debug '- 段階的なバッジシステム (milestone・achievement・special・rare)'
  Rails.logger.debug '- レベル別格言システム (低・中・高・全対応)'
  Rails.logger.debug '- スマートリマインダー (日記・相談・振り返り・呼吸法)'
  Rails.logger.debug '- 問い合わせ管理システム (pending・progress・resolved)'
  Rails.logger.debug "\n🚀 Ready for development and testing!"
else
  Rails.logger.debug '👥 Users already exist, skipping seed creation'
end
