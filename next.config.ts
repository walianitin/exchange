/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "coin-images.coingecko.com" },
      { protocol: "https", hostname: "assets.coingecko.com" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/tickers",
        destination: "https://api.backpack.exchange/api/v1/tickers",
      },
    ];
  },
  reactStrictMode: false,
};

export default nextConfig;
