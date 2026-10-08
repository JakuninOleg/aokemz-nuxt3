import { withPayload } from '@payloadcms/next/withPayload';
import { fileURLToPath } from 'node:url';

export default withPayload({
  output: 'standalone',
  turbopack: { root: fileURLToPath(new URL('.', import.meta.url)) },
  poweredByHeader: false,
  async redirects() {
    return [
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
      { source: '/api/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }];
  },
});
