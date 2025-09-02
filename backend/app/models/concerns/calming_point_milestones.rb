module CalmingPointMilestones
  extend ActiveSupport::Concern

  MILESTONE_TYPES = {
    (1..5) => 'beginner',
    (6..10) => 'intermediate',
    (11..15) => 'advanced'
  }.freeze

  def update_milestone_flags
    flags = milestone_flags || {}

    update_basic_milestones(flags)
    update_streak_milestones(flags)
    update_improvement_milestones(flags)

    self.milestone_flags = flags
  end

  private

  def update_level_achievements(new_level)
    achievements = level_achievements || []

    ((current_level + 1)..new_level).each do |level|
      achievements << create_achievement_record(level)
    end

    self.level_achievements = achievements
  end

  def create_achievement_record(level)
    {
      level: level,
      achieved_at: Time.current.iso8601,
      points_required: level * 100,
      milestone_type: determine_milestone_type(level)
    }
  end

  def determine_milestone_type(level)
    MILESTONE_TYPES.each do |range, type|
      return type if range.include?(level)
    end
    'master'
  end

  def update_basic_milestones(flags)
    flags['first_log_created'] = true if user.anger_logs.any?
    flags['first_ai_consultation'] = true if user.anger_logs.where.not(ai_advice: [nil, '']).any?
  end

  def update_streak_milestones(flags)
    flags['consecutive_7_days'] = true if streak_days >= 7
    flags['consecutive_30_days'] = true if streak_days >= 30
  end

  def update_improvement_milestones(flags)
    recent_avg = user.anger_logs.where(occurred_at: 1.week.ago..).average(:anger_level)
    previous_avg = user.anger_logs.where(occurred_at: 2.weeks.ago..1.week.ago).average(:anger_level)

    return unless recent_avg && previous_avg && (previous_avg - recent_avg >= 1)

    flags['anger_level_reduced'] = true
  end
end
