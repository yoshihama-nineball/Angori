module ContactMessageStats
  extend ActiveSupport::Concern

  included do
    # extend ResponseTimeStats
    # extend CategoryAndStatusStats
    # extend VolumeStats
  end
end
