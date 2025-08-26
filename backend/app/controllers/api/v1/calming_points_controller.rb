# app/controllers/api/v1/calming_points_controller.rb
module Api
  module V1
    class CalmingPointsController < ApplicationController
      before_action :authenticate_user!

      # app/controllers/api/v1/calming_points_controller.rb
      def show
        calming_point = current_user.calming_point || create_initial_calming_point
        calming_point.calculate_points!

        render json: calming_point
      end

      private

      def create_initial_calming_point
        current_user.create_calming_point!(
          total_points: 0,
          current_level: 1,
          streak_days: 0,
          last_action_date: Date.current
        )
      end
    end
  end
end
