/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'yt3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.vecteezy.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
