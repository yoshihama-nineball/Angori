class Api::V1::TriggerWordsController < ApplicationController
  before_action :authenticate_user!

  def index
    trigger_words = current_user.trigger_words
    render json: {
      trigger_words: trigger_words.map do |tw|
        {
          id: tw.id,
          user_id: tw.user_id,
          name: tw.name,
          count: tw.count,
          anger_level_avg: tw.anger_level_avg.round(1),
          category: tw.category,
          last_triggered_at: tw.last_triggered_at,
          created_at: tw.created_at,
          updated_at: tw.updated_at,
          needs_attention: tw.needs_attention?,
          frequency_level: tw.frequency_level,
          anger_severity: tw.anger_severity
        }
      end
    }
  end
end