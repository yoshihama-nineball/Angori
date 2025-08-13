# 開発者ガイド

Angoriの詳細な開発手順・ツール・トラブルシューティングガイドです。

## 🔧 開発環境セットアップ

### Docker環境（推奨）

#### 前提条件
- Docker Desktop 4.0+
- Docker Compose V2
- Git

#### セットアップ手順

```bash
# 1. リポジトリクローン
git clone https://github.com/yoshihama-nineball/Angori.git
cd Angori

# 2. 自動セットアップ（初回のみ）
./docker/scripts/setup.sh

# 3. 開発環境起動
docker compose up -d

# 4. 動作確認
curl http://localhost:5000/up  # バックエンド確認
open http://localhost:3000     # フロントエンド確認
```

### 従来環境（ローカル開発）

#### 前提条件
- Node.js 20.17+
- Yarn
- Ruby 3.2.3+
- PostgreSQL 14+

#### フロントエンド環境

```bash
cd frontend
yarn install
cp .env.example .env.local
# .env.localを編集してAPI URLを設定
yarn dev
```

#### バックエンド環境

```bash
cd backend
bundle install
cp .env.example .env.local
# .env.localでDB設定等を編集
rails db:create
rails db:migrate
rails server -p 5000
```

## 🛠 開発コマンド集

### Docker環境コマンド

#### 環境管理
```bash
# 起動・停止
docker compose up -d          # バックグラウンド起動
docker compose down           # 停止
docker compose restart       # 再起動

# ログ・状態確認
docker compose logs -f        # ログ監視
docker compose ps             # サービス状態
docker compose exec frontend bash  # コンテナ内shell

# 環境リセット
docker compose down -v        # データ含めて完全停止
./docker/scripts/cleanup.sh   # 完全クリーンアップ
```

#### フロントエンド開発
```bash
# パッケージ管理
docker compose exec frontend yarn add react-query
docker compose exec frontend yarn remove unused-package
docker compose exec frontend yarn upgrade

# 開発・ビルド
docker compose exec frontend yarn dev      # 開発サーバー
docker compose exec frontend yarn build    # プロダクションビルド
docker compose exec frontend yarn start    # プロダクションサーバー

# コード品質
docker compose exec frontend yarn lint         # ESLint実行
docker compose exec frontend yarn lint:fix     # ESLint自動修正
docker compose exec frontend yarn format       # Prettier整形
docker compose exec frontend yarn type-check   # TypeScript型チェック
docker compose exec frontend yarn pre-commit   # 全品質チェック

# テスト
docker compose exec frontend yarn test             # Jest実行
docker compose exec frontend yarn test:watch      # ウォッチモード
docker compose exec frontend yarn test:coverage   # カバレッジ測定
```

#### バックエンド開発
```bash
# Rails開発
docker compose exec backend rails console          # Railsコンソール
docker compose exec backend rails routes           # ルート確認
docker compose exec backend rails generate model User  # ジェネレーター

# データベース
docker compose exec backend rails db:create        # DB作成
docker compose exec backend rails db:migrate       # マイグレーション
docker compose exec backend rails db:rollback      # ロールバック
docker compose exec backend rails db:seed          # シードデータ
docker compose exec backend rails db:reset         # DB完全リセット

# パッケージ管理
docker compose exec backend bundle install         # Gem インストール
docker compose exec backend bundle update          # Gem アップデート

# コード品質・テスト
docker compose exec backend bundle exec rubocop       # コード品質チェック
docker compose exec backend bundle exec rubocop -a    # 自動修正
docker compose exec backend bundle exec rspec         # テスト実行
docker compose exec backend bundle exec rspec spec/models/  # モデルテストのみ
```

#### データベース操作
```bash
# PostgreSQL直接接続
docker compose exec postgres psql -U postgres -d angori_development

# バックアップ・リストア
docker compose exec postgres pg_dump -U postgres angori_development > backup.sql
docker compose exec -T postgres psql -U postgres -d angori_development < backup.sql
```

### 従来環境コマンド

#### フロントエンド
```bash
cd frontend

# 開発
yarn dev              # 開発サーバー（Turbopack）
yarn build            # プロダクションビルド
yarn start            # プロダクションサーバー

# コード品質
yarn lint             # ESLint
yarn lint:fix         # ESLint自動修正
yarn format           # Prettier
yarn type-check       # TypeScript
yarn check            # 全品質チェック

# テスト
yarn test             # Jest
yarn test:watch       # ウォッチモード
yarn test:coverage    # カバレッジ
```

#### バックエンド
```bash
cd backend

# 開発
rails server -p 5000  # APIサーバー
rails console         # Railsコンソール

# データベース
rails db:create       # DB作成
rails db:migrate      # マイグレーション
rails db:seed         # シードデータ

# コード品質・テスト
bundle exec rubocop   # コード品質
bundle exec rubocop -a # 自動修正
bundle exec rspec     # テスト実行
```

## 🔧 環境変数設定

### Docker環境
Docker環境では`.env.docker`で一元管理されています。基本的に設定変更は不要です。

### 従来環境

#### フロントエンド (.env.local)
```bash
# API接続
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# アプリ設定
NEXT_PUBLIC_APP_NAME=Angori
NEXT_PUBLIC_APP_VERSION=1.0.0
```

#### バックエンド (.env.local)
```bash
# データベース
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# フロントエンド連携
FRONTEND_URL=http://localhost:3000

# OpenAI API
OPENAI_API_KEY=your_openai_api_key

# JWT秘密鍵
DEVISE_JWT_SECRET_KEY=your_jwt_secret
```

## 🧪 テスト実行

### フロントエンドテスト
```bash
# Docker環境
docker compose exec frontend yarn test
docker compose exec frontend yarn test:coverage

# 従来環境
cd frontend
yarn test
yarn test:coverage
```

### バックエンドテスト
```bash
# Docker環境
docker compose exec backend bundle exec rspec
docker compose exec backend bundle exec rspec spec/models/

# 従来環境
cd backend
bundle exec rspec
bundle exec rspec spec/models/
```

## 🎨 開発効率化ツール

### VSCode設定
プロジェクト内の`.vscode/`に推奨設定が含まれています：

- **Extensions**: TypeScript, Prettier, ESLint, Ruby等
- **Settings**: 自動保存、フォーマット、デバッグ設定
- **Tasks**: ビルド・テスト・リント実行

### Git Hooks（Husky）
```bash
# フロントエンドのプリコミットフック
cd frontend
yarn husky install  # 初回のみ

# コミット前に自動実行される
yarn pre-commit  # ESLint + Prettier + TypeScript
```

### コード品質管理
```bash
# フロントエンド品質チェック
yarn lint && yarn type-check && yarn test

# バックエンド品質チェック  
bundle exec rubocop && bundle exec rspec
```

## 🚨 トラブルシューティング

### Docker関連

#### ポート競合エラー
```bash
# 使用中のポートを確認
lsof -i :3000
lsof -i :5000

# プロセス終了
kill -9 <PID>
```

#### ビルドエラー
```bash
# キャッシュクリア再ビルド
docker compose build --no-cache

# ボリューム含めて完全リセット
docker compose down -v
docker system prune -f
./docker/scripts/setup.sh
```

#### ホットリロードが効かない
```bash
# ボリュームマウント確認
docker compose exec frontend ls -la /app/src

# 権限確認（Windowsの場合）
docker compose exec frontend chown -R node:node /app
```

### フロントエンド関連

#### 依存関係エラー
```bash
# node_modules削除・再インストール
rm -rf node_modules package-lock.json
yarn install

# Docker環境の場合
docker compose exec frontend rm -rf node_modules
docker compose exec frontend yarn install
```

#### TypeScriptエラー
```bash
# 型チェック
yarn type-check

# 型定義ファイル確認
ls -la src/types/
```

### バックエンド関連

#### データベース接続エラー
```bash
# PostgreSQL状態確認
docker compose exec postgres pg_isready

# データベース存在確認
docker compose exec postgres psql -U postgres -l
```

#### マイグレーションエラー
```bash
# マイグレーション状態確認
rails db:migrate:status

# 問題のあるマイグレーションをロールバック
rails db:rollback STEP=1
```

#### Gem依存関係エラー
```bash
# Bundler更新
bundle update

# 特定のGem再インストール
bundle exec gem uninstall problem_gem
bundle install
```

### パフォーマンス問題

#### ビルド速度改善
```bash
# Next.js Turbopack使用（デフォルト）
yarn dev --turbo

# Docker Buildkit使用
export DOCKER_BUILDKIT=1
docker compose build
```

#### メモリ使用量確認
```bash
# Docker使用量確認
docker stats

# プロセス使用量確認
docker compose exec frontend top
docker compose exec backend top
```

## 🔍 デバッグ方法

### フロントエンドデバッグ
```bash
# ブラウザ開発者ツール + Source Maps
# Chrome DevTools でブレークポイント設定

# デバッグログ出力
console.log('Debug:', data)
console.table(array)
```

### バックエンドデバッグ
```bash
# Railsコンソールでデバッグ
docker compose exec backend rails console

# ログ出力確認
docker compose logs backend

# byebugデバッガー使用
# コードに `byebug` を挿入してブレークポイント設定
```

### API動作確認
```bash
# curl でAPI確認
curl -X GET http://localhost:5000/api/v1/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# HTTPie使用（推奨）
http GET localhost:5000/api/v1/users Authorization:"Bearer YOUR_JWT_TOKEN"
```

## 📊 開発メトリクス

### コード品質確認
```bash
# TypeScript型カバレッジ
yarn type-coverage

# テストカバレッジ
yarn test:coverage

# ESLintエラー/警告数
yarn lint --format=json
```

### パフォーマンス測定
```bash
# Next.js Bundle分析
yarn analyze

# Rails API レスポンス時間
curl -w "@curl-format.txt" -o NUL -s http://localhost:5000/api/v1/users
```

この開発ガイドにより、チーム開発での効率性と品質を両立できます。