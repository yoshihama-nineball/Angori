# backend/config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins case Rails.env
            when 'development'
              if ENV['CORS_ALLOW_ALL'] == 'true'
                '*'
              else
                [
                  'http://localhost:3000',
                  'http://127.0.0.1:3000',
                  %r{\Ahttps://.*\.vercel\.app\z}
                ]
              end
            when 'production'
              ['https://angori.vercel.app'] # 本番環境は厳格に管理
            else
              []
            end

    resource '*',
             headers: :any,
             methods: %i[get post put patch delete options head],
             expose: ['Authorization'],
             credentials: true
  end
end
