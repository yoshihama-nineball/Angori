Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins do |source, _env|
      Rails.logger.info '=== CORS Origins Check ==='
      Rails.logger.info "Source: #{source}"
      Rails.logger.info "Rails.env: #{Rails.env}"

      if Rails.env.development? && source&.match?(%r{\Ahttps://.*\.vercel\.app\z})
        Rails.logger.info "Allowing Vercel domain: #{source}"
        true
      elsif Rails.env.production? && source == 'https://angori.vercel.app'
        Rails.logger.info "Allowing production domain: #{source}"
        true
      elsif source == 'http://localhost:3000'
        Rails.logger.info "Allowing localhost: #{source}"
        true
      else
        Rails.logger.info "Rejecting domain: #{source}"
        false
      end
    end

    resource '*',
             headers: :any,
             methods: %i[get post put patch delete options head],
             expose: ['Authorization'],
             credentials: true
  end
end
