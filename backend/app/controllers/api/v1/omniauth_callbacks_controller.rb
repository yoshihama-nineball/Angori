module Api
  module V1
    class OmniauthCallbacksController < ApplicationController
      # セッション保護を無効化（OmniAuth用）
      skip_before_action :verify_authenticity_token, only: [:google_oauth2, :failure]
      before_action :authenticate_user!, except: [:google_oauth2, :failure]

      def google_oauth2
        begin
          @user = User.from_omniauth(request.env["omniauth.auth"])
          
          if @user.persisted?
            # 安全なJWTトークン生成
            token = generate_jwt_for_user(@user)
            
            if token
              # フロントエンドにリダイレクト（トークンを含む）
              redirect_to build_frontend_redirect_url(true, token)
            else
              Rails.logger.error "Failed to generate JWT token for user #{@user.id}"
              redirect_to build_frontend_redirect_url(false, nil, 'token_generation_failed')
            end
            
          else
            Rails.logger.error "OAuth user creation failed: #{@user.errors.full_messages}"
            redirect_to build_frontend_redirect_url(false, nil, 'user_creation_failed')
          end
          
        rescue => e
          Rails.logger.error "OAuth error: #{e.message}"
          Rails.logger.error e.backtrace.join("\n")
          
          redirect_to build_frontend_redirect_url(false, nil, 'server_error')
        end
      end

      def failure
        Rails.logger.error "OAuth failure: #{params[:message]}"
        redirect_to build_frontend_redirect_url(false, nil, 'oauth_failed')
      end

      private

      def generate_jwt_for_user(user)
        begin
          # devise-jwtの既存の仕組みを使用
          token, _payload = Warden::JWTAuth::UserEncoder.new.call(user, :user, nil)
          "Bearer #{token}"
        rescue => e
          Rails.logger.error "JWT encoding error: #{e.message}"
          
          # フォールバック：既存のDEVISE_JWT_SECRET_KEYを使用
          secret_key = ENV['DEVISE_JWT_SECRET_KEY'] || Rails.application.credentials.devise_jwt_secret_key
          
          manual_payload = {
            sub: user.id,
            scp: 'user',
            iat: Time.current.to_i,
            exp: (Time.current + 7.days).to_i,
            jti: SecureRandom.uuid
          }
          
          manual_token = JWT.encode(manual_payload, secret_key, 'HS256')
          "Bearer #{manual_token}"
        end
      end

      def build_frontend_redirect_url(success, token = nil, error_type = nil)
        base_url = "#{frontend_url}/auth/callback"
        params = []
        
        if success && token
          params << "success=true"
          params << "token=#{token}"
        else
          params << "success=false"
          params << "error=#{error_type}" if error_type
        end
        
        "#{base_url}?#{params.join('&')}"
      end

      def frontend_url
        Rails.env.production? ? ENV['FRONTEND_URL'] : 'http://localhost:3000'
      end
    end
  end
end