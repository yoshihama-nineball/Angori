class OpenaiService
  include HTTParty

  base_uri 'https://api.openai.com/v1'

  def initialize
    @api_key = ENV.fetch('OPENAI_API_KEY', nil)
    raise 'OpenAI API key not found' if @api_key.blank?
  end

  def generate_anger_advice(anger_log)
    prompt = build_advice_prompt(anger_log)

    response = self.class.post('/chat/completions',
                               headers: {
                                 'Authorization' => "Bearer #{@api_key}",
                                 'Content-Type' => 'application/json'
                               },
                               body: {
                                 model: 'gpt-4o-mini', # gpt-5-mini → gpt-4o-mini に変更
                                 messages: [
                                   {
                                     role: 'system',
                                     content: system_prompt
                                   },
                                   {
                                     role: 'user',
                                     content: prompt
                                   }
                                 ],
                                 max_tokens: 600, # 追加：トークン数制限
                                 temperature: 0.7 # 追加：創造性を少し下げて高速化
                               }.to_json,
                               timeout: 15)

    if response.success?
      advice = response.dig('choices', 0, 'message', 'content')&.strip
      # 文字数チェックと調整
      format_advice(advice)
    else
      Rails.logger.error "OpenAI API error: #{response.body}"
      'AIアドバイスの生成に失敗しました。しばらく時間をおいて再度お試しください。'
    end
  end

  private

  def format_advice(advice)
    return '申し訳ありません。アドバイスの生成に失敗しました。' if advice.blank?

    advice = truncate_advice_if_needed(advice)
    advice = normalize_line_breaks(advice)
    log_short_advice_warning(advice)
    advice
  end

  def truncate_advice_if_needed(advice)
    return advice if advice.length <= 500

    truncated = advice[0, 480]
    last_period = find_last_punctuation(truncated)

    if last_period && last_period > 300
      truncated[0, last_period + 1]
    else
      "#{truncated}..."
    end
  end

  def find_last_punctuation(text)
    [text.rindex('。'), text.rindex('！'), text.rindex('？')].compact.max
  end

  def normalize_line_breaks(advice)
    advice.gsub(/\n\n+/, "\n\n")
  end

  def log_short_advice_warning(advice)
    return unless advice.length < 300

    Rails.logger.warn "Generated advice is shorter than expected: #{advice.length} characters"
  end

  def system_prompt
    <<~PROMPT
      あなたは経験豊富なアンガーマネジメント専門のカウンセラーです。
      親しみやすいゴリラのキャラクターとして、相談者にあたたかいアドバイスを提供してください。

      【構成と改行ルール】
      1. 共感：まず相談者の気持ちを受け止め、理解を示す（1-2文で改行）
      2. アドバイス：状況を整理し、実行しやすい具体的な対処法を提案する
         - 即座にできることを1段落（2-3文で改行）
         - 今後の対策を別の段落（2-3文で改行）#{'  '}
      3. ねぎらい：最後に相談者を労い、安心できる言葉を添える（1-2文）

      各段落の間には必ず空行を入れ、1つの段落は2-3文以内にまとめてください。
      長い文章は避け、読みやすい短い段落構成にしてください。

      【スタイル】
      - トーンは親しみやすく温かいものにする
      - 「〜ウホ」は時々使う程度に留め、くどくならないようにする
      - 励ましや前向きな提案の際は「！」を使って温かみと親しみやすさを表現する
      - 成長志向を持ち、今回の出来事を学びや成長の機会と捉えられるように促す

      【条件】
      - アドバイス文は必ず250-300文字程度の範囲で完結させる
      - 1段落は2-3文以内、長くても4文まで
      - 途中で文章が途切れず、最後まで自然に読み切れるようにする
    PROMPT
  end

  def build_advice_prompt(anger_log)
    emotions_text = anger_log.emotions_felt&.keys&.join('、') || '未記録'

    <<~PROMPT
      以下のアンガーログについて、アンガーマネジメントのアドバイスをお願いします：

      【発生日時】#{anger_log.occurred_at.strftime('%Y年%m月%d日 %H:%M')}
      【場所】#{anger_log.location || '未記録'}
      【状況説明】#{anger_log.situation_description}
      【今回の出来事に対する捉え方・認知】#{anger_log.perception || '未記録'}
      【感じた感情】#{emotions_text}
      【怒りレベル】#{anger_log.anger_level}/10
      【トリガー】#{anger_log.trigger_words || '未記録'}

      この状況に対して、共感的で実践的なアドバイスを提供してください。
    PROMPT
  end
end
