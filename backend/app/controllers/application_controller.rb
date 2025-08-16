# backend/app/controllers/application_controller.rb
class ApplicationController < ActionController::API
  include ActionController::MimeResponds

  before_action :set_cors_headers
  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
    devise_parameter_sanitizer.permit(:account_update, keys: [:name])
  end

  private

  def set_cors_headers
    # POSTリクエストでもCORSヘッダーを設定
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD'
    headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    headers['Access-Control-Allow-Credentials'] = 'true'

    # OPTIONSリクエストの場合は即座にレスポンス
    return unless request.request_method == 'OPTIONS'

    head :ok
  end
end
