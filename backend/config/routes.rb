# backend/config/routes.rb
Rails.application.routes.draw do
  devise_for :users

  get 'up' => 'rails/health#show', as: :rails_health_check
  get 'service-worker' => 'rails/pwa#service_worker', as: :pwa_service_worker
  get 'manifest' => 'rails/pwa#manifest', as: :pwa_manifest

  namespace :api do
    namespace :v1 do
      devise_for :users, controllers: {
        registrations: 'api/v1/registrations',
        sessions: 'api/v1/sessions'
      }
      get '/auth/me', to: 'users#me'

      # 環境に応じたOPTIONSハンドラー
      match '*path', via: [:options], to: proc { |env|
        origin = env['HTTP_ORIGIN']

        allowed_origin = if Rails.env.development? && origin&.match?(%r{\Ahttps://.*\.vercel\.app\z})
                           origin
                         elsif Rails.env.production?
                           'https://angori.vercel.app'
                         else
                           'http://localhost:3000'
                         end

        [200, {
          'Access-Control-Allow-Origin' => allowed_origin,
          'Access-Control-Allow-Methods' => 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD',
          'Access-Control-Allow-Headers' => 'Content-Type, Authorization'
        }, ['']]
      }
    end
  end
end
