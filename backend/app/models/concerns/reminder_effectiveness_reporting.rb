module EffectivenessReporting
  def effectiveness_report(user)
    reminders = user.reminders.active.includes(:reminder_logs)
    effectiveness_scores = reminders.map(&:effectiveness_score)

    avg_effectiveness = calculate_average_effectiveness(effectiveness_scores)

    {
      average_effectiveness: avg_effectiveness,
      total_reminders: reminders.count,
      most_effective_category: find_most_effective_category(reminders),
      completion_rate: calculate_overall_completion_rate(reminders)
    }
  end

  private

  def calculate_average_effectiveness(effectiveness_scores)
    if effectiveness_scores.any?
      (effectiveness_scores.sum.to_f / effectiveness_scores.size).round(1)
    else
      0
    end
  end

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
end
