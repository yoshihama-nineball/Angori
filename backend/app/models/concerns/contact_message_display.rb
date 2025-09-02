module ContactMessageDisplay
  extend ActiveSupport::Concern

  STATUS_COLORS = {
    'pending' => 'yellow',
    'in_progress' => 'blue',
    'resolved' => 'green',
    'closed' => 'gray'
  }.freeze

  STATUS_NAMES = {
    'pending' => '未対応',
    'in_progress' => '対応中',
    'resolved' => '解決済み',
    'closed' => '終了'
  }.freeze

  CATEGORY_EMOJIS = {
    'general' => '💬',
    'bug_report' => '🐛',
    'feature_request' => '✨',
    'support' => '🆘',
    'feedback' => '📝'
  }.freeze

  CATEGORY_NAMES = {
    'general' => '一般的な質問',
    'bug_report' => 'バグ報告',
    'feature_request' => '機能要望',
    'support' => 'サポート',
    'feedback' => 'フィードバック'
  }.freeze

  def status_color
    STATUS_COLORS[status] || 'gray'
  end

  def status_name
    STATUS_NAMES[status] || status
  end

  def category_emoji
    CATEGORY_EMOJIS[category] || '📧'
  end

  def category_name
    CATEGORY_NAMES[category] || category
  end

  def display_title
    "#{category_emoji} #{subject}"
  end

  def priority_label
    case priority
    when 'low' then '低'
    when 'medium' then '中'
    when 'high' then '高'
    when 'urgent' then '緊急'
    else priority
    end
  end
end
