# 技術調査報告書 - アンガーマネジメントアプリ

## 📋 プロジェクト概要

### プロジェクト名
Next.js + Rails APIによるアンガーマネジメントアプリケーション

### 調査期間
2025年7月11日

### 調査目的
- Next.js + Rails API構成でのアンガーマネジメントアプリ開発に最適な技術スタックの選定
- 怒りの傾向マップ機能実装のための可視化技術調査
- 低コストでスケーラブルなデプロイ環境の検証
- 実装予定UIに基づく技術選定の最適化

---

## 🏗 システム全体構成

### アーキテクチャ概要
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (Rails API)   │◄──►│   (PostgreSQL)  │
│   Vercel        │    │   Render        │    │   Neon          │
│   ($0/月)       │    │   ($7/月)       │    │   ($0/月)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 月額運用コスト
- **合計: $11-17/月 (約1,600-2,500円)**
- フロントエンド (Vercel): 無料
- バックエンド (Render): $7/月
- データベース (Neon PostgreSQL): 無料
- **AIアドバイス (OpenAI GPT-4.1 mini): $3-8/月**
- **カスタムドメイン (angori.com): $1-2/月**

---

## 🔧 バックエンド技術選定

### フレームワーク・ランタイム
| 技術 | バージョン | 選定理由 |
|------|------------|-----------|
| Ruby on Rails | 7.1/7.2 | 2025年でも競争力のあるAPI開発フレームワーク |
| Ruby | 3.2+ | 安定性とパフォーマンスのバランス |
| PostgreSQL | 16+ | 本番環境での安定性とスケーラビリティ |

### 認証システム
**選定結果: JWT認証 (Devise + Devise-JWT)**

| 方式 | メリット | デメリット | 採用理由 |
|------|----------|------------|-----------|
| JWT認証 | ステートレス、スケーラブル | トークン管理の複雑さ | ✅ API-onlyアプリに最適 |
| セッション認証 | シンプル、セキュア | サーバ依存、スケール困難 | ❌ 分散環境に不向き |

### パフォーマンス最適化
- **キャッシング**: Redis/Memcached
- **バックグラウンドジョブ**: Sidekiq
- **API設計**: RESTful + JSON API仕様

### 推奨Gemfile構成
```ruby
# 認証・API基盤
gem 'devise'
gem 'devise-jwt'
gem 'rack-cors'
gem 'jsonapi-serializer'

# パフォーマンス
gem 'sidekiq'
gem 'redis'

# データ分析（アンガーマネジメント特有）
gem 'groupdate'
gem 'descriptive_statistics'
gem 'kaminari'

# AI統合
gem 'ruby-openai'

# 検索・テキスト処理（将来的）
gem 'pg_search'
```

---

## 🎨 フロントエンド技術選定

### フレームワーク・ランタイム
| 技術 | バージョン | 選定理由 |
|------|------------|-----------|
| Next.js | 15 | App Router、React 19サポート |
| React | 19 | 最新機能、パフォーマンス向上 |
| TypeScript | 5.0+ | 型安全性、開発効率 |

### 状態管理
**選定結果: Zustand**

| ライブラリ | 学習コスト | パフォーマンス | 適用範囲 | 採用判定 |
|------------|------------|----------------|----------|----------|
| Zustand | 低 | 優秀 | 中小〜大規模 | ✅ **採用** |
| Redux Toolkit | 高 | 良好 | 大規模 | ❌ オーバースペック |
| Context API | 低 | 制限あり | 小規模 | ❌ 機能不足 |

### UIライブラリ（確定版）
**選定結果: Material-UI (MUI) v6**

**採用理由:**
- **実装予定UI要件との完全適合**
  - アンガーログ一覧: MUI Card + Grid レイアウト
  - カレンダー機能: @mui/x-date-pickers の高機能コンポーネント  
  - 怒り度チップ: MUI Chip の色分け機能
  - スコア表示: MUI Paper + カスタムスタイリング
- **開発効率重視**: 必要コンポーネントが標準提供
- **チーム習熟度**: 既存の開発経験を最大活用

**実装予定UI別の技術選定:**

| UI要素 | MUI実装 | 開発工数 |
|--------|---------|----------|
| アンガーログカード | Card + CardContent | 低 |
| 感情カレンダー | @mui/x-date-pickers | 低 |
| 怒り度チップ | Chip (variant別) | 低 |
| 傾向マップ | カスタム + D3.js | 中 |
| チャット風UI | Paper + TextField | 低 |

**他候補との実装比較:**

| ライブラリ | カレンダー実装 | カード実装 | チップ実装 | 総開発工数 |
|------------|----------------|------------|------------|------------|
| **MUI** | 標準提供 | 標準提供 | 標準提供 | **2週間** |
| shadcn/ui | 個別実装必要 | 個別実装必要 | 個別実装必要 | 4-5週間 |
| Chakra UI | 制限あり | 標準提供 | 標準提供 | 3-4週間 |

**不採用理由:**
- **shadcn/ui**: 個別コンポーネント追加が必要で初期セットアップに時間がかかる、アンガーログの一覧表示や統計グラフに必要なDataGrid、Chart系コンポーネントの実装工数が大きい
- **Chakra UI**: 日付範囲選択やデータテーブルのような複雑なUIコンポーネントが標準で提供されていない

### データ可視化（怒りの傾向マップ）
**選定結果: D3.js Packed Bubble Chart + MUI統合**

**実装対象機能:**
- 怒りトリガーワードのバブルマップ表示
- バブルサイズ = 発生頻度（Count値）
- 色の濃さ = 怒りの強度
- 物理演算による自然な配置

**技術統合アーキテクチャ:**
```
┌─────────────────────────────┐    ┌─────────────────────────────┐
│        Frontend             │    │         Backend             │
│       (Next.js)             │    │       (Rails API)           │
│                             │    │                             │
│ ┌─────────────────────────┐ │    │ ┌─────────────────────────┐ │
│ │   MUI Components        │ │    │ │  AngerAdviceController  │ │
│ │   - AdviceDisplay       │ │◄──►│ │  OpenaiAdviceService    │ │
│ │   - AngerLogForm        │ │    │ │  TriggerAnalytics       │ │
│ │   - BubbleMap (D3.js)   │ │    │ └─────────────────────────┘ │
│ └─────────────────────────┘ │    │             │               │
│                             │    │             ▼               │
│        Vercel ($0)          │    │   ┌─────────────────────┐   │
└─────────────────────────────┘    │   │   OpenAI API        │   │
                                   │   │   (GPT-4.1 mini)    │   │
                                   │   └─────────────────────┘   │
                                   │                             │
                                   │        Render ($7)          │
                                   └─────────────────────────────┘
                                                 │
                                                 ▼
                                   ┌─────────────────────────────┐
                                   │         Database            │
                                   │      (PostgreSQL)           │
                                   │        Neon ($0)            │
                                   └─────────────────────────────┘
```

**参考実装:**
- [D3.js Packed Bubble Chart サンプル](https://qiita.com/seigot/items/fe76903de16c4dd9f351)
- Name/Count形式のデータ構造で実装可能

### AIアドバイス機能
**選定結果: OpenAI GPT-4.1 mini API**

**採用理由:**
- **最適な性能・コストバランス**: GPT-4.1の約1/5の価格で同等の性能
- **アンガーマネジメント特化適性**: 共感的で実践的なカウンセリング回答
- **高速レスポンス**: リアルタイム相談対応に最適
- **十分なコンテキスト理解**: 複雑な感情状況の分析が可能

**Rails実装仕様:**
```ruby
# app/services/openai_advice_service.rb
class OpenaiAdviceService
  def initialize
    @client = OpenAI::Client.new(
      access_token: Rails.application.credentials.openai_api_key
    )
  end

  def generate_advice(anger_log, past_consultations = [])
    response = @client.chat(
      parameters: {
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content: 'あなたは経験豊富なアンガーマネジメントカウンセラーです。ユーザーの感情に共感し、実践的で建設的なアドバイスを提供してください。- 共感的な言葉で応答 - 具体的な対処法を提案 - 前向きな視点を提示'
          },
          {
            role: 'user',
            content: "状況: #{anger_log.situation}\n怒りレベル: #{anger_log.intensity}/10\nトリガー: #{anger_log.triggers}\n現在の気持ち: #{anger_log.emotion_description}"
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      }
    )
    
    response.dig('choices', 0, 'message', 'content')
  end
end

# app/controllers/api/v1/anger_logs_controller.rb
class Api::V1::AngerLogsController < ApplicationController
  before_action :authenticate_user!

  def advice
    anger_log = current_user.anger_logs.find(params[:id])
    
    advice_service = OpenaiAdviceService.new
    advice = advice_service.generate_advice(anger_log)
    
    render json: { 
      advice: advice,
      generated_at: Time.current,
      model_used: 'gpt-4.1-mini'
    }
  rescue OpenAI::RateLimitError => e
    render json: { 
      error: 'API呼び出し制限に達しました。しばらく待ってから再試行してください。' 
    }, status: 429
  rescue StandardError => e
    Rails.logger.error "OpenAI API Error: #{e.message}"
    render json: { error: 'アドバイス生成に失敗しました' }, status: 500
  end
end
```

**実装仕様:**
```typescript
// AIアドバイス生成API
const getAngerAdvice = async (angerLog) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: `あなたは経験豊富なアンガーマネジメントカウンセラーです。
        ユーザーの感情に共感し、実践的で建設的なアドバイスを提供してください。
        - 共感的な言葉で応答
        - 具体的な対処法を提案
        - 前向きな視点を提示`
      },
      {
        role: "user",
        content: `状況: ${angerLog.situation}
        怒りレベル: ${angerLog.intensity}/10
        トリガー: ${angerLog.triggers.join(', ')}
        現在の気持ち: ${angerLog.emotion_description}`
      }
    ],
    max_tokens: 500,
    temperature: 0.7
  })
  return response.choices[0].message.content
}
```

**Next.js側の実装例（Rails API呼び出し）:**
```typescript
// app/anger-logs/[id]/advice.tsx
'use client'
import { useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
  Alert,
} from '@mui/material'

interface SessionInfo {
  total_consultations: number
  has_history: boolean
}

interface AdviceResponse {
  advice: string
  generated_at: string
  model_used: string
  session_info: SessionInfo
}

const AngerAdviceComponent = ({ angerLogId }: { angerLogId: number }) => {
  const [advice, setAdvice] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null)

  const generateAdvice = async () => {
    setLoading(true)
    setError('')
    setAdvice('')

    try {
      // Rails APIのadviceエンドポイントを呼び出し
      const response = await fetch(`http://localhost:3000/api/v1/anger_logs/${angerLogId}/advice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        credentials: 'include'
      })

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('API呼び出し制限に達しました。しばらく待ってから再試行してください。')
        }
        throw new Error('APIエラーが発生しました')
      }

      const data: AdviceResponse = await response.json()
      setAdvice(data.advice)
      setSessionInfo(data.session_info)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        🦍 ゴリラカウンセラーからのアドバイス
      </Typography>

      {sessionInfo && (
        <Alert severity="info" sx={{ mb: 3 }}>
          相談回数: {sessionInfo.total_consultations}回目
          {sessionInfo.has_history && ' | 過去の相談履歴を考慮してアドバイスします'}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Button
          onClick={generateAdvice}
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{ py: 1.5 }}
        >
          {loading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              分析中...
            </>
          ) : (
            'アドバイスをもらう'
          )}
        </Button>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {advice && (
        <Paper
          elevation={2}
          sx={{
            p: 3,
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
          }}
        >
          <Typography variant="h6" gutterBottom color="primary">
            🦍 ゴリラカウンセラーからのアドバイス
          </Typography>
          <Typography
            variant="body1"
            sx={{
              lineHeight: 1.8,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {advice}
          </Typography>
        </Paper>
      )}
    </Box>
  )
}

const getAuthToken = () => {
  // JWT認証トークンを取得
  return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
}

export default AngerAdviceComponent
```

### 技術スタック（確定版）

| 技術 | バージョン | 選定理由 | 使用箇所 |
|------|------------|----------|----------|
| Material-UI | v6 | UI要件完全対応 | 全体デザインシステム |
| @mui/x-date-pickers | latest | カレンダー機能 | 感情カレンダー |
| @mui/x-data-grid | latest | ログ一覧表示 | アンガーログ管理 |
| D3.js | v7 | バブルマップ実装 | 怒りの傾向マップ |
| **OpenAI GPT-4.1 mini** | latest | AIアドバイス生成 | 相談・アドバイス機能 |

---

## 🗃 データベース設計

### 主要テーブル構成
```sql
-- アンガーログメインテーブル
CREATE TABLE anger_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  log_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 10),
  situation TEXT,
  emotion_description TEXT,
  triggers TEXT, -- カンマ区切りトリガーワード
  coping_strategy TEXT,
  reflection TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- トリガーワード正規化テーブル
CREATE TABLE trigger_words (
  id SERIAL PRIMARY KEY,
  word VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ログ-トリガー関連テーブル
CREATE TABLE anger_log_triggers (
  id SERIAL PRIMARY KEY,
  anger_log_id INTEGER REFERENCES anger_logs(id),
  trigger_word_id INTEGER REFERENCES trigger_words(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### データ分析API設計（バブルマップ対応版）

```ruby
# トリガー傾向分析エンドポイント（バブルマップ用）
GET /api/v1/trigger_analytics/bubble_map
# D3.js Packed Bubble Chart対応フォーマット
{
  "bubble_data": {
    "children": [
      {
        "Name": "満員電車",
        "Count": 15,           # 発生回数（バブルサイズ）
        "avg_intensity": 7.2,  # 平均怒り強度（色の濃さ）
        "trend": "increasing"  # トレンド情報
      },
      {
        "Name": "遅刻",
        "Count": 12,
        "avg_intensity": 6.8,
        "trend": "stable"
      }
    ]
  },
  "period": {
    "start_date": "2025-06-10",
    "end_date": "2025-07-10",
    "total_logs": 45
  }
}

# AIアドバイス生成エンドポイント
POST /api/v1/anger_logs/:id/advice
# リクエスト
{
  "anger_log_id": 123
}
# レスポンス
{
  "advice": "お疲れ様です。満員電車でのストレスは多くの方が経験されることですね。まず深呼吸をして、今この瞬間に集中してみてください。電車内では音楽を聴いたり、読書をしたりして気を紛らわせることも効果的です。また、時間に余裕を持って出発することで、心理的なプレッシャーを軽減できるかもしれません。",
  "generated_at": "2025-07-11T10:30:00Z",
  "model_used": "gpt-4.1-mini"
}
```

### SQLクエリ例

```sql
-- トリガーワード別の集計クエリ
SELECT 
  tw.word AS "Name",
  COUNT(alt.anger_log_id) AS "Count",
  AVG(al.intensity) AS avg_intensity,
  CASE 
    WHEN COUNT(alt.anger_log_id) > LAG(COUNT(alt.anger_log_id)) OVER (ORDER BY tw.word) 
    THEN 'increasing'
    WHEN COUNT(alt.anger_log_id) < LAG(COUNT(alt.anger_log_id)) OVER (ORDER BY tw.word) 
    THEN 'decreasing'
    ELSE 'stable'
  END AS trend
FROM trigger_words tw
JOIN anger_log_triggers alt ON tw.id = alt.trigger_word_id
JOIN anger_logs al ON alt.anger_log_id = al.id
WHERE al.user_id = ? 
  AND al.log_date BETWEEN ? AND ?
GROUP BY tw.id, tw.word
ORDER BY "Count" DESC;
```

**データフロー:**
```
ユーザー入力(トリガーワード) → 正規化テーブル保存 → 集計クエリ → D3.js形式API → バブルマップ表示
```

---

## 🚀 デプロイ・インフラ

### デプロイ環境
| コンポーネント | プラットフォーム | 料金 | 特徴 |
|----------------|------------------|------|------|
| フロントエンド | Vercel | 無料 | Next.js最適化、自動デプロイ |
| バックエンド | Render | $7/月 | シンプルなコンテナデプロイ、カスタムドメイン対応 |
| データベース | Neon PostgreSQL | 無料 | サーバーレス、ブランチング機能 |
| **カスタムドメイン** | **angori.com** | **$1-2/月** | **独自ブランド、SSL自動対応** |

### CI/CD構成
```yaml
# 自動デプロイフロー
GitHub Push → Vercel (Frontend) + Render (Backend)
             ↓
    Neon PostgreSQL (Database)
```

### 開発環境との連携
- **プレビュー環境**: プルリクエスト毎に自動生成
- **データベースブランチ**: Neonのブランチング機能活用
- **環境分離**: 開発/ステージング/本番の完全分離

---

## 📊 アンガーマネジメント特有機能

### 怒りの傾向マップ
**実装仕様:**
- **データ形式**: D3.js Packed Bubble Chart用のName/Count形式
- **バブルサイズ**: トリガー発生回数（Count値）
- **色の濃さ**: 平均怒り強度（avg_intensity）
- **配置**: D3.js物理演算による自然な配置

**MUI統合実装例:**
```typescript
import { useEffect, useRef } from 'react'
import { Paper, useTheme } from '@mui/material'
import * as d3 from 'd3'

const AngerBubbleMap = ({ bubbleData }) => {
  const svgRef = useRef()
  const theme = useTheme()
  
  useEffect(() => {
    if (!bubbleData) return
    
    const svg = d3.select(svgRef.current)
    const diameter = 600
    
    // MUIテーマカラーを使用
    const color = d3.scaleOrdinal()
      .range([
        theme.palette.gorilla.banana,
        theme.palette.gorilla.anger,
        theme.palette.gorilla.calm
      ])
    
    const bubble = d3.pack(bubbleData)
      .size([diameter, diameter])
      .padding(1.5)
    
    // D3.js Packed Bubble Chart実装
    // （Qiitaサンプルコードベース）
    
  }, [bubbleData, theme])
  
  return (
    <Paper sx={{ p: 2, backgroundColor: theme.palette.background.paper }}>
      <svg ref={svgRef} width={600} height={400} />
    </Paper>
  )
}
```

### 分析機能
- **傾向分析**: 増加/減少トレンドの可視化
- **関連性分析**: 同時出現しやすいトリガーの特定
- **時間帯別分析**: 曜日・時間帯別の傾向表示
- **期間フィルタ**: 今週/今月/全期間での切り替え
- **AIアドバイス**: GPT-4.1 miniによる個別相談・アドバイス生成

---

## ⚡ パフォーマンス考慮事項

### バックエンド最適化
- **データベースインデックス**: user_id, created_at, triggersカラム
- **キャッシング戦略**: Redis使用、APIレスポンス5分キャッシュ
- **バックグラウンドジョブ**: 重い分析処理の非同期化

### フロントエンド最適化
- **コード分割**: Next.js 動的インポート活用
- **画像最適化**: next/image コンポーネント使用
- **状態管理**: Zustand軽量ストア、必要最小限の状態管理

### データ可視化最適化
- **SVG vs Canvas**: 大量データ時はCanvas描画に切り替え
- **仮想化**: 表示範囲外のバブルは非描画
- **デバウンス**: リアルタイム更新の制御

---

## 🔒 セキュリティ考慮事項

### 認証・認可
- **JWT有効期限**: 24時間、リフレッシュトークン実装
- **CORS設定**: フロントエンドドメインのみ許可
- **入力検証**: Rails Strong Parameters + フロントエンドZod

### データ保護
- **暗号化**: 機密データのデータベース暗号化
- **HTTPS**: 全通信のTLS暗号化必須
- **ログ管理**: 個人情報のログ出力禁止

---

## 📈 スケーラビリティ計画

### 短期的拡張（〜1000ユーザー）
- 現在の構成で対応可能
- データベース容量監視

### 中期的拡張（〜10000ユーザー）
- Render有料プラン移行
- Redis Cache強化
- CDN導入検討

### 長期的拡張（10000ユーザー〜）
- マイクロサービス化検討
- データベースシャーディング
- 機械学習による感情分析導入

---

## ✅ 推奨事項

### 即座に実装すべき
1. **セキュリティ基盤**: JWT認証、CORS設定
2. **データベース設計**: 正規化されたスキーマ
3. **基本API**: CRUD + 認証エンドポイント
4. **MUIプロジェクト**: Next.js + Material-UI セットアップ
5. **OpenAI統合**: Rails側でruby-openai gem導入

### 段階的実装
1. **基本ログ機能**: MUI標準コンポーネント活用
2. **D3.js可視化機能**: 怒りの傾向マップ実装
3. **高度分析機能**: AIアドバイス・レコメンデーション

### 将来的検討事項
- **機械学習**: 感情分析API連携
- **多言語対応**: i18n実装
- **モバイルアプリ**: React Native展開

---

## 💰 運用コスト試算

### 運用コスト（月額）
| 項目 | コスト | 年額 |
|------|--------|------|
| Render (Backend) | $7 | $84 |
| Vercel (Frontend) | $0 | $0 |
| Neon (Database) | $0 | $0 |
| **OpenAI API (GPT-4.1 mini)** | **$3-8** | **$36-96** |
| **カスタムドメイン (angori.com)** | **$1-2** | **$10-15** |
| **合計** | **$11-17** | **$130-195** |

### 拡張時コスト
- 1,000ユーザー: $11-17/月（現状維持）
- 10,000ユーザー: $35-45/月（Render Pro + AI利用増）
- 100,000ユーザー: $150-250/月（専用インフラ + 大量AI利用）

---

## 📋 結論

### 技術選定サマリー
- **バックエンド**: Rails 7.1 + PostgreSQL + JWT認証
- **フロントエンド**: Next.js 15 + React 19 + Zustand + **Material-UI v6**
- **可視化**: **D3.js Packed Bubble Chart** + MUI統合
- **AIアドバイス**: **OpenAI GPT-4.1 mini API**
- **デプロイ**: Vercel + Render + Neon + カスタムドメイン ($11-17/月)

### 成功要因
1. **実証済み技術**: 枯れた技術の組み合わせでリスク最小化
2. **低コスト**: 月額$11-17での運用開始（AI機能・カスタムドメイン含む）
3. **UI要件適合**: 実装予定デザインとの完全マッチング
4. **AI付加価値**: GPT-4.1 miniによる専門的アドバイス機能
5. **ブランディング**: angori.comでの独自ドメイン運用
6. **技術統合**: Next.js + Rails + OpenAI APIの効率的な連携

### リスクと対策
| リスク | 影響度 | 対策 |
|--------|--------|------|
| D3.js学習コスト | 中 | 参考実装活用、段階的習得 |
| OpenAI API制限・コスト | 中 | レート制限対応、コスト監視 |
| UI/UX品質 | 中 | MUI標準コンポーネント活用 |
| セキュリティ脆弱性 | 高 | 定期的な脆弱性診断 |
| 運用コスト増加 | 低 | 段階的スケーリング |

**この技術スタックにより、実装予定UIに最適化された高品質で拡張可能なアンガーマネジメントアプリケーションの構築が可能である。特にMUI採用により開発効率が大幅に向上し、D3.jsバブルマップ実装も参考コードにより実現可能性が確認済みである。さらに、GPT-4.1 mini API統合により、専門的なアンガーマネジメントアドバイス機能を低コストで提供できる。**

---

*調査実施日: 2025年7月11日*  
*次回更新予定: プロジェクト開始1週間後*