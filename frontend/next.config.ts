import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization?.splitChunks,
          cacheGroups: {
            ...config.optimization?.splitChunks?.cacheGroups,
            monacoEditor: {
              test: /[\\/]node_modules[\\/](@monaco-editor|monaco-editor)[\\/]/,
              name: "monaco-editor",
              chunks: "all",
              priority: 30,
              enforce: true,
            },
            chartJs: {
              test: /[\\/]node_modules[\\/](@kurkle|chart\.js|react-chartjs-2)[\\/]/,
              name: "chartjs",
              chunks: "all",
              priority: 30,
              enforce: true,
            },
            flowDiagram: {
              test: /[\\/]node_modules[\\/](reactflow|@reactflow)[\\/]/,
              name: "reactflow",
              chunks: "all",
              priority: 29,
              enforce: true,
            },
          },
        },
      };
    }

    return config;
  },
};

export default nextConfig;
