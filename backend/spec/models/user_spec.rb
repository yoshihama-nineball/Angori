require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'validations' do
    it 'is valid with valid attributes' do
      user = described_class.new(name: 'Test User', email: 'test@example.com', password: 'password123')
      expect(user).to be_valid
    end

    it 'is not valid without a name' do
      user = described_class.new(email: 'test@example.com', password: 'password123')
      expect(user).not_to be_valid
    end

    it 'is not valid without an email' do
      user = described_class.new(name: 'Test User', password: 'password123')
      expect(user).not_to be_valid
    end
  end
end
