
# frontend/Dockerfile
FROM node:20-alpine

# 作業ディレクトリ設定
WORKDIR /app

# パッケージファイルコピー（キャッシュ効率化）
COPY package.json yarn.lock* ./

# 依存関係インストール
RUN yarn install --frozen-lockfile

# ソースコードコピー
COPY . .

# ポート開放
EXPOSE 3000

# 開発サーバー起動（Turbopack + ホットリロード）
CMD ["yarn", "dev"]