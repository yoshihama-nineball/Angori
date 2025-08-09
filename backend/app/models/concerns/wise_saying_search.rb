module WiseSayingSearch
  extend ActiveSupport::Concern

  class_methods do
    def category_counts
      group(:category).count
    end

    def anger_level_distribution
      group(:anger_level_range).count
    end

    def search_content(query)
      where('content ILIKE ? OR author ILIKE ?', "%#{query}%", "%#{query}%")
    end

    def for_anger_level(level)
      level_int = level.to_i
      ranges = case level_int
               when 1..3 then %w[all low]
               when 4..6 then %w[all medium]
               when 7..10 then %w[all high]
               else ['all']
               end

      where(anger_level_range: ranges)
    end
  end
end
