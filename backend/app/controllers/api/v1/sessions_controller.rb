class Api::V1::SessionsController < Devise::SessionsController
  respond_to :json

  def create
    self.resource = warden.authenticate!(auth_options)
    
    if resource
      render json: {
        status: 'success',
        message: 'ログインしました',
        user: UserSerializer.new(resource).serializable_hash[:data][:attributes]
      }, status: :ok
    end
  end

  def destroy
    if current_user
      render json: {
        status: 'success',
        message: 'ログアウトしました'
      }, status: :ok
    else
      render json: {
        status: 'error',
        message: 'ログインしていません'
      }, status: :unauthorized
    end
  end

  private

  def auth_options
    { scope: :user, recall: "#{controller_path}#failure" }
  end

  def failure
    render json: {
      status: 'error',
      message: 'メールアドレスまたはパスワードが正しくありません'
    }, status: :unauthorized
  end
end