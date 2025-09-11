class GoogleOauthService
  def initialize(request)
    @request = request
  end

  def fetch_user_info(auth_code)
    access_token = fetch_access_token(auth_code)
    fetch_user_details(access_token)
  end

  def build_oauth_params
    backend_url = @request.base_url

    Rails.logger.info '=== OAUTH PARAMS DEBUG ==='
    Rails.logger.info "Backend URL: #{backend_url}"
    Rails.logger.info '=========================='

    {
      client_id: ENV.fetch('GOOGLE_CLIENT_ID', nil),
      redirect_uri: "#{backend_url}/users/auth/google_oauth2/callback",
      scope: 'email profile',
      response_type: 'code',
      prompt: 'select_account'
    }
  end

  private

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
      redirect_uri: "#{@request.base_url}/users/auth/google_oauth2/callback",
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
end
