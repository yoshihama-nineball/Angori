module Api
  module V1
    class RegistrationsController < Devise::RegistrationsController
      respond_to :json

      def create
        build_resource(sign_up_params)

        if resource.save
          render_success_response
        else
          render_error_response
        end
      end

      private

      def sign_up_params
        params.require(:user).permit(:name, :email, :password, :password_confirmation)
      end

      def render_success_response
        render json: {
          status: 'success',
          message: 'ユーザー登録が完了しました',
          user: {
            id: resource.id,
            email: resource.email,
            name: resource.name,
            created_at: resource.created_at
          }
        }, status: :created
      end

      def render_error_response
        if resource.errors[:email].any? { |error| error.include?('taken') }
          render json: {
            status: 'error',
            message: 'メールアドレスが重複しています'
          }, status: :conflict
        else
          render json: {
            status: 'error',
            message: '登録に失敗しました',
            errors: resource.errors.full_messages
          }, status: :unprocessable_entity
        end
      end
    end
  end
end
