# backend/config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins case Rails.env
            when 'development'
              [
                'http://localhost:3000',
                'http://127.0.0.1:3000',
                %r{\Ahttps://.*\.vercel\.app\z} # 正規表現で特定パターンのみ許可
              ]
            when 'production'
              ['https://angori.vercel.app']
            else
              []
            end

    resource '*',
             headers: :any,
             methods: %i[get post put patch delete options head],
             expose: ['Authorization'],
             credentials: true # 特定オリジンのみなので安全
  end
end
