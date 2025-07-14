#!/bin/bash
# docker/scripts/setup.sh

echo "🐳 Angori Docker開発環境セットアップ開始"

# Docker起動確認
if ! docker info > /dev/null 2>&1; then
    echo "❌ Dockerが起動していません。Docker Desktopを起動してください。"
    exit 1
fi

# 環境変数ファイル確認
if [ ! -f .env.docker ]; then
    echo "❌ .env.dockerファイルが見つかりません"
    exit 1
fi

echo "📦 Dockerイメージをビルド中..."
docker-compose build --no-cache

echo "🗄️ データベースセットアップ中..."
docker-compose run --rm backend rails db:create || echo "⚠️ データベースは既に存在します"
docker-compose run --rm backend rails db:migrate
docker-compose run --rm backend rails db:seed || echo "⚠️ シードデータの投入をスキップしました"

echo "📦 フロントエンド依存関係確認中..."
docker-compose run --rm frontend yarn install

echo ""
echo "✅ セットアップ完了!"
echo "🚀 起動コマンド: docker-compose up"
echo "🌐 フロントエンド: http://localhost:3000"
echo "🔧 バックエンドAPI: http://localhost:5000"
echo "⏹️ 停止コマンド: docker-compose down"