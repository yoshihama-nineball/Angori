Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins '*'  # 一時的に全許可
    
    resource '*',
             headers: :any,
             methods: %i[get post put patch delete options head],
             credentials: false  # 重要：credentialsはfalse
  end
end