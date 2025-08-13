class Api::V1::RegistrationsController < Devise::RegistrationsController
  respond_to :json
  
  def create
    build_resource(sign_up_params)
    
    if resource.save
      render json: {
        status: 'success',
        message: 'ユーザー登録が完了しました',
        user: {
          id: resource.id,
          email: resource.email,
          name: resource.name,
          created_at: resource.created_at
        }
      }, status: :created
    else
      render json: {
        status: 'error',
        message: '登録に失敗しました',
        errors: resource.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  private

  def sign_up_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end
end