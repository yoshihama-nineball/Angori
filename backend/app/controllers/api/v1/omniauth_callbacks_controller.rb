module Api
  module V1
    class OmniauthCallbacksController < ApplicationController
      def passthru
        redirect_to "https://accounts.google.com/o/oauth2/auth?#{google_oauth_params.to_query}",
                    allow_other_host: true
      end

      def google_oauth2
        auth_code = params[:code]
        raise 'Authorization code not found' unless auth_code

        user_info = fetch_google_user_info(auth_code)
        user = User.from_google_info(user_info)

        handle_user_authentication(user)
      rescue StandardError => e
        handle_oauth_error(e)
      end

      def failure
        Rails.logger.error "OAuth failure: #{params[:message]}"
        redirect_to build_frontend_redirect_url(false, nil, 'oauth_failed')
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
          redirect_to build_frontend_redirect_url(true, token)
        else
          Rails.logger.error "Failed to generate JWT token for user #{user.id}"
          redirect_to build_frontend_redirect_url(false, nil, 'token_generation_failed')
        end
      end

      def handle_user_creation_failure(user)
        Rails.logger.error "OAuth user creation failed: #{user.errors.full_messages}"
        redirect_to build_frontend_redirect_url(false, nil, 'user_creation_failed')
      end

      def handle_oauth_error(error)
        Rails.logger.error "OAuth error: #{error.message}"
        redirect_to build_frontend_redirect_url(false, nil, 'server_error')
      end

      def fetch_google_user_info(auth_code)
        access_token = fetch_access_token(auth_code)
        fetch_user_details(access_token)
      end

      def fetch_access_token(auth_code)
        response = request_access_token(auth_code)
        validate_token_response(response)

        token_data = parse_json_response(response.body, 'token response')
        extract_access_token(token_data)
      end

      def request_access_token(auth_code)
        require 'net/http'

        token_uri = URI('https://oauth2.googleapis.com/token')
        token_params = build_token_params(auth_code)

        Net::HTTP.post_form(token_uri, token_params)
      end

      def build_token_params(auth_code)
        {
          code: auth_code,
          client_id: ENV.fetch('GOOGLE_CLIENT_ID', nil),
          client_secret: ENV.fetch('GOOGLE_CLIENT_SECRET', nil),
          redirect_uri: "#{request.base_url}/users/auth/google_oauth2/callback",
          grant_type: 'authorization_code'
        }
      end

      def validate_token_response(response)
        return if response.code == '200'

        Rails.logger.error "Token request failed: Status #{response.code}, Body: #{response.body}"
        raise "Token request failed with status #{response.code}"
      end

      def extract_access_token(token_data)
        access_token = token_data['access_token']

        if access_token.nil?
          Rails.logger.error "No access token in response: #{token_data}"
          raise 'No access token received from Google'
        end

        access_token
      end

      def fetch_user_details(access_token)
        require 'net/http'

        user_uri = URI("https://www.googleapis.com/oauth2/v2/userinfo?access_token=#{access_token}")
        user_response = Net::HTTP.get_response(user_uri)

        validate_user_response(user_response)
        parse_json_response(user_response.body, 'user info response')
      end

      def validate_user_response(response)
        return if response.code == '200'

        Rails.logger.error "User info request failed: Status #{response.code}"
        raise 'Failed to fetch user info from Google'
      end

      def parse_json_response(body, context)
        require 'json'

        JSON.parse(body)
      rescue JSON::ParserError
        Rails.logger.error "Invalid JSON #{context}: #{body[0..200]}"
        raise "Invalid #{context} format from Google"
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
        # 詳細なデバッグログ
        Rails.logger.info '=== OAUTH REDIRECT DEBUG ==='
        Rails.logger.info "Rails.env: #{Rails.env}"
        Rails.logger.info "ENV['FRONTEND_URL']: #{ENV['FRONTEND_URL'].inspect}"
        Rails.logger.info "ENV['RAILS_ENV']: #{ENV['RAILS_ENV'].inspect}"
        Rails.logger.info "request.base_url: #{request.base_url}"
        Rails.logger.info "request.referer: #{request.referer}"
        Rails.logger.info "request.headers['Origin']: #{request.headers['Origin']}"

        frontend_url = ENV['FRONTEND_URL'] || 'http://localhost:3000'
        Rails.logger.info "Final frontend_url: #{frontend_url}"

        if success && token
          redirect_url = "#{frontend_url}/dashboard?token=#{token}"
          Rails.logger.info "SUCCESS: Redirecting to: #{redirect_url}"
          Rails.logger.info '================================'
          redirect_url
        else
          error_url = build_error_redirect_url(error_type)
          Rails.logger.info "ERROR: Redirecting to: #{error_url}"
          Rails.logger.info '================================'
          error_url
        end
      end

      def build_error_redirect_url(error_type)
        frontend_url = ENV['FRONTEND_URL'] || 'http://localhost:3000'
        base_url = "#{frontend_url}/auth/callback"
        params = ['success=false']
        params << "error=#{error_type}" if error_type
        "#{base_url}?#{params.join('&')}"
      end

      def google_oauth_params
        {
          client_id: ENV.fetch('GOOGLE_CLIENT_ID', nil),
          redirect_uri: "#{request.base_url}/users/auth/google_oauth2/callback",
          scope: 'email profile',
          response_type: 'code',
          prompt: 'select_account'
        }
      end
    end
  end
end
