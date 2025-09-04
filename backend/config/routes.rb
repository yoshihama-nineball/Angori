Rails.application.routes.draw do
  get 'up' => 'rails/health#show', as: :rails_health_check
  get 'service-worker' => 'rails/pwa#service_worker', as: :pwa_service_worker
  get 'manifest' => 'rails/pwa#manifest', as: :pwa_manifest

  # 直接OmniAuthのルートを追加
  get '/users/auth/google_oauth2', to: 'api/v1/omniauth_callbacks#passthru'
  get '/users/auth/google_oauth2/callback', to: 'api/v1/omniauth_callbacks#google_oauth2'

  namespace :api do
    namespace :v1 do
      devise_for :users, controllers: {
        registrations: 'api/v1/registrations',
        sessions: 'api/v1/sessions'
      }

      get '/auth/me', to: 'users#me'
      resources :anger_logs, only: %i[index show create update destroy]
      resource :calming_points, only: [:show]
      resources :wise_sayings, only: [] do
        collection do
          get :daily_wisdom
          get :recommend_for_user
        end
      end
    end
  end
end
