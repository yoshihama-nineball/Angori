module WiseSayingRecommendationLogic
  extend ActiveSupport::Concern

  class_methods do
    def random_for_level(anger_level)
      for_anger_level(anger_level).random_order.first
    end

    def daily_wisdom
      seed = Date.current.strftime('%Y%m%d').to_i
      srand(seed)
      all.sample
    ensure
      srand
    end

    def recommend_for_user(user, limit = 3)
      return random_order.limit(limit) unless user.anger_logs.any?

      recent_avg = calculate_recent_anger_average(user)
      if recent_avg
        get_recommendations_for_level(recent_avg.round, limit)
      else
        general_wisdom.random_order.limit(limit)
      end
    end
  end

  module ClassMethods
    private

    def calculate_recent_anger_average(user)
      user.anger_logs.where(occurred_at: 1.week.ago..).average(:anger_level)
    end

    def get_recommendations_for_level(anger_level, limit)
      recommendations = for_anger_level(anger_level).random_order.limit(limit)
      return recommendations if recommendations.count >= limit

      additional = general_wisdom.random_order.limit(limit - recommendations.count)
      (recommendations + additional).uniq.first(limit)
    end
  end
end
