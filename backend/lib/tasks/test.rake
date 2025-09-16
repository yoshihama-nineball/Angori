namespace :test do
  desc 'カバレッジ付きでRSpecを実行'
  task coverage: :environment do
    ENV['COVERAGE'] = 'true'
    Rake::Task['spec'].invoke
  end

  desc 'Userモデルのテストのみ実行'
  task user: :environment do
    system('bundle exec rspec spec/models/user_spec.rb --format documentation')
  end
end
