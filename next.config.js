/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // CSP headers - development için daha esnek ayarlar
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Production için de gerekli (Next.js)
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://flowmind-ai-flowmind-core-api.hf.space",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig

