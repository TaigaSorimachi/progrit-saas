/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ビルド時のTypeScriptエラーを一時的に無視（本番では false にすべき）
    ignoreBuildErrors: true,
  },
  eslint: {
    // ビルド時のESLintエラーを一時的に無視（本番では false にすべき）
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
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    };
    return config;
  },
};

module.exports = nextConfig;
