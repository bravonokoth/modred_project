/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: 'loose'
  },
  webpack: (config, { isServer }) => {
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
        path: require.resolve('path-browserify')
      }
    }

    // Add rules to handle modules
    config.module.rules.push(
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false
        }
      },
      {
        test: /\.(js|mjs|jsx)$/,
        resolve: {
          fullySpecified: false
        }
      }
    )

    return config
  },
  transpilePackages: ['hashconnect'],
  images: {
    domains: ['images.pexels.com', 'via.placeholder.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      }
    ],
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    // Handle HashConnect and Hedera wallet dependencies
    config.externals = config.externals || [];
    
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        buffer: false,
        process: false,
        util: false,
        vm: false,
        child_process: false
      };
    }

    // Alternative approach: Exclude HashConnect from processing
    config.module.rules.push({
      test: /node_modules\/(hashconnect|@hashgraph\/hedera-wallet-connect)/,
      use: {
        loader: 'ignore-loader'
      }
    });

    // If you have babel-loader installed, use this instead:
    /*
    config.module.rules.push({
      test: /node_modules\/(hashconnect|@hashgraph\/hedera-wallet-connect)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', {
              targets: {
                browsers: ['last 2 versions']
              }
            }]
          ],
          plugins: ['@babel/plugin-transform-runtime']
        }
      }
    });
    */

    // Ignore critical dependency warnings
    config.ignoreWarnings = [
      {
        module: /node_modules\/@hashgraph\/hedera-wallet-connect/,
        message: /Critical dependency/,
      },
      {
        module: /node_modules\/hashconnect/,
        message: /Critical dependency/,
      }
    ];

    return config;
  }
};

export default nextConfig;