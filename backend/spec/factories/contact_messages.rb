FactoryBot.define do
  factory :contact_message do
    email { 'user@example.com' }
    name { 'テストユーザー' }
    subject { 'テスト件名' }
    message { 'これはテストメッセージです。' }
    category { 'general_inquiry' }
    status { 'pending' }
    admin_reply { nil }
    replied_at { nil }
    user { nil }
  end
end
