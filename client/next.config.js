/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['www.gravatar.com', 'localhost', 'ec2-13-112-201-107.ap-northeast-1.compute.amazonaws.com']
  },
  swcMinify: true
};

module.exports = nextConfig;
