module ReminderScheduling
  extend ActiveSupport::Concern

  def next_scheduled_time
    return nil unless active?

    base_time = calculate_base_time
    adjust_for_frequency(base_time)
  end

  def should_trigger_now?
    return false unless active?

    next_time = next_scheduled_time
    return false unless next_time

    (Time.current - next_time).abs < 60
  end

  def mark_as_triggered!
    update!(last_triggered_at: Time.current)
  end

  private

  def calculate_base_time
    now = Time.current
    target_time = Time.zone.parse("#{Date.current} #{schedule_time}")

    if target_time <= now
      target_time + 1.day
    else
      target_time
    end
  end

  def adjust_for_frequency(base_time)
    return base_time if frequency == 'daily'
    return nil unless %w[weekly monthly].include?(frequency)

    case frequency
    when 'weekly'
      adjust_for_weekly(base_time)
    when 'monthly'
      adjust_for_monthly(base_time)
    end
  end

  def adjust_for_weekly(base_time)
    return base_time if Date.current.wday == frequency_details['day_of_week']

    days_ahead = (frequency_details['day_of_week'] - Date.current.wday) % 7
    days_ahead = 7 if days_ahead.zero?
    base_time + days_ahead.days
  end

  def adjust_for_monthly(base_time)
    target_day = frequency_details['day_of_month']
    return base_time if Date.current.day == target_day

    if Date.current.day < target_day
      base_time.change(day: target_day)
    else
      (base_time + 1.month).change(day: target_day)
    end
  end
end
