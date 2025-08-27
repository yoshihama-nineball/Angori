module Api
  module V1
    class WiseSayingsController < ApplicationController
      before_action :authenticate_user!

      def daily_wisdom
        wise_saying = WiseSaying.daily_wisdom

        render json: {
          id: wise_saying.id,
          content: wise_saying.content,
          author: wise_saying.author,
          category: wise_saying.category,
          category_name: wise_saying.category_name,
          category_emoji: wise_saying.category_emoji,
          display_category: wise_saying.display_category,
          anger_level_range: wise_saying.anger_level_range,
          formatted_content: wise_saying.formatted_content
        }
      end

      def recommend_for_user
        recommendations = WiseSaying.recommend_for_user(current_user, 1)
        wise_saying = recommendations.first || WiseSaying.daily_wisdom

        render json: wise_saying.as_json(
          only: %i[id content author category anger_level_range is_active display_count created_at updated_at]
        )
      end
    end
  end
end
