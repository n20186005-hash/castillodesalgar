import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https' as const, hostname: 'images.unsplash.com' },
    ],
  },
  // OpenNext (Cloudflare Workers) 需要 standalone 产物（.next/standalone）
  output: 'standalone' as const,
  // 解决多 lockfile 警告
  outputFileTracingRoot: process.cwd(),
};

export default withNextIntl(nextConfig);
