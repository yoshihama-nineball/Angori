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

  def effectiveness_score
    base_score = EFFECTIVENESS_SCORES[category] || 5
    frequency_multiplier = calculate_frequency_multiplier
    user_engagement_bonus = calculate_engagement_bonus

    ((base_score * frequency_multiplier) + user_engagement_bonus).round(1)
  end

  def completion_rate
    total_scheduled = reminder_logs.count
    return 0.0 if total_scheduled.zero?

    completed = reminder_logs.where(completed: true).count
    (completed.to_f / total_scheduled * 100).round(1)
  end

  class_methods do
    def effectiveness_report(user)
      reminders = user.reminders.active.includes(:reminder_logs)
      effectiveness_scores = reminders.map(&:effectiveness_score)

      avg_effectiveness = if effectiveness_scores.any?
                            (effectiveness_scores.sum.to_f / effectiveness_scores.size).round(1)
                          else
                            0
                          end

      {
        average_effectiveness: avg_effectiveness,
        total_reminders: reminders.count,
        most_effective_category: find_most_effective_category(reminders),
        completion_rate: calculate_overall_completion_rate(reminders)
      }
    end

    def suggest_optimal_times(user)
      completed_logs = user.reminder_logs.completed.includes(:reminder)
      return default_suggestion if completed_logs.empty?

      time_effectiveness = analyze_time_effectiveness(completed_logs)
      generate_time_suggestions(time_effectiveness)
      endal_times(user)
      completed_logs = user.reminder_logs.completed.includes(:reminder)
      return default_suggestion if completed_logs.empty?

      time_effectiveness = analyze_time_effectiveness(completed_logs)
      generate_time_suggestions(time_effectiveness)
    end

    private

    def find_most_effective_category(reminders)
      return nil if reminders.empty?

      category_scores = reminders.group_by(&:category)
                                 .transform_values { |group| group.map(&:effectiveness_score).sum / group.size }

      category_scores.max_by { |_, score| score }&.first
    end

    def calculate_overall_completion_rate(reminders)
      return 0.0 if reminders.empty?

      total_logs = reminders.sum { |r| r.reminder_logs.count }
      return 0.0 if total_logs.zero?

      completed_logs = reminders.sum { |r| r.reminder_logs.completed.count }
      (completed_logs.to_f / total_logs * 100).round(1)
    end

    def analyze_time_effectiveness(completed_logs)
      completed_logs.group_by { |log| log.completed_at.hour }
                    .transform_values(&:count)
                    .sort_by { |_, count| -count }
    end

    def generate_time_suggestions(time_effectiveness)
      optimal_hours = time_effectiveness.first(3).map(&:first)
      optimal_hours.map { |hour| format('%<hour>02d:00', hour: hour) }
    end

    def default_suggestion
      ['09:00', '14:00', '19:00']
    end
  end

  private

  def calculate_frequency_multiplier
    case frequency
    when 'daily' then 1.0
    when 'weekly' then 0.8
    when 'monthly' then 0.6
    else 1.0
    end
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
