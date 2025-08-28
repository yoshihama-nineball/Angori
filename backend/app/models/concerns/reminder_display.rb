module ReminderDisplay
  extend ActiveSupport::Concern

  CATEGORY_EMOJIS = {
    'breathing' => '🫁',
    'meditation' => '🧘‍♀️',
    'exercise' => '🏃‍♂️',
    'relaxation' => '😌',
    'mindfulness' => '🌸',
    'positive_thinking' => '💭',
    'gratitude' => '🙏',
    'self_care' => '💆‍♀️',
    'music' => '🎵',
    'nature' => '🌿',
    'water_intake' => '💧',
    'reflection' => '🪞'
  }.freeze

  CATEGORY_NAMES = {
    'breathing' => '深呼吸',
    'meditation' => '瞑想',
    'exercise' => '運動',
    'relaxation' => 'リラックス',
    'mindfulness' => 'マインドフルネス',
    'positive_thinking' => 'ポジティブ思考',
    'gratitude' => '感謝',
    'self_care' => 'セルフケア',
    'music' => '音楽',
    'nature' => '自然',
    'water_intake' => '水分補給',
    'reflection' => '振り返り・内省'
  }.freeze

  def category_emoji
    CATEGORY_EMOJIS[reminder_category] || '📝'
  end

  def category_name
    CATEGORY_NAMES[reminder_category] || reminder_category
  end

  def display_title
    "#{category_emoji} #{title}"
  end

  def time_until_next
    next_time = next_scheduled_time
    return '過去の時刻です' if next_time.nil?

    seconds = (next_time - Time.current).to_i
    return '過去の時刻です' if seconds.negative?

    format_duration(seconds)
  end

  private

  def format_duration(seconds)
    if seconds < 60
      "#{seconds}秒後"
    elsif seconds < 3600
      minutes = seconds / 60
      "#{minutes}分後"
    elsif seconds < 86_400
      hours = seconds / 3600
      minutes = (seconds % 3600) / 60
      "#{hours}時間#{minutes}分後"
    else
      days = seconds / 86_400
      hours = (seconds % 86_400) / 3600
      "#{days}日#{hours}時間後"
    end
  end
end
