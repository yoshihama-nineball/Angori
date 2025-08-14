import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // 開発環境でのキャッシュ問題を回避
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '172.18.0.5:3000'],
      bodySizeLimit: '2mb',
    },
  },

  // 開発環境でのキャッシュを無効化
  ...(process.env.NODE_ENV === 'development' && {
    webpack: (config, { dev, isServer }) => {
      if (dev && !isServer) {
        config.cache = false
      }
      return config
    },
  }),
}

export default nextConfig
