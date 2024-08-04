/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { isServer, dev }) {
    // Use the client static directory in the server bundle and prod mode
    // Fixes `Error occurred prerendering page "/"`
    config.output.webassemblyModuleFilename = isServer && !dev ? "../static/wasm/[modulehash].wasm" : "static/wasm/[modulehash].wasm";

    // Since Webpack 5 doesn't enable WebAssembly by default, we should do it manually
    config.experiments = { ...config.experiments, asyncWebAssembly: true };

    // Add a rule for .wgsl and .glsl files
    config.module.rules.push({
      test: /\.(glsl|wgsl)$/,
      use: "ts-shader-loader",
    });

    return config;
  },
  experimental: {
    modern: true,
    plugins: true,
  },
};

export default nextConfig;
