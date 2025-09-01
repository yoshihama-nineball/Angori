module CalmingPointDisplay
  extend ActiveSupport::Concern

  LEVEL_NAMES = {
    (1..2) => '生まれたてのゴリラ 🦍😤',
    (3..5) => '修行中ゴリラ 🦍🧘',
    (6..10) => '落ち着きゴリラ 🦍😌',
    (11..15) => '賢者ゴリラ 🦍🧠'
  }.freeze

  def level_name
    LEVEL_NAMES.each do |range, name|
      return name if range.include?(current_level)
    end
    '禅マスターゴリラ 🦍✨'
  end

def next_level_points
  (current_level + 1) * 100
end

  def points_to_next_level
    next_level_points - total_points
  end
end
