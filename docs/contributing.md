# コントリビューションガイド

Angoriプロジェクトへのコントリビューションを歓迎します！このガイドに従って、効率的で品質の高い開発にご協力ください。

## 🤝 コントリビューション方針

### 歓迎するコントリビューション
- 🐛 **バグ修正**: 動作不良の修正
- ✨ **新機能追加**: アンガーマネジメントに関連する機能
- 📝 **ドキュメント改善**: README、コメント、型定義等
- 🎨 **UI/UX改善**: より使いやすいインターフェース
- ⚡ **パフォーマンス改善**: 速度・効率の向上
- 🧪 **テスト追加**: テストカバレッジ向上
- 🔧 **開発環境改善**: Docker、CI/CD等の改良

### コントリビューション前の確認事項
- Issue が既に存在するか確認
- 大きな機能追加の場合は事前に Discussion で相談
- コード規約・設計方針の理解
- テストとドキュメントの更新

## 🚀 開発フロー

### 1. Issue の確認・作成

#### Issue 作成時のガイドライン
```markdown
# Bug Report テンプレート
## 現象
何が起きているか具体的に記述

## 再現手順
1. XXXXページにアクセス
2. XXXXボタンをクリック
3. XXXXが発生

## 期待する動作
本来どうあるべきか

## 環境
- OS: macOS 14.1
- Browser: Chrome 120
- Device: PC/Mobile
```

```markdown
# Feature Request テンプレート
## 概要
提案する機能の概要

## 背景・動機
なぜその機能が必要か

## 詳細仕様
具体的な実装案

## 参考資料
関連する資料・リンク
```

### 2. ブランチ戦略

#### ブランチ命名規則
```bash
# 機能追加
feature/anger-log-creation
feature/ai-consultation-ui

# バグ修正  
fix/login-form-validation
fix/bubble-chart-rendering

# ドキュメント更新
docs/contributing-guide
docs/api-documentation

# リファクタリング
refactor/auth-store-cleanup
refactor/component-structure
```

#### 開発ブランチ作成
```bash
# 最新のdevelopブランチから作成
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# 作業開始
git push -u origin feature/your-feature-name
```

### 3. 開発環境セットアップ

#### Docker環境での開発（推奨）
```bash
# 1. リポジトリをフォーク
# GitHub上でForkボタンをクリック

# 2. フォークしたリポジトリをクローン
git clone https://github.com/YOUR_USERNAME/Angori.git
cd Angori

# 3. 元リポジトリをupstream設定
git remote add upstream https://github.com/yoshihama-nineball/Angori.git

# 4. 開発環境起動
./docker/scripts/setup.sh
docker compose up -d

# 5. 動作確認
open http://localhost:3000
```

#### エディタ設定
```bash
# VS Code 拡張機能（推奨）
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension rebornix.ruby

# 設定ファイル適用
cp .vscode/settings.json.example .vscode/settings.json
```

## 📝 コード規約

### TypeScript / React 規約

#### コンポーネント作成
```typescript
// ✅ Good: 適切なコンポーネント構造
interface AngerLogFormProps {
  onSubmit: (data: AngerLogData) => void
  initialData?: AngerLogData
  isLoading?: boolean
}

export const AngerLogForm: React.FC<AngerLogFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false
}) => {
  // フック使用
  const [form, setForm] = useState<AngerLogData>(initialData || {})
  
  // ハンドラー定義
  const handleSubmit = useCallback((event: FormEvent) => {
    event.preventDefault()
    onSubmit(form)
  }, [form, onSubmit])

  return (
    <form onSubmit={handleSubmit}>
      {/* JSX */}
    </form>
  )
}
```

#### ファイル構成
```
components/
├── AngerLogForm/
│   ├── index.ts              # re-export
│   ├── AngerLogForm.tsx      # メインコンポーネント
│   ├── AngerLogForm.test.tsx # テスト
│   ├── AngerLogForm.stories.tsx # Storybook（オプション）
│   └── types.ts              # ローカル型定義
```

#### 命名規則
```typescript
// コンポーネント: PascalCase
export const UserProfile: React.FC = () => {}

// 関数・変数: camelCase  
const handleSubmit = () => {}
const isLoading = false

// 定数: SCREAMING_SNAKE_CASE
const MAX_ANGER_LEVEL = 10
const API_ENDPOINTS = {
  ANGER_LOGS: '/api/v1/anger_logs'
}

// 型: PascalCase
interface UserData {
  id: number
  name: string
}

type AngerLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
```

### Ruby / Rails 規約

#### コントローラー作成
```ruby
# ✅ Good: RESTful設計
class Api::V1::AngerLogsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_anger_log, only: [:show, :update, :destroy]

  def index
    @anger_logs = current_user.anger_logs
                              .includes(:trigger_words)
                              .order(occurred_at: :desc)
                              .page(params[:page])
    
    render json: @anger_logs, include: [:trigger_words]
  end

  def create
    @anger_log = current_user.anger_logs.build(anger_log_params)
    
    if @anger_log.save
      render json: @anger_log, status: :created
    else
      render json: { errors: @anger_log.errors }, status: :unprocessable_entity
    end
  end

  private

  def set_anger_log
    @anger_log = current_user.anger_logs.find(params[:id])
  end

  def anger_log_params
    params.require(:anger_log).permit(:anger_level, :trigger_event, :coping_method, :notes, :occurred_at)
  end
end
```

#### モデル設計
```ruby
# ✅ Good: 適切なバリデーションと関連
class AngerLog < ApplicationRecord
  belongs_to :user
  has_many :trigger_words, dependent: :destroy
  has_many :ai_advices, dependent: :destroy

  validates :anger_level, presence: true, inclusion: { in: 1..10 }
  validates :occurred_at, presence: true
  validates :trigger_event, length: { maximum: 500 }

  scope :recent, -> { where('occurred_at >= ?', 30.days.ago) }
  scope :by_anger_level, ->(level) { where(anger_level: level) }

  def anger_intensity
    case anger_level
    when 1..3 then 'low'
    when 4..6 then 'medium'  
    when 7..8 then 'high'
    when 9..10 then 'very_high'
    end
  end
end
```

## 🧪 テスト要件

### フロントエンドテスト

#### コンポーネントテスト（必須）
```typescript
// AngerLogForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AngerLogForm } from './AngerLogForm'

describe('AngerLogForm', () => {
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  it('should render form fields correctly', () => {
    render(<AngerLogForm onSubmit={mockOnSubmit} />)
    
    expect(screen.getByLabelText(/anger level/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/trigger event/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  it('should submit form with valid data', async () => {
    render(<AngerLogForm onSubmit={mockOnSubmit} />)
    
    fireEvent.change(screen.getByLabelText(/anger level/i), { target: { value: '7' } })
    fireEvent.change(screen.getByLabelText(/trigger event/i), { target: { value: 'Meeting stress' } })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        anger_level: 7,
        trigger_event: 'Meeting stress'
      })
    })
  })

  it('should show validation errors for invalid data', async () => {
    render(<AngerLogForm onSubmit={mockOnSubmit} />)
    
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/anger level is required/i)).toBeInTheDocument()
    })
  })
})
```

#### APIテスト（重要機能）
```typescript
// api/angerLogs.test.ts
import { createAngerLog, getAngerLogs } from './angerLogs'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
  rest.post('/api/v1/anger_logs', (req, res, ctx) => {
    return res(ctx.json({ id: 1, anger_level: 7 }))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('angerLogs API', () => {
  it('should create anger log successfully', async () => {
    const data = { anger_level: 7, trigger_event: 'Test' }
    const result = await createAngerLog(data)
    
    expect(result.id).toBe(1)
    expect(result.anger_level).toBe(7)
  })
})
```

### バックエンドテスト

#### モデルテスト（必須）
```ruby
# spec/models/anger_log_spec.rb
RSpec.describe AngerLog, type: :model do
  let(:user) { create(:user) }
  let(:anger_log) { build(:anger_log, user: user) }

  describe 'validations' do
    it 'is valid with valid attributes' do
      expect(anger_log).to be_valid
    end

    it 'is invalid without anger_level' do
      anger_log.anger_level = nil
      expect(anger_log).not_to be_valid
      expect(anger_log.errors[:anger_level]).to include("can't be blank")
    end

    it 'is invalid with anger_level outside range' do
      anger_log.anger_level = 11
      expect(anger_log).not_to be_valid
      expect(anger_log.errors[:anger_level]).to include('is not included in the list')
    end
  end

  describe 'associations' do
    it { should belong_to(:user) }
    it { should have_many(:trigger_words).dependent(:destroy) }
  end

  describe 'scopes' do
    let!(:old_log) { create(:anger_log, user: user, occurred_at: 40.days.ago) }
    let!(:recent_log) { create(:anger_log, user: user, occurred_at: 10.days.ago) }

    it 'returns recent logs' do
      expect(AngerLog.recent).to include(recent_log)
      expect(AngerLog.recent).not_to include(old_log)
    end
  end
end
```

#### APIテスト（必須）
```ruby
# spec/requests/api/v1/anger_logs_spec.rb
RSpec.describe 'API::V1::AngerLogs', type: :request do
  let(:user) { create(:user) }
  let(:headers) { { 'Authorization' => "Bearer #{jwt_token_for(user)}" } }

  describe 'POST /api/v1/anger_logs' do
    let(:valid_params) do
      {
        anger_log: {
          anger_level: 7,
          trigger_event: 'Meeting stress',
          coping_method: 'Deep breathing',
          occurred_at: Time.current
        }
      }
    end

    context 'with valid params' do
      it 'creates anger log successfully' do
        expect {
          post '/api/v1/anger_logs', params: valid_params, headers: headers
        }.to change(AngerLog, :count).by(1)
        
        expect(response).to have_http_status(:created)
        expect(json['anger_level']).to eq(7)
        expect(json['trigger_event']).to eq('Meeting stress')
      end
    end

    context 'with invalid params' do
      let(:invalid_params) { { anger_log: { anger_level: nil } } }

      it 'returns validation errors' do
        post '/api/v1/anger_logs', params: invalid_params, headers: headers
        
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json['errors']).to have_key('anger_level')
      end
    end
  end
end
```

## 📝 プルリクエスト手順

### 1. コード完成前チェック

#### 自動品質チェック
```bash
# フロントエンド
docker compose exec frontend yarn pre-commit

# バックエンド
docker compose exec backend bundle exec rubocop -a
docker compose exec backend bundle exec rspec
```

#### 手動確認項目
- [ ] 機能が仕様通り動作する
- [ ] テストが追加され、すべて通る
- [ ] コード品質チェック（ESLint/RuboCop）が通る
- [ ] レスポンシブ対応（スマホ・PC両方）
- [ ] アクセシビリティ確認
- [ ] 関連ドキュメント更新

### 2. プルリクエスト作成

#### PR タイトル例
```
feat: アンガーログ作成フォームの実装
fix: ログイン画面のバリデーションエラー修正  
docs: コントリビューションガイドの追加
refactor: 認証Store の構造改善
```

#### PR 説明テンプレート
```markdown
## 概要
何を実装・修正したか簡潔に説明

## 変更内容
- [ ] フロントエンド変更
- [ ] バックエンド変更  
- [ ] データベース変更
- [ ] 新機能追加
- [ ] バグ修正
- [ ] リファクタリング
- [ ] ドキュメント更新

## テスト
- [ ] 新規テストの追加
- [ ] 既存テストの更新
- [ ] 手動テスト完了

## スクリーンショット
（UI変更の場合）

## 関連Issue
Closes #123

## チェックリスト
- [ ] セルフレビュー完了
- [ ] テスト追加・更新
- [ ] ドキュメント更新
- [ ] コード品質チェック通過
```

### 3. レビュープロセス

#### レビュー観点
- **機能性**: 仕様通り動作するか
- **コード品質**: 可読性・保守性
- **パフォーマンス**: 性能への影響
- **セキュリティ**: 脆弱性の有無
- **テスト**: 適切なテストケース
- **UI/UX**: ユーザビリティ

#### レビューコメント例
```markdown
# ✅ Good
LGTM! 綺麗に実装されています。

# 💡 Suggestion  
この部分は useMemo でメモ化すると性能向上しそうです。

# ❓ Question
この条件分岐の意図を教えてください。

# 🚨 Must Fix
XSS脆弱性の可能性があります。エスケープ処理を追加してください。
```

## 🎯 貢献レベル別ガイド

### 初心者向け（Good First Issue）
```markdown
# 推奨タスク
- UI文言の修正
- 簡単なスタイル調整
- ドキュメント誤字修正
- テストケース追加

# 学習リソース
- Next.js 公式ドキュメント
- Material-UI 公式ドキュメント  
- Rails ガイド
- TypeScript Handbook
```

### 中級者向け
```markdown
# 推奨タスク
- 新しいUIコンポーネント作成
- API エンドポイント追加
- バグ修正
- パフォーマンス改善

# 注意点
- 既存コードとの整合性
- テストカバレッジ維持
- 適切なエラーハンドリング
```

### 上級者向け
```markdown
# 推奨タスク
- アーキテクチャ改善
- 複雑な機能実装
- セキュリティ強化
- 大規模リファクタリング

# 期待事項  
- 設計の提案・改善
- チーム開発のリード
- ベストプラクティス共有
```

## 🏆 認識・報酬

### コントリビューター認識
- README への Contributors 追加
- 主要機能への作者クレジット
- コミュニティ内での感謝表明

### 継続的な貢献