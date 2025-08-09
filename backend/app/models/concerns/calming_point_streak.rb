module CalmingPointStreak
  extend ActiveSupport::Concern

  def calculate_streak_days
    logs = user.anger_logs.order(occurred_at: :desc)
    return 0 if logs.empty?

    streak = 0
    current_date = Date.current
    dates_with_logs = extract_unique_dates(logs)

    dates_with_logs.each do |log_date|
      expected_date = current_date - streak.days
      break if log_date < expected_date

      streak += 1 if log_date == expected_date
    end

    streak
  end

  private

  def extract_unique_dates(logs)
    logs.map { |log| log.occurred_at.to_date }.uniq.sort.reverse
  end
end
