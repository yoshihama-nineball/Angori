# Angori（アンゴリ）

🦍 ゴリラのアンガーマネジメントアプリ

Angoriは、健康的な感情管理をサポートするWebアプリケーションです。感情記録、怒りの傾向分析、AIアドバイス機能を通じて、アンガーマネジメントを支援します。

## サービス概要
Angoriは、ゴリラをモチーフにしたエンタメ性のあるアンガーマネジメントアプリです。<br>
感情コントロールの難しさや繊細さを持つユーザに対しても使いやすく、怒りの感情の持続時間や怒りの強度を小さくすることを目指します。<br>
ユーザが自身の成長過程を楽しく追跡し、持続的な感情制御スキルを上げることをサポートします。

## このサービスへの思い・作りたい理由
自身が就労移行支援に昨年１１月から通っており、そこで学んだことを活かしたアプリをPFとして作りたいと通所序盤から考えていました。<br>
感情のコントロールの手法をいくつか学び、自身の１番の課題であるアンガーマネジメントに関するアプリを作りたいと思い作成に至りました。<br>
PF作成を通じて、自身の課題解決とエンジニアスキルを学ぶことを目指しています。<br>

アンガーマネジメントについて学んだ際、「負の感情で最も強いものは怒りだが、正の感情で強いものは笑いだ」と知り、<br>
「思わずくすっと笑えるアンガーマネジメントの相談アプリを作ったら面白いのでは？」と考えました。<br>
ゴリラをモチーフにした理由としては、ゴリラは見るだけで、まして相談相手として存在してくれたら面白いのではないかと考えたためです。<br>
強さと繊細さを兼ね備えたゴリラを面白い存在として認知している人は少なくないと思います<br>

## ユーザー層について
ASDやHSPなどの感情のコントロールや繊細な人にも効果的なアプリを作ることで、
自身の怒りの傾向を知ったり怒りを鎮めたい全ての人に使いやすいサービスを目指します。

## サービスの利用イメージ

他の感情と違い中々すぐには消えてくれない怒りの感情を、ゴリラに相談することで楽しく自分がどのように怒るのか傾向を知ったり、<br>
怒りの感情を小さくすることで、アンガーマネジメントの本来の目的である「怒ることで後悔しない」ことを目指します。

## 🚀 クイックスタート

### 前提条件
- **Docker Desktop 4.0+** ✅
- **Docker Compose V2** ✅
- **Git** ✅

### 開発環境起動

```bash
# 1. リポジトリクローン
git clone https://github.com/yoshihama-nineball/Angori.git
cd Angori

# 2. 環境構築（初回のみ）
./docker/scripts/setup.sh

# 3. 開発環境起動
docker compose up -d

# 4. ブラウザで確認
open http://localhost:3000  # フロントエンド
open http://localhost:3001  # バックエンドAPI
```

**これだけで完全な開発環境が起動します！🎉**

## ✨ 主要機能

- 📝 **感情記録**: 怒りのレベルと原因を簡単記録
- 📊 **傾向分析**: D3.jsによる美しい可視化
- 🤖 **AI相談**: GPT-4による個別アドバイス  
- 📅 **感情カレンダー**: 日々の感情変化を追跡

## 🏗 技術スタック

### フロントエンド
- **Next.js 15** (App Router + Turbopack)
- **React 19** + **TypeScript 5.0+**
- **Material-UI v6** (ゴリラテーマ)
- **D3.js v7** (データ可視化)

### バックエンド
- **Ruby on Rails 7.1.5** (API mode)
- **PostgreSQL 16+**
- **JWT認証** (Devise + Devise-JWT)
- **OpenAI API** (GPT-4o-mini)

### 開発環境
- **Docker** + **Docker Compose** 🐳
- **ホットリロード対応**
- **ワンコマンドセットアップ**

# Google Analytics 4 設定

## 📊 Google Analytics 4 設定

### 概要
ユーザー行動分析のためにGoogle Analytics 4 (GA4)を導入しています。

### 環境変数設定

#### 必須環境変数
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-ZE70CVCRW5
```

#### 設定方法
```bash
# ローカル開発環境（.env.localに追加）
echo "NEXT_PUBLIC_GA_MEASUREMENT_ID=G-ZE70CVCRW5" >> frontend/.env.local

# Docker環境は設定済み
# Vercel本番環境は環境変数で設定済み
```

### トラッキング対象
- ページビュー（全ページ自動）
- スクロール率・離脱クリック
- ファイルダウンロード

### データ確認
[Google Analytics](https://analytics.google.com) → 「アンゴリ」プロパティ → リアルタイムレポート

## 📱 デモ・アクセス先

| サービス | URL | 説明 |
|---------|-----|------|
| **本番環境** | [angori.vercel.app](https://angori.vercel.app) | 本番アプリ |
| **開発環境** | http://localhost:3000 | ローカル開発 |
| **API** | http://localhost:3001 | バックエンドAPI |

# Angori（アンゴリ）

🦍 ゴリラのアンガーマネジメントアプリ

Angoriは、健康的な感情管理をサポートするWebアプリケーションです。感情記録、怒りの傾向分析、AIアドバイス機能を通じて、アンガーマネジメントを支援します。

## 🚀 クイックスタート

### 前提条件
- **Docker Desktop 4.0+** ✅
- **Docker Compose V2** ✅
- **Git** ✅

### 開発環境起動

```bash
# 1. リポジトリクローン
git clone https://github.com/yoshihama-nineball/Angori.git
cd Angori

# 2. 環境構築（初回のみ）
./docker/scripts/setup.sh

# 3. 開発環境起動
docker compose up -d

# 4. ブラウザで確認
open http://localhost:3000  # フロントエンド
open http://localhost:3001  # バックエンドAPI
```

**これだけで完全な開発環境が起動します！🎉**

## ✨ 主要機能

- 📝 **感情記録**: 怒りのレベルと原因を簡単記録
- 📊 **傾向分析**: D3.jsによる美しい可視化
- 🤖 **AI相談**: GPT-4による個別アドバイス  
- 📅 **感情カレンダー**: 日々の感情変化を追跡

## 🏗 技術スタック

### フロントエンド
- **Next.js 15** (App Router + Turbopack)
- **React 19** + **TypeScript 5.0+**
- **Material-UI v6** (ゴリラテーマ)
- **D3.js v7** (データ可視化)

### バックエンド
- **Ruby on Rails 7.1.5** (API mode)
- **PostgreSQL 16+**
- **JWT認証** (Devise + Devise-JWT)
- **OpenAI API** (GPT-4o-mini)

### 開発環境
- **Docker** + **Docker Compose** 🐳
- **ホットリロード対応**
- **ワンコマンドセットアップ**

## 📱 デモ・アクセス先

| サービス | URL | 説明 |
|---------|-----|------|
| **本番環境** | [angori.vercel.app](https://angori.vercel.app) | 本番アプリ |
| **開発環境** | http://localhost:3000 | ローカル開発 |
| **API** | http://localhost:3001 | バックエンドAPI |

## 📚 ドキュメント

### 📖 開発者向け
- **[開発者ガイド](./docs/development.md)** - 詳細な開発手順・コマンド・トラブルシューティング
- **[アーキテクチャガイド](./docs/architecture.md)** - 技術設計・ER図・API仕様
- **[デプロイメントガイド](./docs/deployment.md)** - CI/CD・本番運用・監視
- **[コントリビューションガイド](./docs/contributing.md)** - 開発フロー・コード規約・PR手順
- **[市場調査レポート](./docs/Planning/market-research.md)**
- **[ペルソナ設計書](./docs/Planning/persona.md)**
- **[プロジェクト企画書](./docs/Planning/project-planning.md)**
- **[機能要件定義書](./docs/Planning/requirements.md)**
- **[プロジェクト計画書](./docs/ProjectManagement/project-schedule.md)**
- **[画面遷移図](./docs/Design/design_transitions.md)**
- **[ER図](./docs/ERD/erd.md)**

## 🔧 開発コマンド

```bash
# フロントエンド開発
docker compose exec frontend yarn add package-name      # パッケージ追加
docker compose exec frontend yarn lint:fix              # コード修正
docker compose exec frontend yarn test                  # テスト実行

# バックエンド開発  
docker compose exec backend rails console               # Railsコンソール
docker compose exec backend rails db:migrate            # DB更新
docker compose exec backend bundle exec rspec           # テスト実行

# 環境管理
docker compose logs -f                                  # ログ確認
docker compose down                                     # 停止
./docker/scripts/cleanup.sh                            # 完全リセット

```

## 🗄️ データベース

### セットアップ

```bash
# データベース初期化（初回のみ）
docker compose exec backend rails db:create
docker compose exec backend rails db:migrate
docker compose exec backend rails db:seed
```

### サンプルデータ

Seedsで以下のデータが作成されます：
- **管理者**: admin@angori.com / Password123!
- **ASD特性ユーザー**: asd.user@example.com / Password123!
- **HSP特性ユーザー**: hsp.user@example.com / Password123!

### データベース構成

| テーブル | 件数 | 説明 |
|---------|------|------|
| **Users** | 4 | ユーザー（管理者+テスト） |
| **AngerLogs** | 8+ | 怒りログ（多様なパターン） |
| **CalmingPoints** | 4 | ゲーミフィケーション |
| **TriggerWords** | 30+ | トリガーワード自動分析 |
| **Badges** | 8 | 達成バッジシステム |
| **WiseSayings** | 14 | レベル別格言 |
| **Reminders** | 5+ | スマートリマインダー |
| **ContactMessages** | 3 | 問い合わせ管理 |

## 🧪 開発状況

### ✅ 完了済み
- Docker統合開発環境
- 基盤技術スタック構築
- 認証システム基盤
- ゴリラテーマシステム

### 🚧 開発中
- 基本UI実装
- アンガーログ機能
- API実装

### 📋 予定
- D3.js可視化機能
- AI相談機能
- 本格デプロイ

## 🤝 コントリビューション

1. Issueを確認・作成
2. Feature branchで開発
3. `docker compose up -d`で環境確認
4. Pull Request作成

詳細は **[コントリビューションガイド](./docs/CONTRIBUTING.md)** を参照してください。

## 📞 サポート・問い合わせ

- **Issues**: [GitHub Issues](https://github.com/yoshihama-nineball/Angori/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yoshihama-nineball/Angori/discussions)
- **開発者**: [yoshihama-nineball](https://github.com/yoshihama-nineball)

## 📝 ライセンス

MIT License - 詳細は [LICENSE](./LICENSE) を参照

---

🦍 Let's manage anger like a wise gorilla! 🍌

## 🧪 開発状況

### ✅ 完了済み
- Docker統合開発環境
- 基盤技術スタック構築
- 認証システム基盤
- ゴリラテーマシステム

### 🚧 開発中
- 基本UI実装
- アンガーログ機能
- API実装

### 📋 予定
- D3.js可視化機能
- AI相談機能
- 本格デプロイ

## 🤝 コントリビューション

1. Issueを確認・作成
2. Feature branchで開発
3. `docker compose up -d`で環境確認
4. Pull Request作成

詳細は [CONTRIBUTING.md](./docs/CONTRIBUTING.md) を参照してください。

## 📞 サポート・問い合わせ

- **Issues**: [GitHub Issues](https://github.com/yoshihama-nineball/Angori/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yoshihama-nineball/Angori/discussions)
- **開発者**: [yoshihama-nineball](https://github.com/yoshihama-nineball)

## 📝 ライセンス

MIT License - 詳細は [LICENSE](./LICENSE) を参照

---

🦍 Let's manage anger like a wise gorilla! 🍌