
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  skipProxyUrlNormalize: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    // This explicitly tells Next.js where to find the middleware logic.
    middleware: './src/proxy.ts',
  },
};

export default nextConfig;
