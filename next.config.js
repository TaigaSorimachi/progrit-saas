/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ビルド時のTypeScriptエラーを無視
    ignoreBuildErrors: true,
  },
  eslint: {
    // ビルド時のESLintエラーを無視
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'localhost',
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
    ],
  },
  experimental: {
    // サーバーコンポーネントの最適化
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    };

    // Prismaクライアントの最適化
    if (isServer) {
      config.externals.push('_http_common');
    }

    return config;
  },
};

module.exports = nextConfig;
