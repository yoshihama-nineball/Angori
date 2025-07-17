#!/bin/bash
# docker/scripts/cleanup.sh

echo "🧹 Angori Docker環境クリーンアップ開始"

# コンテナ停止・削除
echo "⏹️ コンテナ停止中..."
docker-compose down

# 未使用イメージ削除
echo "🗑️ 未使用イメージ削除中..."
docker image prune -f

# 未使用ネットワーク削除
echo "🌐 未使用ネットワーク削除中..."
docker network prune -f

# ボリューム削除確認
echo ""
read -p "⚠️ データベースデータ（ボリューム）も削除しますか？ (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "💾 ボリューム削除中..."
    docker volume prune -f
    echo "🗄️ データベースデータを削除しました（次回setup.shが必要）"
else
    echo "💾 データベースデータは保持されます"
fi

echo ""
echo "✅ クリーンアップ完了!"
echo "🔄 次回起動: docker-compose up"