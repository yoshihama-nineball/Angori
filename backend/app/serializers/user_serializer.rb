class UserSerializer
  include JSONAPI::Serializer
  
  attributes :id, :email, :name, :created_at, :updated_at
  
  attribute :calming_point do |user|
    if user.calming_point
      {
        total_points: user.calming_point.total_points,
        current_level: user.calming_point.current_level
      }
    end
  end
end