class ApplicationController < ActionController::API
  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def authenticate_user!
    token = request.headers['Authorization']&.sub(/^Bearer /, '')
    return render json: { error: 'Unauthorized' }, status: :unauthorized unless token

    begin
      decoded_token = JWT.decode(token, jwt_secret_key, true, { algorithm: 'HS256' })
      user_id = decoded_token[0]['sub']
      @current_user = User.find(user_id)
    rescue JWT::DecodeError, ActiveRecord::RecordNotFound
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end

  attr_reader :current_user

  private

  def jwt_secret_key
    ENV['DEVISE_JWT_SECRET_KEY'] || Rails.application.credentials.devise_jwt_secret_key
  end

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: %i[name email password password_confirmation])
    devise_parameter_sanitizer.permit(:sign_in, keys: %i[email password])
  end
end
protect_from_forgery with: :null_session
