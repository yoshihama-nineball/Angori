module BadgeRequirementsText
  extend ActiveSupport::Concern

  REQUIREMENTS_TEMPLATES = {
    'first_consultation' => 'AI相談を%<threshold>s回完了する',
    'consecutive_days' => '%<threshold>s日連続でログを記録する',
    'consultation_count' => 'AI相談を%<threshold>s回以上完了する',
    'detailed_emotion_logs' => '詳細な感情記録を%<threshold>s回以上行う',
    'anger_improvement' => '怒りレベルの平均値を%<threshold>s以上改善する',
    'trigger_analysis' => 'トリガーワード分析を%<threshold>s回以上完了する',
    'calming_points' => '%<threshold>sポイント以上を獲得する',
    'level_reached' => 'レベル%<threshold>sに到達する'
  }.freeze

  def requirements_text
    template = REQUIREMENTS_TEMPLATES[requirements['type']]
    return requirements.to_s unless template

    format(template, threshold: requirements['threshold'])
  end
end
