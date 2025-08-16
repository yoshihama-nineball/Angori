# backend/config/routes.rb
Rails.application.routes.draw do
  devise_for :users

  get 'up' => 'rails/health#show', as: :rails_health_check
  get 'service-worker' => 'rails/pwa#service_worker', as: :pwa_service_worker
  get 'manifest' => 'rails/pwa#manifest', as: :pwa_manifest

  namespace :api do
    namespace :v1 do
      devise_for :users,
                 controllers: {
                   registrations: 'api/v1/registrations',
                   sessions: 'api/v1/sessions'
                 }
      get '/auth/me', to: 'users#me'

      # OPTIONSルートを復活させる
      match '*path', via: [:options], to: proc {
        [200, {
          'Access-Control-Allow-Origin' => '*',
          'Access-Control-Allow-Methods' => 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD',
          'Access-Control-Allow-Headers' => 'Content-Type, Authorization'
        }, ['']]
      }
    end
  end
end
