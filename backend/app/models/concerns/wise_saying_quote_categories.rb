module QuoteCategories
  def motivational_quotes
    where(category: %w[motivation self_care self_acceptance])
  end

  def calming_quotes
    where(category: %w[mindfulness breathing_techniques anger_management])
  end
end
