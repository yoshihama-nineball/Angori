module AngerLogsConcern
  extend ActiveSupport::Concern

  private

  def set_anger_log
    @anger_log = current_user.anger_logs.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Anger log not found' }, status: :not_found
  end

  def fetch_paginated_anger_logs
    anger_logs = current_user.anger_logs.recent.includes(:user)
    anger_logs.page(params[:page]).per(params[:per_page] || 20)
  end

  def anger_logs_index_response
    {
      anger_logs: @anger_logs.map { |log| anger_log_json(log) },
      pagination: pagination_info
    }
  end

  def pagination_info
    {
      total: @anger_logs.total_count,
      page: @anger_logs.current_page,
      per_page: @anger_logs.limit_value,
      total_pages: @anger_logs.total_pages
    }
  end

  def build_anger_log_with_ai_advice
    anger_log = current_user.anger_logs.build(anger_log_params)
    anger_log.ai_advice = generate_ai_advice(anger_log)
    anger_log
  end

  def anger_log_params
    params.require(:anger_log).permit(
      :occurred_at, :location, :situation_description,
      :trigger_words, :anger_level, :perception,
      emotions_felt: {}
    )
  end

  def update_anger_log_params
    params.require(:anger_log).permit(
      :occurred_at, :location, :situation_description,
      :trigger_words, :anger_level, :perception, :reflection,
      emotions_felt: {}
    )
  end

  def create_params_valid?
    required_fields = %i[occurred_at situation_description anger_level]
    anger_log_data = params[:anger_log]

    return false if anger_log_data.blank?

    required_fields.all? do |field|
      value = anger_log_data[field]
      value.present? && valid_field_value?(field, value)
    end
  end

  def valid_field_value?(field, value)
    return valid_anger_level?(value) if field == :anger_level

    true
  end

  def valid_anger_level?(level)
    level.to_i.between?(1, 10)
  end

  def anger_log_json(anger_log)
    {
      id: anger_log.id,
      occurred_at: format_datetime(anger_log.occurred_at),
      location: anger_log.location,
      situation_description: anger_log.situation_description,
      trigger_words: anger_log.trigger_words,
      emotions_felt: anger_log.emotions_felt || {},
      anger_level: anger_log.anger_level,
      perception: anger_log.perception,
      ai_advice: anger_log.ai_advice,
      reflection: anger_log.reflection,
      created_at: format_datetime(anger_log.created_at),
      updated_at: format_datetime(anger_log.updated_at)
    }
  end

  def format_datetime(datetime)
    datetime&.iso8601
  end

  def generate_ai_advice(anger_log)
    OpenaiService.new.generate_anger_advice(anger_log)
  rescue StandardError => e
    Rails.logger.error "AI advice generation failed: #{e.message}"
    default_ai_advice
  end

  def default_ai_advice
    '申し訳ありません。現在AIアドバイスを生成できません。後ほど再度お試しください。'
  end

  def render_validation_error
    render json: {
      error: 'Invalid parameters',
      required_fields: %w[occurred_at situation_description anger_level]
    }, status: :bad_request
  end

  def render_creation_error
    render json: {
      error: 'Failed to create anger log',
      details: @anger_log.errors.full_messages
    }, status: :unprocessable_entity
  end

  def render_update_error
    render json: {
      error: 'Failed to update anger log',
      details: @anger_log.errors.full_messages
    }, status: :unprocessable_entity
  end

  def handle_server_error(error, context)
    Rails.logger.error "#{context}: #{error.message}"
    render json: {
      error: 'Internal server error',
      message: error.message
    }, status: :internal_server_error
  end
end
