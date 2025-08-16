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
    origin = request.headers['Origin']
    
    # デバッグログを追加
    Rails.logger.info "=== CORS Debug ==="
    Rails.logger.info "Origin: #{origin}"
    Rails.logger.info "Rails.env: #{Rails.env}"
    
    if Rails.env.development? && origin&.match?(%r{\Ahttps://.*\.vercel\.app\z})
      headers['Access-Control-Allow-Origin'] = origin
      Rails.logger.info "Allowing dynamic origin: #{origin}"
    elsif Rails.env.production?
      headers['Access-Control-Allow-Origin'] = 'https://angori.vercel.app'
    else
      headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    end
    
    headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD'
    headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    
    if request.request_method == 'OPTIONS'
      Rails.logger.info "Handling OPTIONS request"
      head :ok
    end
  end
end