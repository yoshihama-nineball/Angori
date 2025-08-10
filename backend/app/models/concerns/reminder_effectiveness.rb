module ReminderEffectiveness
  extend ActiveSupport::Concern

  EFFECTIVENESS_SCORES = {
    'breathing' => 8,
    'meditation' => 9,
    'exercise' => 7,
    'relaxation' => 6,
    'mindfulness' => 8,
    'positive_thinking' => 5,
    'gratitude' => 6,
    'self_care' => 7,
    'music' => 5,
    'nature' => 6
  }.freeze

  FREQUENCY_MULTIPLIERS = {
    'daily' => 1.0,
    'weekly' => 0.8,
    'monthly' => 0.6
  }.freeze

  def effectiveness_score
    base_score = EFFECTIVENESS_SCORES[reminder_category] || 5
    frequency_multiplier = calculate_frequency_multiplier
    user_engagement_bonus = calculate_engagement_bonus

    ((base_score * frequency_multiplier) + user_engagement_bonus).round(1)
  end

  def completion_rate
    # 一時的に固定値を返す（ReminderLogが実装されるまで）
    75.0
    
    # 元のコード（コメントアウト）
    # total_scheduled = reminder_logs.count
    # return 0.0 if total_scheduled.zero?
    # completed = reminder_logs.where(completed: true).count
    # (completed.to_f / total_scheduled * 100).round(1)
  end

  included do
    # extend EffectivenessReporting
    # extend OptimalTimeSuggestion
  end

  private

  def calculate_frequency_multiplier
    FREQUENCY_MULTIPLIERS[frequency] || 1.0
  end

  def calculate_engagement_bonus
    rate = completion_rate
    case rate
    when 80..100 then 2.0
    when 60...80 then 1.5
    when 40...60 then 1.0
    when 20...40 then 0.5
    else 0.0
    end
  end
end