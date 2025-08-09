module ContactMessageWorkflow
  extend ActiveSupport::Concern

  def mark_as_replied!
    update!(replied_at: Time.current, status: 'resolved') if status == 'pending'
  end

  def can_be_resolved?
    %w[pending in_progress].include?(status)
  end

  def can_be_reopened?
    %w[resolved closed].include?(status)
  end

  def resolve!
    return false unless can_be_resolved?

    update!(status: 'resolved', replied_at: Time.current)
  end

  def reopen!
    return false unless can_be_reopened?

    update!(status: 'pending', replied_at: nil)
  end

  def close!
    update!(status: 'closed')
  end

  def auto_close_if_old!
    return unless resolved? && replied_at && replied_at < 30.days.ago

    close!
  end

  def from_registered_user?
    User.exists?(email: email)
  end

  def response_time_hours
    return nil unless replied_at

    ((replied_at - created_at) / 1.hour).round(2)
  end

  def overdue?
    return false unless pending?

    created_at < case priority
                 when 'urgent' then 2.hours.ago
                 when 'high' then 1.day.ago
                 when 'medium' then 3.days.ago
                 else 7.days.ago
                 end
  end

  private

  def pending?
    status == 'pending'
  end

  def resolved?
    status == 'resolved'
  end
end
