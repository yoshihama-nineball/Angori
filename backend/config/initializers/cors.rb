# backend/config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins case Rails.env
            when 'development'
              [
                'http://localhost:3000',
                'http://127.0.0.1:3000',
                %r{https://angori-.*\.vercel\.app$}
              ]
            when 'production'
              ['https://angori.vercel.app']
            else
              []
            end

    resource '/api/*',
             headers: :any,
             methods: %i[get post put patch delete options head],
             expose: ['Authorization'],
             credentials: true
  end

  allow do
    origins '*'
    resource '/api/*',
             headers: :any,
             methods: [:options],
             credentials: false
  end
end
