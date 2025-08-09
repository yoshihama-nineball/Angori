module WiseSayingRecommendations
  extend ActiveSupport::Concern

  included do
    extend RecommendationLogic
    extend QuoteCategories
  end
end
