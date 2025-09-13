/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Handle HashGraph Proto and other large files
    config.module.rules.push({
      test: /\.proto$/,
      loader: 'ignore-loader'
    });

    // Exclude large Hedera packages from Babel processing
    const babelRule = config.module.rules.find(
      rule => rule.use && rule.use.loader === 'next-babel-loader'
    );
    
    if (babelRule) {
      babelRule.exclude = [
        /node_modules\/@hashgraph\//,
        /node_modules\/hashconnect\//,
        ...(Array.isArray(babelRule.exclude) ? babelRule.exclude : [babelRule.exclude].filter(Boolean))
      ];
    }

    // Polyfills for node modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      url: 'url',
      zlib: 'browserify-zlib',
      http: 'stream-http',
      https: 'https-browserify',
      assert: 'assert',
      os: 'os-browserify',
      path: 'path-browserify',
    };

    return config;
  },
  transpilePackages: [
    '@magic-ext/oauth',
    '@thirdweb-dev/wallets'
  ],
}

export default nextConfig;