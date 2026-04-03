/** @type {import('next').NextConfig} */
const webpack = require('webpack');

const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['yahoo-finance2'],
  },
  webpack: (config, { isServer }) => {
    // Ignore @std/testing/* modules (test-only deps not needed at runtime)
    config.resolve.alias['@std/testing/mock'] = false;
    config.resolve.alias['@std/testing/bdd'] = false;

    // Ignore the dynamic import of fetchCache.js inside yahoo-finance2
    // (it's only used for library development, never in production)
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /fetchCache\.js$/,
        contextRegExp: /yahoo-finance2/,
      })
    );

    // yahoo-finance2 is server-only — exclude it from the client bundle entirely
    if (!isServer) {
      config.resolve.alias['yahoo-finance2'] = false;
    }

    return config;
  },
}

module.exports = nextConfig
