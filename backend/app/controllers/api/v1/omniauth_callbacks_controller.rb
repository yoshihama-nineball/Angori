module Api
  module V1
    class OmniauthCallbacksController < ApplicationController
      def passthru
        oauth_service = GoogleOauthService.new(request)
        redirect_to "https://accounts.google.com/o/oauth2/auth?#{oauth_service.build_oauth_params.to_query}",
                    allow_other_host: true
      end

      def google_oauth2
        auth_code = params[:code]
        raise 'Authorization code not found' unless auth_code

        oauth_service = GoogleOauthService.new(request)
        user_info = oauth_service.fetch_user_info(auth_code)
        user = User.from_google_info(user_info)

        handle_user_authentication(user)
      rescue StandardError => e
        handle_oauth_error(e)
      end

      def failure
        Rails.logger.error "OAuth failure: #{params[:message]}"
        redirect_to build_frontend_redirect_url(false, nil, 'oauth_failed'), allow_other_host: true
      end

      private

      def handle_user_authentication(user)
        if user.persisted?
          token = generate_jwt_for_user(user)
          handle_token_generation(user, token)
        else
          handle_user_creation_failure(user)
        end
      end

      def handle_token_generation(user, token)
        if token
          redirect_to build_frontend_redirect_url(true, token), allow_other_host: true
        else
          Rails.logger.error "Failed to generate JWT token for user #{user.id}"
          redirect_to build_frontend_redirect_url(false, nil, 'token_generation_failed'), allow_other_host: true
        end
      end

      def handle_user_creation_failure(user)
        Rails.logger.error "OAuth user creation failed: #{user.errors.full_messages}"
        redirect_to build_frontend_redirect_url(false, nil, 'user_creation_failed'), allow_other_host: true
      end

      def handle_oauth_error(error)
        Rails.logger.error "OAuth error: #{error.message}"
        redirect_to build_frontend_redirect_url(false, nil, 'server_error'), allow_other_host: true
      end

      def generate_jwt_for_user(user)
        secret_key = ENV['DEVISE_JWT_SECRET_KEY'] || Rails.application.credentials.devise_jwt_secret_key
        payload = build_jwt_payload(user)
        "Bearer #{JWT.encode(payload, secret_key, 'HS256')}"
      end

      def build_jwt_payload(user)
        {
          sub: user.id,
          scp: 'user',
          iat: Time.current.to_i,
          exp: 7.days.from_now.to_i,
          jti: SecureRandom.uuid
        }
      end

      def build_frontend_redirect_url(success, token = nil, error_type = nil)
        Rails.logger.info '=== OAUTH DEBUG ==='

        frontend_url = determine_frontend_url

        if success && token
          build_success_redirect_url(frontend_url, token)
        else
          build_error_redirect_url(error_type, frontend_url)
        end
      rescue StandardError => e
        handle_redirect_error(e)
      end

      def determine_frontend_url
        origin = extract_origin_from_request
        log_oauth_debug_info(origin)

        if origin_allowed?(origin)
          Rails.logger.info "Using dynamic origin: #{origin}"
          origin
        else
          fallback_frontend_url = ENV['FRONTEND_URL'] || 'http://localhost:3000'
          Rails.logger.info "Using ENV FRONTEND_URL: #{fallback_frontend_url}"
          fallback_frontend_url
        end
      end

      def extract_origin_from_request
        origin = request.headers['Origin']
        return origin if origin.present?
        return nil if request.referer.blank?

        URI.parse(request.referer).then { |uri| "#{uri.scheme}://#{uri.host}" }
      end

      def log_oauth_debug_info(origin)
        Rails.logger.info "Request Origin: #{origin}"
        Rails.logger.info "Request Referer: #{request.referer}"
      end

      def origin_allowed?(origin)
        return false if origin.blank?

        allowed_patterns.any? { |pattern| origin.match?(pattern) }
      end

      def allowed_patterns
        [
          %r{\Ahttps://angori\.vercel\.app\z},
          %r{\Ahttps://angori-git-develop\.vercel\.app\z},
          %r{\Ahttps://.*-yoshihamas-projects\.vercel\.app\z},
          %r{\Ahttp://localhost:\d+\z}
        ]
      end

      def build_success_redirect_url(frontend_url, token)
        redirect_url = "#{frontend_url}/dashboard?token=#{token}"
        Rails.logger.info "Redirect: #{redirect_url}"
        redirect_url
      end

      def build_error_redirect_url(error_type, frontend_url = nil)
        frontend_url ||= ENV['FRONTEND_URL'] || 'http://localhost:3000'
        base_url = "#{frontend_url}/auth/callback"
        params = ['success=false']
        params << "error=#{error_type}" if error_type
        "#{base_url}?#{params.join('&')}"
      end

      def handle_redirect_error(error)
        Rails.logger.error "OAUTH ERROR: #{error.message}"
        Rails.logger.error error.backtrace.join("\n")
        # フォールバック
        "#{ENV['FRONTEND_URL'] || 'http://localhost:3000'}/auth/callback?success=false&error=server_error"
      end
    end
  end
end
