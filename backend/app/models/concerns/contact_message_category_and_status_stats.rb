module ContactMessageCategoryAndStatusStats
  def category_stats
    group(:category).count
  end

  def status_distribution
    group(:status).count
  end

  def priority_order
    order(
      Arel.sql(
        <<-SQL.squish
          CASE priority
            WHEN 'urgent' THEN 1
            WHEN 'high' THEN 2
            WHEN 'medium' THEN 3
            WHEN 'low' THEN 4
            ELSE 5
          END
        SQL
      )
    ).order(created_at: :desc)
  end
end
