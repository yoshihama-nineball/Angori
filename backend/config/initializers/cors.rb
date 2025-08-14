# backend/config/initializers/cors.rb (Step 2 - 本番レベル)
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # 環境に応じた設定
    origins case Rails.env
            when 'development'
              ['http://localhost:3000', 'http://127.0.0.1:3000']
            when 'production'
              ['https://angori.vercel.app'] # 本番ドメイン
            else
              []
            end

    resource '/api/*',
             headers: :any,
             methods: %i[get post put patch delete options head],
             expose: ['Authorization'],
             credentials: true
  end

  # プリフライトリクエスト用
  allow do
    origins '*'
    resource '/api/*',
             headers: :any,
             methods: [:options],
             credentials: false
  end
end
