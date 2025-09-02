# app/controllers/api/v1/calming_points_controller.rb
module Api
  module V1
    class CalmingPointsController < ApplicationController
      before_action :authenticate_user!

      def show
        calming_point = find_or_create_calming_point
        calming_point.calculate_points!
        render json: calming_point_response(calming_point)
      rescue StandardError => e
        handle_calming_point_error(e)
      end

      private

      def find_or_create_calming_point
        current_user.calming_point || create_initial_calming_point
      end

      def calming_point_response(calming_point)
        calming_point.as_json.merge(
          'points_to_next_level' => calming_point.points_to_next_level,
          'next_level_points' => calming_point.next_level_points,
          'level_name' => calming_point.level_name
        )
      end

      def handle_calming_point_error(error)
        Rails.logger.error "Error in CalmingPointsController#show: #{error.message}"
        Rails.logger.error error.backtrace.join("\n")
        render json: { error: 'ポイント情報の取得に失敗しました' }, status: :internal_server_error
      end

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
