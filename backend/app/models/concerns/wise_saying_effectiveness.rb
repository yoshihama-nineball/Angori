module WiseSayingEffectiveness
  extend ActiveSupport::Concern

  LEVEL_RANGES = {
    'low' => (1..3),
    'medium' => (4..6),
    'high' => (7..10)
  }.freeze

  LEVEL_CENTERS = {
    'low' => 2,
    'medium' => 5,
    'high' => 8
  }.freeze

  def suitable_for_anger_level?(level)
    return true if anger_level_range == 'all'

    range = LEVEL_RANGES[anger_level_range]
    range&.include?(level) || false
  end

  def effectiveness_for_level(anger_level)
    return 'perfect' if suitable_for_anger_level?(anger_level)
    return 'good' if anger_level_range == 'all'

    level_diff = calculate_level_difference(anger_level)
    categorize_effectiveness(level_diff)
  end

  private

  def calculate_level_difference(anger_level)
    center = LEVEL_CENTERS[anger_level_range]
    return 10 unless center

    (anger_level - center).abs
  end

  def categorize_effectiveness(level_diff)
    case level_diff
    when 0..1 then 'excellent'
    when 2..3 then 'good'
    when 4..5 then 'fair'
    else 'poor'
    end
  end
end
