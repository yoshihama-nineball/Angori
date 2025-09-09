module Api
  module V1
    class TriggerWordsController < ApplicationController
      before_action :authenticate_user!

      def index
        trigger_words = current_user.trigger_words
        render json: { trigger_words: serialize_trigger_words(trigger_words) }
      end

      private

      def serialize_trigger_words(trigger_words)
        trigger_words.map do |tw|
          serialize_trigger_word(tw)
        end
      end

      def serialize_trigger_word(trigger_word)
        {
          id: trigger_word.id,
          user_id: trigger_word.user_id,
          name: trigger_word.name,
          count: trigger_word.count,
          anger_level_avg: trigger_word.anger_level_avg.round(1),
          category: trigger_word.category,
          last_triggered_at: trigger_word.last_triggered_at,
          created_at: trigger_word.created_at,
          updated_at: trigger_word.updated_at,
          needs_attention: trigger_word.needs_attention?,
          frequency_level: trigger_word.frequency_level,
          anger_severity: trigger_word.anger_severity
        }
      end
    end
  end
end
