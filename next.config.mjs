/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true, // SWC minifier enabled as you prefer
  
  // Optimize loading performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
  // Enable static optimization
  output: 'standalone',
  
  webpack: (config, { isServer, webpack }) => {
    // Optimize bundle size
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    };

    // Client-side configuration
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        // Enable polyfills for HashConnect
        crypto: "crypto-browserify",
        stream: "stream-browserify", 
        buffer: "buffer",
        util: "util",
        assert: "assert",
        process: "process/browser",
        zlib: "browserify-zlib",
        // Disable server-side modules
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        readline: false,
        http: false,
        https: false,
        url: false,
        path: false,
        os: false,
      };

      // Provide global process and Buffer
      config.plugins.push(
        new webpack.ProvidePlugin({
          process: ["process/browser", "default"],
          Buffer: ["buffer", "Buffer"],
        })
      );
    } else {
      // Server-side - disable all polyfills to prevent server errors
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false,
        stream: false,
        buffer: false,
        util: false,
        assert: false,
        process: false,
        zlib: false,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Suppress warnings
    config.ignoreWarnings = [
      /Critical dependency: require function is used in a way in which dependencies cannot be statically extracted/,
      /Module not found: Can't resolve 'pino-pretty'/,
      /Cannot resolve dependency "crypto"/,
    ];

    return config;
  },
};

export default nextConfig;