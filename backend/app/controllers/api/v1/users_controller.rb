module Api
  module V1
    class UsersController < ApplicationController
      def me
        render json: current_user.as_json(
          only: %i[id name email provider uid google_image_url created_at]
        )
      end
    end
  end
end
