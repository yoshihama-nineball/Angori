module RequestHelpers
  # JWTトークンを抽出するヘルパー
  def extract_jwt_token(response)
    return nil unless response.headers['Authorization']

    response.headers['Authorization'].gsub('Bearer ', '')
  end

  # 認証済みリクエスト用のヘルパー
  def authenticated_headers(user)
    token = generate_jwt_token(user)
    { 'Authorization' => "Bearer #{token}" }
  end

  # JSONレスポンスをパースするヘルパー
  def json_response
    JSON.parse(response.body)
  end

  # エラーレスポンスの検証ヘルパー
  def expect_error_response(status, message = nil)
    expect(response).to have_http_status(status)
    expect(response.content_type).to eq('application/json; charset=utf-8')

    return unless message

    expect(json_response['error']).to include(message)
  end

  # 成功レスポンスの検証ヘルパー
  def expect_success_response(status = 200)
    expect(response).to have_http_status(status)
    expect(response.content_type).to eq('application/json; charset=utf-8')
  end

  # JWTトークンを生成するヘルパー（テスト用）
  def generate_jwt_token(user)
    # Deviseのjwtヘルパーを使用
    { sub: user.id }
    warden = Warden::JWTAuth::UserEncoder.new
    warden.call(user, :user, nil)[:token]
  end

  # ユーザー作成とログインのワンライナー
  def create_and_sign_in_user(attributes = {})
    user = create(:user, attributes)
    headers = authenticated_headers(user)
    [user, headers]
  end

  # APIのベースURL
  def api_base_url
    '/api/v1'
  end

  # よく使うリクエストヘッダー
  def json_headers
    {
      'Content-Type' => 'application/json',
      'Accept' => 'application/json'
    }
  end

  # 認証とJSONヘッダーを組み合わせ
  def authenticated_json_headers(user)
    json_headers.merge(authenticated_headers(user))
  end
end

# RSpecにヘルパーを含める
RSpec.configure do |config|
  config.include RequestHelpers, type: :request
end
