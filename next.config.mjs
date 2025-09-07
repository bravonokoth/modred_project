// next.config.mjs
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@hashgraph/sdk',
    '@metaplex-foundation/js',
    '@reown/walletkit'
  ],
  experimental: {
    esmExternals: 'loose'
  },
  webpack: (config, { isServer }) => {
    // Fix for 'exports is not defined' error
    config.resolve.alias = {
      ...config.resolve.alias,
      '@hashgraph/sdk': require.resolve('@hashgraph/sdk'),
    };

    // Handle Node.js polyfills for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        url: require.resolve('url'),
        zlib: require.resolve('browserify-zlib'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        assert: require.resolve('assert'),
        os: require.resolve('os-browserify'),
        path: require.resolve('path-browserify'),
        buffer: require.resolve('buffer'),
        process: require.resolve('process/browser'),
        util: require.resolve('util'),
        // Additional fallbacks for blockchain libraries
        vm: false,
        child_process: false
      };

      // Add global polyfills
      config.plugins.push(
        new (require('webpack')).ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        })
      );
    } else {
      // Server-side externals to prevent bundling issues
      config.externals = [
        ...config.externals,
        {
          '@hashgraph/sdk': '@hashgraph/sdk',
          'hashconnect': 'hashconnect'
        }
      ];
    }

    // Handle module resolution for both CommonJS and ES modules
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false
      }
    });

    return config;
  }
};

export default nextConfig;