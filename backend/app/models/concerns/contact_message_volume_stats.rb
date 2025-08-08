module VolumeStats
  def monthly_volume(months = 12)
    where(created_at: months.months.ago..)
      .group_by_month(:created_at)
      .count
  end
end
