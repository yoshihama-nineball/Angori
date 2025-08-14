# 技術仕様書

## テスト戦略
### カバレッジ目標
- モデルスペック: 80-90%
- システムスペック: 60-70%  
- フロントエンド: 60-70%

### テスト優先度
#### 高優先度（90%目標）
- User、AngerLog、AiAdviceモデル
- ログイン→相談→保存フロー

#### 中優先度（60-70%目標）
- 管理画面、設定画面
- カレンダーコンポーネント

## API設計方針
- RESTful API
- JSON形式
- エラーハンドリング統一

## コーディング規約

### フロントエンド（Next.js/TypeScript）

#### ESLint設定
**基本設定**
- Next.js標準規約 + TypeScript + Prettier統合
- React v19, Next.js v15対応

**主要ルール**
```javascript
// TypeScript関連
- 未使用変数：エラー（アンダースコアプレフィックスは許可）
- any型：警告レベル
- 明示的な型注釈：オフ（型推論活用）

// React関連  
- prop-types：オフ（TypeScript使用のため）
- React import：オフ（新しいJSX Transform使用）
- displayName：警告レベル

// Next.js関連
- img要素：エラー（next/imageを使用）
- htmlリンク：エラー（next/linkを使用）

// 一般的なコード品質
- const推奨：エラー
- var禁止：エラー
- console.log：警告
- debugger：エラー

// Angori固有ルール
- MUIインポート：@mui/material/ComponentName形式を強制
```

**コマンド**
```bash
yarn lint          # リント実行
yarn lint:fix      # 自動修正
yarn format        # Prettier実行
yarn fix           # lint:fix + format
yarn check         # 全チェック実行
yarn pre-commit    # コミット前実行
```

#### Prettier設定
```javascript
{
  "semi": false,              // セミコロン無し
  "trailingComma": "es5",     // ES5形式のトレイリングコンマ
  "singleQuote": true,        // シングルクォート使用
  "tabWidth": 2,              // インデント2スペース
  "printWidth": 80            // 1行80文字制限
}
```

#### Git Hook設定
**Husky + lint-staged**
- **コミット前**: 自動フォーマット + 型チェック実行
- **対象ファイル**: .js, .jsx, .ts, .tsx, .json, .md, .yml

### バックエンド（Rails）

#### RuboCop設定
**基本設定**
- Ruby 3.2.3対応
- Rails標準規約 + RSpec規約
- 新しいCop自動有効化

**主要ルール**
```ruby
# レイアウト
- 1行最大文字数：120文字
- インデント：2スペース

# メトリクス
- メソッド長：15行以内
- ブロック長：routes/spec/initializersは除外

# スタイル
- ドキュメントコメント：無効
- FrozenStringLiteral：無効

# 除外ファイル
- db/schema.rb, db/migrate/*
- config/environments/*
- bin/*, vendor/**/*
```

**実行コマンド**
```bash
bundle exec rubocop           # 実行
bundle exec rubocop -a        # 自動修正
bundle exec rubocop --only    # 特定ルールのみ
```

### コメント記述ルール

#### TypeScript/React
```typescript
/**
 * ユーザーの怒りログを管理するコンポーネント
 * @param userId - 対象ユーザーのID
 * @param onSave - 保存完了時のコールバック
 */
export function AngerLogForm({ userId, onSave }: Props) {
  // NOTE: バリデーション処理はZodを使用
  const schema = z.object({
    angerLevel: z.number().min(1).max(10),
  })
  
  // TODO: AI相談機能との連携を追加 (#123)
  // FIXME: 日時フォーマットの統一が必要
}
```

#### Rails/Ruby
```ruby
# ユーザーの怒りログを管理するモデル
# 
# @attr [Integer] anger_level 怒りレベル（1-10）
# @attr [DateTime] occurred_at 発生日時
# @attr [String] situation 状況説明
class AngerLog < ApplicationRecord
  belongs_to :user
  
  validates :anger_level, presence: true, inclusion: { in: 1..10 }
  
  # 週間平均の怒りレベルを計算
  # @param [Date] start_date 開始日
  # @return [Float] 平均値
  def weekly_average(start_date = 1.week.ago)
    # NOTE: descriptive_statisticsを使用
    logs = where(occurred_at: start_date..Date.current)
    logs.pluck(:anger_level).mean
  end
  
  private
  
  # TODO: トリガー分析機能を追加
  # FIXME: タイムゾーン処理の統一
end
```

### テストコード規約

#### フロントエンド（Jest + Testing Library）
```typescript
describe('AngerLogForm', () => {
  it('怒りレベルが正常に入力できる', async () => {
    const mockOnSave = jest.fn()
    render(<AngerLogForm onSave={mockOnSave} />)
    
    // Given: 怒りレベル入力フィールドがある
    const levelInput = screen.getByLabelText('怒りレベル')
    
    // When: レベル5を入力
    await user.type(levelInput, '5')
    
    // Then: 値が正しく設定される
    expect(levelInput).toHaveValue(5)
  })
})
```

#### バックエンド（RSpec）
```ruby
RSpec.describe AngerLog, type: :model do
  describe 'バリデーション' do
    it '怒りレベルは1-10の範囲で必須' do
      anger_log = build(:anger_log, anger_level: nil)
      expect(anger_log).not_to be_valid
      expect(anger_log.errors[:anger_level]).to include("can't be blank")
    end
  end
  
  describe '#weekly_average' do
    context '1週間のログがある場合' do
      it '正しい平均値を返す' do
        # Given: 1週間分のログを作成
        create(:anger_log, anger_level: 3, occurred_at: 1.day.ago)
        create(:anger_log, anger_level: 7, occurred_at: 3.days.ago)
        
        # When: 週間平均を計算
        average = anger_log.weekly_average
        
        # Then: 期待値と一致
        expect(average).to eq(5.0)
      end
    end
  end
end
```

### ファイル命名規約

#### フロントエンド
```
components/
├── anger/
│   ├── AngerLogForm.tsx        # Pascalケース
│   ├── AngerLogList.tsx
│   └── index.ts                # バレルエクスポート
├── ui/
│   ├── Button.tsx
│   └── Modal.tsx
└── layout/
    ├── Header.tsx
    └── Navigation.tsx

hooks/
├── useAngerLog.ts              # camelケース
├── useAuth.ts
└── index.ts

utils/
├── dateFormat.ts               # camelケース
├── validation.ts
└── api/
    ├── angerLogApi.ts
    └── authApi.ts
```

#### バックエンド
```
app/
├── models/
│   ├── user.rb                 # snake_case
│   ├── anger_log.rb
│   └── ai_advice.rb
├── controllers/
│   ├── api/v1/
│   │   ├── anger_logs_controller.rb
│   │   └── auth_controller.rb
│   └── application_controller.rb
├── services/
│   ├── anger_analysis_service.rb
│   └── openai_service.rb
└── serializers/
    ├── anger_log_serializer.rb
    └── user_serializer.rb

spec/
├── models/
│   ├── user_spec.rb
│   └── anger_log_spec.rb
├── requests/
│   └── api/v1/
│       ├── anger_logs_spec.rb
│       └── auth_spec.rb
└── factories/
    ├── users.rb
    ├── anger_logs.rb
    └── ai_advices.rb
```

### Git運用規約

#### コミットメッセージ
```
feat: 怒りログ一覧表示機能を追加
fix: AI相談のレスポンス処理を修正
docs: README.mdにセットアップ手順を追加
style: ESLintエラーを修正
refactor: 認証ロジックをサービスクラスに移動
test: AngerLogモデルのテストを追加
chore: 依存関係を更新

# 詳細説明（必要に応じて）
- ページネーション対応
- フィルター機能追加
- レスポンシブ対応

Closes #123
```

#### ブランチ命名
```
feature/anger-log-list       # 新機能
fix/ai-response-handling     # バグ修正
docs/setup-guide            # ドキュメント
refactor/auth-service        # リファクタリング
```

### 品質チェックフロー

#### 開発時
1. **コーディング**: ESLint/RuboCop準拠
2. **コミット前**: Husky によるlint + format自動実行
3. **プッシュ前**: テスト実行確認

#### プルリクエスト時
1. **CI/CD**: GitHub Actionsで自動テスト
2. **コードレビュー**: 機能・品質・設計レビュー
3. **マージ前**: 全チェック通過確認

### IDE設定推奨

#### VSCode extensions
```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.test-adapter-converter",
    "rebornix.ruby"
  ]
}
```

#### 自動保存時フォーマット
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## 環境構成
- 開発環境: Docker
- 本番環境: Vercel + Render
- CI/CD: GitHub Actions