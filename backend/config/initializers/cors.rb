Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins '*' # シンプルに戻す

    resource '*',
             headers: :any,
             methods: %i[get post put patch delete options head],
             expose: ['Authorization'], # 追加！
             credentials: false
  end
end
