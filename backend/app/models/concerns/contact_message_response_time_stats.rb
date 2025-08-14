module ContactMessageResponseTimeStats
  def response_time_stats
    resolved_messages = where(status: 'resolved').where.not(replied_at: nil)
    return default_stats if resolved_messages.empty?

    response_times = calculate_response_times(resolved_messages)

    {
      average_hours: response_times.sum / response_times.size,
      median_hours: calculate_median(response_times),
      fastest_hours: response_times.min,
      slowest_hours: response_times.max,
      total_resolved: resolved_messages.count
    }
  end

  private

  def calculate_response_times(resolved_messages)
    resolved_messages.map do |message|
      (message.replied_at - message.created_at) / 1.hour
    end
  end

  def default_stats
    {
      average_hours: 0,
      median_hours: 0,
      fastest_hours: 0,
      slowest_hours: 0,
      total_resolved: 0
    }
  end

  def calculate_median(array)
    sorted = array.sort
    length = sorted.length
    return 0 if length.zero?

    if length.odd?
      sorted[length / 2]
    else
      (sorted[(length / 2) - 1] + sorted[length / 2]) / 2.0
    end
  end
end
