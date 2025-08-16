Rails.application.config.middleware.insert_before 0, Rack::Cors, debug: true do
  allow do
    origins '*'
    resource '*',
             headers: :any,
             methods: [:get, :post, :put, :patch, :delete, :options, :head],
             expose: ['Authorization'],
             credentials: true,
             max_age: 7200
  end
end