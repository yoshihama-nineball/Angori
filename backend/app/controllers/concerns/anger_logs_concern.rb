module AngerLogsConcern
  extend ActiveSupport::Concern

  private

  def search_params
    params.permit(:search)
  end

  def fetch_paginated_anger_logs(search_keyword = nil)
    anger_logs = current_user.anger_logs
                             .search_by_keyword(search_keyword)
                             .recent
                             .includes(:user)
    anger_logs.page(params[:page]).per(params[:per_page] || 20)
  end

  def set_anger_log
    @anger_log = current_user.anger_logs.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Anger log not found' }, status: :not_found
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

  # 一時的に詳細化
  def create_params_valid?
    anger_log_data = params[:anger_log]
    Rails.logger.info "Validation check - received data: #{anger_log_data.inspect}"

    # 最低限の必須チェックのみ
    required_check = anger_log_data.present? &&
                     anger_log_data[:occurred_at].present? &&
                     anger_log_data[:situation_description].present? &&
                     anger_log_data[:anger_level].present?

    Rails.logger.info "Basic validation result: #{required_check}"
    required_check
  end

  def valid_field_value?(field, value)
    case field
    when :anger_level
      result = valid_anger_level?(value)
      Rails.logger.info "  Anger level validation: #{value} -> #{result}"
      result
    when :emotions_felt
      # emotions_feltの詳細チェック
      Rails.logger.info "  Emotions felt type: #{value.class}"
      Rails.logger.info "  Emotions felt content: #{value.inspect}"
      # HashやActionController::Parametersであれば有効とする
      result = value.respond_to?(:keys) || value.is_a?(Hash)
      Rails.logger.info "  Emotions felt validation: #{result}"
      result
    else
      true
    end
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
