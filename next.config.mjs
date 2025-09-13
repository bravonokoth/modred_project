/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Optimize large module handling
    config.watchOptions = {
      ignored: /node_modules/,
      aggregateTimeout: 300,
      poll: 1000
    }

    // Add module rules
    config.module.rules.push({
      test: /\.m?js$/,
      exclude: /node_modules\/(?!(@hashgraph|hashconnect)\/).*/,
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          presets: ['next/babel'],
          plugins: ['@babel/plugin-transform-runtime']
        }
      }
    })

    // Add fallbacks for node modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      assert: 'assert',
      http: 'stream-http',
      https: 'https-browserify',
      os: 'os-browserify',
      url: 'url'
    }

    return config
  },
  // Optimize specific packages
  transpilePackages: [
    'hashconnect',
    '@hashgraph/sdk',
    '@hashgraph/proto',
    '@hashgraph/hedera-wallet-connect'
  ],
  // Build optimizations
  swcMinify: true,
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      '@hashgraph/sdk',
      '@hashgraph/proto',
      'hashconnect'
    ]
  }
}

export default nextConfig