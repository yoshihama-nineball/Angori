# backend/Dockerfile - 開発環境用

# Ruby 3.2.3使用（.ruby-versionに合わせる）
FROM ruby:3.2.3-slim

# 作業ディレクトリ設定
WORKDIR /rails

# システムパッケージ更新・インストール
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    # 必須パッケージ
    curl \
    build-essential \
    git \
    # PostgreSQL関連
    libpq-dev \
    postgresql-client \
    # Node.js（Rails assets用）
    nodejs \
    npm \
    # その他
    pkg-config \
    && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*

# 開発環境設定
ENV RAILS_ENV="development" \
    BUNDLE_PATH="/usr/local/bundle"

# Gemfile関連ファイルコピー（キャッシュ効率化）
COPY Gemfile Gemfile.lock ./

# Bundler設定・Gem インストール
RUN gem install bundler -v 2.4.19 && \
    bundle config set --local deployment 'false' && \
    bundle config set --local path 'vendor/bundle' && \
    bundle install

# アプリケーションコードコピー
COPY . .

# 権限設定（開発環境なのでシンプル）
RUN chown -R $(whoami):$(whoami) /rails

# ポート開放（バックエンドは5000番）
EXPOSE 5000

# 開発サーバー起動
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0", "-p", "5000"]