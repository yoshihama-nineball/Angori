module ReminderOptionalTimeSuggestion
  def suggest_optimal_times(_user)
    # ReminderLogが実装されるまで一時的にデフォルト値を返す
    default_suggestion

    # 元のコード（ReminderLog実装後に有効化予定）
    # completed_logs = user.reminder_logs.completed.includes(:reminder)
    # return default_suggestion if completed_logs.empty?
    # time_effectiveness = analyze_time_effectiveness(completed_logs)
    # generate_time_suggestions(time_effectiveness)
  end

  private

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
