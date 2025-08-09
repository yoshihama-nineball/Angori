require 'rails_helper'

RSpec.describe ContactMessage, type: :model do
  describe 'バリデーション' do
    it '有効な属性を持つ場合は有効であること' do
      expect(build(:contact_message)).to be_valid
    end

    it 'emailが空の場合は無効であること' do
      msg = build(:contact_message, email: nil)
      expect(msg).not_to be_valid
    end

    it 'emailの形式が不正な場合は無効であること' do
      msg = build(:contact_message, email: 'invalid_email')
      expect(msg).not_to be_valid
    end

    it 'nameが空の場合は無効であること' do
      msg = build(:contact_message, name: nil)
      expect(msg).not_to be_valid
    end

    it 'subjectが空の場合は無効であること' do
      msg = build(:contact_message, subject: nil)
      expect(msg).not_to be_valid
    end

    it 'messageが空の場合は無効であること' do
      msg = build(:contact_message, message: nil)
      expect(msg).not_to be_valid
    end

    it 'categoryが無効な値の場合は無効であること' do
      msg = build(:contact_message, category: 'invalid')
      expect(msg).not_to be_valid
    end

    it 'statusが無効な値の場合は無効であること' do
      msg = build(:contact_message, status: 'invalid')
      expect(msg).not_to be_valid
    end

    it 'admin_replyが3000文字を超える場合は無効であること' do
      msg = build(:contact_message, admin_reply: 'あ' * 3001)
      expect(msg).not_to be_valid
    end
  end

  describe 'スコープ' do
    let(:pending_msg) { create(:contact_message, status: 'pending') }
    let(:resolved_msg) { create(:contact_message, status: 'resolved') }

    it 'pendingスコープにpendingメッセージが含まれること' do
      pending_msg
      resolved_msg
      expect(described_class.pending).to include(pending_msg)
    end

    it 'pendingスコープにresolvedメッセージが含まれないこと' do
      pending_msg
      resolved_msg
      expect(described_class.pending).not_to include(resolved_msg)
    end

    it 'resolvedスコープにresolvedメッセージが含まれること' do
      pending_msg
      resolved_msg
      expect(described_class.resolved).to include(resolved_msg)
    end

    it 'resolvedスコープにpendingメッセージが含まれないこと' do
      pending_msg
      resolved_msg
      expect(described_class.resolved).not_to include(pending_msg)
    end
  end

  describe 'インスタンスメソッド' do
    let(:msg) { build(:contact_message, status: 'pending', category: 'bug_report') }

    it '#status_colorが正しい色を返すこと' do
      expect(msg.status_color).to eq('yellow')
    end

    it '#status_emojiが正しい絵文字を返すこと' do
      expect(msg.status_emoji).to eq('⏳')
    end

    it '#category_nameが日本語名を返すこと' do
      expect(msg.category_name).to eq('バグ報告')
    end

    it '#category_emojiが絵文字を返すこと' do
      expect(msg.category_emoji).to eq('🐛')
    end

    it '#display_categoryが絵文字＋日本語名を返すこと' do
      expect(msg.display_category).to eq('🐛 バグ報告')
    end

    it '#from_registered_user?で未登録ユーザーはfalseを返すこと' do
      expect(msg).not_to be_from_registered_user
    end

    it '#from_registered_user?で登録済みユーザーはtrueを返すこと' do
      msg.user = build(:user)
      expect(msg).to be_from_registered_user
    end
  end

  describe 'クラスメソッド' do
    it '.priority_orderで優先度順に並ぶこと' do
      expect { described_class.priority_order.to_sql }.not_to raise_error
    end

    it '.need_attentionで24時間以上前の未解決メッセージを取得できること' do
      old_msg = create(:contact_message, status: 'pending', created_at: 2.days.ago)
      expect(described_class.need_attention).to include(old_msg)
    end

    it '.response_time_statsが統計を返すこと' do
      create(:contact_message, admin_reply: '返信済み', replied_at: 2.hours.ago)
      stats = described_class.response_time_stats
      expect(stats).to include(:average, :median, :min, :max)
    end

    it '.category_statsがカテゴリ別件数を返すこと' do
      create(:contact_message, category: 'bug_report', status: 'pending')
      expect(described_class.category_stats).to include(%w[bug_report pending] => 1)
    end
  end
end
