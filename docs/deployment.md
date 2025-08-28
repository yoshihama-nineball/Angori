# デプロイメントガイド

Angoriのデプロイメント・CI/CD・運用に関する詳細ガイドです。

## 🌐 デプロイメント環境

### 環境構成

| 環境 | フロントエンド | バックエンド | データベース | トリガー |
|------|-------------|-------------|-------------|---------|
| **本番** | Vercel | Render | Neon PostgreSQL | `main` ブランチ |
| **プレビュー** | Vercel Preview | Render Preview | Neon (Dev) | `develop` ブランチ |
| **ローカル** | localhost:3000 | localhost:3001 | Docker PostgreSQL | - |

### 運用コスト

| サービス | プラン | 月額コスト | 年額コスト |
|---------|-------|----------|----------|
| **Vercel** | Hobby | $0 | $0 |
| **Render** | Starter | $7 | $84 |
| **Neon** | Free | $0 | $0 |
| **ドメイン** | .com | ~$1 | ~$12 |
| **OpenAI API** | Pay-as-you-go | ~$3-10 | ~$36-120 |
| **合計** | - | **$11-18** | **$132-216** |

## 🚀 デプロイメント手順

### 本番デプロイ

#### 自動デプロイ（推奨）
```bash
# mainブランチにマージで自動デプロイ
git checkout main
git merge develop
git push origin main
# → Vercel & Render で自動ビルド・デプロイ
```

#### 手動デプロイ
```bash
# フロントエンド（Vercel）
vercel --prod

# バックエンド（Render）
# Render Dashboard から手動デプロイ実行
```

### プレビューデプロイ

```bash
# developブランチにプッシュで自動プレビュー
git checkout develop
git add .
git commit -m "Feature: 新機能追加"
git push origin develop
# → プレビュー環境に自動デプロイ
```

## 🔧 CI/CDパイプライン

### GitHub Actions ワークフロー

#### フロントエンド CI/CD
```yaml
# .github/workflows/frontend.yml
name: Frontend CI/CD

on:
  push:
    branches: [ main, develop ]
    paths: [ 'frontend/**' ]
  pull_request:
    branches: [ main ]
    paths: [ 'frontend/**' ]

jobs:
  test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./frontend
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'yarn'
        cache-dependency-path: frontend/yarn.lock
    
    - name: Install dependencies
      run: yarn install --frozen-lockfile
    
    - name: Run type check
      run: yarn type-check
    
    - name: Run linting
      run: yarn lint
    
    - name: Run tests
      run: yarn test:coverage
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        directory: frontend/coverage

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'yarn'
        cache-dependency-path: frontend/yarn.lock
    
    - name: Install dependencies
      run: yarn install --frozen-lockfile
      working-directory: ./frontend
    
    - name: Build application
      run: yarn build
      working-directory: ./frontend
      env:
        NEXT_PUBLIC_API_URL: ${{ secrets.PRODUCTION_API_URL }}
```

#### バックエンド CI/CD
```yaml
# .github/workflows/backend.yml
name: Backend CI/CD

on:
  push:
    branches: [ main, develop ]
    paths: [ 'backend/**' ]
  pull_request:
    branches: [ main ]
    paths: [ 'backend/**' ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: angori_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    
    defaults:
      run:
        working-directory: ./backend
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Ruby
      uses: ruby/setup-ruby@v1
      with:
        ruby-version: '3.2.3'
        bundler-cache: true
        working-directory: ./backend
    
    - name: Setup database
      run: |
        bundle exec rails db:create
        bundle exec rails db:migrate
      env:
        DATABASE_URL: postgres://postgres:postgres@localhost:5432/angori_test
    
    - name: Run RuboCop
      run: bundle exec rubocop
    
    - name: Run tests
      run: bundle exec rspec
      env:
        DATABASE_URL: postgres://postgres:postgres@localhost:5432/angori_test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Deploy to Render
      uses: johnbeynon/render-deploy-action@v0.0.8
      with:
        service-id: ${{ secrets.RENDER_SERVICE_ID }}
        api-key: ${{ secrets.RENDER_API_KEY }}
```

## 🌍 環境別設定

### 本番環境（Production）

#### Vercel 設定
```bash
# Environment Variables
NEXT_PUBLIC_API_URL=https://angori.onrender.com/api/v1
NEXT_PUBLIC_APP_NAME=Angori
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_ENVIRONMENT=production
```

#### Render 設定
```bash
# Environment Variables
RAILS_ENV=production
DATABASE_URL=(Neon接続URL)
FRONTEND_URL=https://angori.vercel.app
OPENAI_API_KEY=(OpenAI APIキー)
DEVISE_JWT_SECRET_KEY=(JWT秘密鍵)
RAILS_MASTER_KEY=(Rails credentials key)

# Build Command
bundle install && bundle exec rails assets:precompile && bundle exec rails db:migrate

# Start Command
bundle exec rails server -p $PORT
```

### プレビュー環境（Preview）

#### Vercel Preview 設定
```bash
# Environment Variables
NEXT_PUBLIC_API_URL=https://angori-development.onrender.com/api/v1
NEXT_PUBLIC_APP_NAME=Angori (Preview)
NEXT_PUBLIC_ENVIRONMENT=preview
```

#### Render Preview 設定
```bash
# Environment Variables  
RAILS_ENV=production
DATABASE_URL=(Neon開発用接続URL)
FRONTEND_URL=https://angori-*-yoshihamas-projects.vercel.app
# 他は本番環境と同様
```

## 🗄 データベース管理

### Neon PostgreSQL 設定

#### 接続情報
```bash
# 本番データベース
Host: ep-cool-forest-123456.us-east-2.aws.neon.tech
Database: angori_production
User: angori_user
Password: (Neon Dashboard から取得)
SSL: require

# 開発データベース  
Host: ep-wild-mountain-789012.us-east-2.aws.neon.tech
Database: angori_development
User: angori_dev_user
Password: (Neon Dashboard から取得)
SSL: require
```

#### マイグレーション管理
```bash
# 本番環境マイグレーション確認
render exec 'bundle exec rails db:migrate:status'

# マイグレーション実行（自動的にデプロイ時実行）
render exec 'bundle exec rails db:migrate'

# ロールバック（緊急時）
render exec 'bundle exec rails db:rollback STEP=1'
```

#### バックアップ戦略
```bash
# Neon自動バックアップ（デフォルト有効）
# - Point-in-time recovery（7日間）
# - 日次バックアップ（30日間保持）

# 手動バックアップ
pg_dump "postgres://user:pass@host/db?sslmode=require" > backup_$(date +%Y%m%d).sql

# リストア
psql "postgres://user:pass@host/db?sslmode=require" < backup_20250726.sql
```

## 🔒 シークレット管理

### 環境変数・シークレット

#### GitHub Secrets
```bash
# Repository Secrets (Settings > Secrets and variables > Actions)
RENDER_API_KEY=rnd_***                    # Render API キー
RENDER_SERVICE_ID=srv-***                 # RenderサービスID
PRODUCTION_API_URL=https://angori.onrender.com/api/v1
CODECOV_TOKEN=***                         # Codecov token（オプション）
```

#### Vercel Environment Variables
```bash
# Production
NEXT_PUBLIC_API_URL=https://angori.onrender.com/api/v1
NEXT_PUBLIC_APP_NAME=Angori
NEXT_PUBLIC_ENVIRONMENT=production

# Preview  
NEXT_PUBLIC_API_URL=https://angori-development.onrender.com/api/v1
NEXT_PUBLIC_APP_NAME=Angori (Preview)
NEXT_PUBLIC_ENVIRONMENT=preview
```

#### Render Environment Variables
```bash
# 本番環境
RAILS_ENV=production
DATABASE_URL=(Neon PostgreSQL URL)
OPENAI_API_KEY=(OpenAI API Key)
DEVISE_JWT_SECRET_KEY=(JWT Secret - 最低32文字)
RAILS_MASTER_KEY=(Rails credentials master key)
FRONTEND_URL=https://angori.vercel.app

# プレビュー環境
# 基本的に本番と同様、DATABASE_URLとFRONTEND_URLのみ変更
```

### Rails Credentials

#### 本番環境の秘匿情報管理
```bash
# Rails credentials編集
rails credentials:edit --environment production

# credentials/production.yml.enc
# openai:
#   api_key: sk-***
# 
# devise:
#   jwt_secret_key: your-super-secret-jwt-key-here
#
# database:
#   url: postgres://user:pass@host/database
```

## 📊 監視・ログ管理

### アプリケーション監視

#### Vercel Analytics
```typescript
// フロントエンド分析（自動有効）
// - ページビュー
// - Core Web Vitals
// - リアルタイムユーザー数
// - 地域別アクセス統計
```

#### Render Monitoring
```bash
# Renderダッシュボードで監視
# - CPU使用率
# - メモリ使用率  
# - リクエスト/レスポンス時間
# - エラー率
# - デプロイ履歴
```

### ログ管理

#### アプリケーションログ
```ruby
# config/environments/production.rb
Rails.application.configure do
  # Structured logging for production
  config.log_level = :info
  config.log_formatter = ::Logger::Formatter.new
  
  # External logging service (optional)
  # config.logger = ActiveSupport::Logger.new(STDOUT)
end
```

#### ログアクセス方法
```bash
# Render ログ確認
render logs

# リアルタイムログ監視
render logs --tail

# 過去のログ確認
render logs --num 1000
```

## 🚨 緊急時対応

### ロールバック手順

#### フロントエンドロールバック
```bash
# Vercel Dashboard での手順
# 1. Project > Deployments
# 2. 前の安定版を選択
# 3. "Promote to Production" クリック