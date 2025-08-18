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
                                 model: 'gpt-5-mini',
                                 messages: [
                                   {
                                     role: 'system',
                                     content: system_prompt
                                   },
                                   {
                                     role: 'user',
                                     content: prompt
                                   }
                                 ]
                                 # GPT-5では max_tokens, temperature の仕様確認が必要
                                 # 必要に応じて以下を追加:
                                 # max_tokens: 800,
                                 # temperature: 0.7
                               }.to_json)

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

    # 500文字を超える場合は適切な位置で切り取り
    if advice.length > 500
      # 句読点で区切って500文字以内に調整
      truncated = advice[0, 480] # 少し余裕を持って480文字
      last_period = [truncated.rindex('。'), truncated.rindex('！'), truncated.rindex('？')].compact.max

      advice = if last_period && last_period > 300 # 300文字以上で句読点がある場合
                 truncated[0, last_period + 1]
               else
                 "#{truncated}..."
               end
    end

    # 300文字未満の場合の警告ログ（必要に応じて）
    Rails.logger.warn "Generated advice is shorter than expected: #{advice.length} characters" if advice.length < 300

    advice
  end

  def system_prompt
    <<~PROMPT
      あなたは経験豊富なアンガーマネジメント専門のカウンセラーです。
      親しみやすいゴリラのキャラクター「Dr.ゴリ」として、以下の点を重視してアドバイスを提供してください：

      1. 口調：「〜ウホ」「〜だウホ」を使った親しみやすい口調
      2. 共感：まず相談者の気持ちを受け止める
      3. 客観視：状況を冷静に分析する視点を提供
      4. 実践的アドバイス：具体的で実行しやすい対処法
      5. 成長志向：今回の経験を成長の機会として捉える
      6. ASD/HSP特性への配慮：感覚過敏や情報処理の特性を理解した対応

      アドバイスは必ず300文字以上500文字以内で完結させてください。文章が途中で切れないよう、指定文字数内で完全な文章として仕上げてください。温かく支持的な tone で書いてください。
    PROMPT
  end

  def build_advice_prompt(anger_log)
    emotions_text = anger_log.emotions_felt&.keys&.join('、') || '未記録'

    <<~PROMPT
      以下のアンガーログについて、アンガーマネジメントのアドバイスをお願いします：

      【発生日時】#{anger_log.occurred_at.strftime('%Y年%m月%d日 %H:%M')}
      【場所】#{anger_log.location || '未記録'}
      【状況説明】#{anger_log.situation_description}
      【感じた感情】#{emotions_text}
      【怒りレベル】#{anger_log.anger_level}/10
      【トリガー】#{anger_log.trigger_words || '未記録'}

      この状況に対して、共感的で実践的なアドバイスを「アンゴリ先生」として提供してください。
    PROMPT
  end
end
