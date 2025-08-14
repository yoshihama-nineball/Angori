FactoryBot.define do
  factory :jwt_denylist do
    jti { 'MyString' }
    exp { '2025-08-13 07:09:04' }
  end
end
