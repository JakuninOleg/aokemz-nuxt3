import { withPayload } from '@payloadcms/next/withPayload';
import { fileURLToPath } from 'node:url';
const storageEndpoint = new URL(process.env.S3_ENDPOINT || 'https://s3.twcstorage.ru');

const config = withPayload({
  output: 'standalone',
  turbopack: { root: fileURLToPath(new URL('.', import.meta.url)) },
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 80, 85],
    minimumCacheTTL: 86400,
    remotePatterns: process.env.S3_BUCKET ? [{
      protocol: 'https', hostname: storageEndpoint.hostname,
      pathname: `/${process.env.S3_BUCKET}/kemz/media/**`, search: '',
    }] : [],
  },
  async redirects() {
    return [
      ...(process.env.SITE_INDEXABLE === 'true' && process.env.PUBLIC_SITE_URL === 'https://aokemz.ru' ? [
        {
          source: '/:path*',
          has: [{ type: 'host', value: 'www\\.aokemz\\.ru' }],
          destination: 'https://aokemz.ru/:path*',
          permanent: true,
        },
      ] : []),
      { source: '/payload-admin/:path*', destination: '/admin/:path*', permanent: true },
      { source: '/cms-login', destination: '/admin/login', permanent: true },
      ...['categories', 'products', 'news', 'documents', 'media', 'users'].map(collection => ({
        source: `/admin/${collection}/:path*`, destination: `/admin/collections/${collection}/:path*`, permanent: true,
      })),
      { source: '/admin/profile', destination: '/admin/account', permanent: true },
      { source: '/admin/preferences', destination: '/admin/account', permanent: true },
    ];
  },
  async headers() {
    const indexable = process.env.SITE_INDEXABLE === 'true' && process.env.PUBLIC_SITE_URL === 'https://aokemz.ru';
    const security = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ];
    return [{ source: '/:path*', headers: [...security, ...(!indexable ? [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] : [])] },
      { source: '/admin/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
      { source: '/payload-admin/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
      { source: '/cms-login', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
      { source: '/api/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
      { source: '/media/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }] },
      { source: '/fonts/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }] }];
  },
});

// Payload appends theme negotiation to every route. Both the public site and
// admin use a fixed light theme, so Critical-CH only forces Chromium to replay
// the first navigation. Keep all unrelated security, robots and cache headers.
const payloadHeaders = config.headers;
config.headers = async () => (await payloadHeaders()).map(rule => ({
  ...rule,
  headers: rule.headers.filter(header => !(
    ['accept-ch', 'critical-ch', 'vary'].includes(header.key.toLowerCase())
    && header.value.toLowerCase() === 'sec-ch-prefers-color-scheme'
  )),
})).filter(rule => rule.headers.length > 0);

export default config;
