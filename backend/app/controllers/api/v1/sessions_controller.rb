module Api
  skip_before_action :verify_authenticity_token, if: -> { request.format.json? }
  module V1
    class SessionsController < ApplicationController
      def create
        user_params = params.require(:user).permit(:email, :password)
        user = User.find_by(email: user_params[:email])

        if user&.valid_password?(user_params[:password])
          handle_successful_login(user)
        else
          handle_failed_login
        end
      end

      def destroy
        render json: {
          status: 'success',
          message: 'ログアウトしました'
        }, status: :ok
      end

      private

      def handle_successful_login(user)
        token = generate_jwt_token(user)
        response.headers['Authorization'] = "Bearer #{token}"

        render json: {
          status: 'success',
          message: 'ログインしました'
        }, status: :ok
      end

      def handle_failed_login
        render json: {
          status: 'error',
          message: 'メールアドレスまたはパスワードが正しくありません'
        }, status: :unauthorized
      end

      def generate_jwt_token(user)
        payload = build_jwt_payload(user)
        secret_key = jwt_secret_key

        JWT.encode(payload, secret_key, 'HS256')
      end

      def build_jwt_payload(user)
        {
          sub: user.id,
          scp: 'user',
          aud: nil,
          iat: Time.current.to_i,
          exp: 24.hours.from_now.to_i,
          jti: SecureRandom.uuid
        }
      end

      def jwt_secret_key
        ENV['DEVISE_JWT_SECRET_KEY'] || Rails.application.credentials.devise_jwt_secret_key
      end
    end
  end
end
