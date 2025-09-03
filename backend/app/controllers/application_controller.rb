class ApplicationController < ActionController::API
  # OmniAuth用にCSRF保護を条件付きで無効化
  protect_from_forgery with: :null_session, if: -> { request.format.json? }
  
  before_action :authenticate_user!, unless: :devise_controller?
  before_action :configure_permitted_parameters, if: :devise_controller?

  private

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: %i[email password password_confirmation])
    devise_parameter_sanitizer.permit(:sign_in, keys: %i[email password])
  end
end