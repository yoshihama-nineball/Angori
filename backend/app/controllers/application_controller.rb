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
    headers['Access-Control-Allow-Origin'] = allowed_origin
    headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD'
    headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'

    head :ok if request.request_method == 'OPTIONS'
  end

  def allowed_origin
    origin = request.headers['Origin']

    return origin if development_vercel_domain?(origin)
    return 'https://angori.vercel.app' if Rails.env.production?

    'http://localhost:3000'
  end

  def development_vercel_domain?(origin)
    Rails.env.development? && origin&.match?(%r{\Ahttps://.*\.vercel\.app\z})
  end
end
