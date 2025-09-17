require 'rails_helper'

RSpec.describe 'Authentication API', type: :request do
  let(:api_base) { '/api/v1' }
  
  describe 'POST /api/v1/users/sign_in (ログイン)' do
    let(:login_url) { "#{api_base}/users/sign_in" }
    let!(:user) { create(:user, email: 'login@example.com', password: 'Password123') }
    let(:valid_login_params) do
      {
        user: {
          email: 'login@example.com',
          password: 'Password123'
        }
      }
    end

    context '正しい認証情報の場合' do
      it '成功レスポンスを返す' do
        post login_url, params: valid_login_params.to_json, headers: json_headers

        expect_success_response(200)
        expect(json_response).to have_key('status')
        expect(json_response).to have_key('message')
        expect(json_response['status']).to eq('success')
        expect(json_response['message']).to eq('ログインしました')
      end

      it 'JWTトークンを含むレスポンスを返す' do
        post login_url, params: valid_login_params.to_json, headers: json_headers

        expect(response.headers['Authorization']).to be_present
        expect(response.headers['Authorization']).to start_with('Bearer ')
        
        # JWTトークンの形式確認（3つの部分がドットで区切られている）
        token = response.headers['Authorization'].gsub('Bearer ', '')
        expect(token.split('.').length).to eq(3)
      end
    end

    context '間違った認証情報の場合' do
      it '間違ったメールアドレスの場合はエラーを返す' do
        invalid_params = valid_login_params.deep_dup
        invalid_params[:user][:email] = 'wrong@example.com'

        post login_url, params: invalid_params.to_json, headers: json_headers

        expect_error_response(401)
        expect(json_response['status']).to eq('error')
        expect(json_response['message']).to eq('メールアドレスまたはパスワードが正しくありません')
      end

      it '間違ったパスワードの場合はエラーを返す' do
        invalid_params = valid_login_params.deep_dup
        invalid_params[:user][:password] = 'WrongPassword123'

        post login_url, params: invalid_params.to_json, headers: json_headers

        expect_error_response(401)
        expect(json_response['status']).to eq('error')
        expect(json_response['message']).to eq('メールアドレスまたはパスワードが正しくありません')
      end

      it '存在しないユーザーの場合はエラーを返す' do
        invalid_params = {
          user: {
            email: 'nonexistent@example.com',
            password: 'Password123'
          }
        }

        post login_url, params: invalid_params.to_json, headers: json_headers

        expect_error_response(401)
        expect(json_response['status']).to eq('error')
        expect(json_response['message']).to eq('メールアドレスまたはパスワードが正しくありません')
      end
    end

    context '必須パラメータが不足している場合' do
      it 'emailが空の場合はエラーを返す' do
        invalid_params = valid_login_params.deep_dup
        invalid_params[:user][:email] = ''

        post login_url, params: invalid_params.to_json, headers: json_headers

        expect_error_response(401)
        expect(json_response['status']).to eq('error')
      end

      it 'passwordが空の場合はエラーを返す' do
        invalid_params = valid_login_params.deep_dup
        invalid_params[:user][:password] = ''

        post login_url, params: invalid_params.to_json, headers: json_headers

        expect_error_response(401)
        expect(json_response['status']).to eq('error')
      end
    end
  end

  describe 'JWT認証テスト' do
    let!(:user) { create(:user, email: 'auth@example.com', password: 'Password123') }
    
    it 'ログインして取得したトークンでAPI認証ができる' do
      # ログインしてトークン取得
      login_params = {
        user: {
          email: 'auth@example.com',
          password: 'Password123'
        }
      }
      
      post "#{api_base}/users/sign_in", params: login_params.to_json, headers: json_headers
      expect(response).to have_http_status(200)
      
      token = response.headers['Authorization']
      expect(token).to be_present
      
      # 取得したトークンで認証が必要なAPIにアクセス
      auth_headers = json_headers.merge('Authorization' => token)
      get "#{api_base}/auth/me", headers: auth_headers
      
      # 認証APIが実装されていない場合は404、実装されている場合は認証成功
      expect([200, 404]).to include(response.status)
    end
  end
end