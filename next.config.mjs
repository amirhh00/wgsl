import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";
// import { createSchema } from "./src/lib/utils/db";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //   mdxRs: true,
  // },
  trailingSlash: false,
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  webpack(config, { isServer, dev }) {
    // Use the client static directory in the server bundle and prod mode
    // Fixes `Error occurred prerendering page "/"`
    config.output.webassemblyModuleFilename = isServer && !dev ? "../static/wasm/[modulehash].wasm" : "static/wasm/[modulehash].wasm";
    if (isServer) {
      import("./src/lib/utils/db.mjs")
        .then(({ createSchema }) => {
          createSchema();
        })
        .catch((e) => {
          console.error("error making schema in DB: ", e);
        });
    }
    // Since Webpack 5 doesn't enable WebAssembly by default, we should do it manually
    config.experiments = { ...config.experiments, asyncWebAssembly: true };

    // Add a rule for .wgsl and .glsl files
    config.module.rules.push({
      test: /\.(glsl|wgsl)$/,
      use: "ts-shader-loader",
    });

    return config;
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
