module UserBadgeProgress
  extend ActiveSupport::Concern

  PROGRESS_CALCULATORS = {
    'first_consultation' => :consultation_progress,
    'consecutive_days' => :consecutive_days_progress,
    'consultation_count' => :consultation_count_progress,
    'detailed_emotion_logs' => :emotion_logs_progress,
    'trigger_analysis' => :trigger_analysis_progress,
    'calming_points' => :calming_points_progress,
    'level_reached' => :level_progress
  }.freeze

  included do
    # extend BadgeAchievability
    # extend BadgeProgressCalculation
    # extend ProgressCalculatorMethods
  end
end
