import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig, loadEnv } from "vite";
import { viteMockServe } from "vite-plugin-mock";
import svgLoader from "vite-svg-loader";

const DEFAULT_ASSET_DIR = "assets";

const assetDirectoryMap: Record<string, string> = {
  css: "css",
  png: "img",
  jpg: "img",
  jpeg: "img",
  gif: "img",
  svg: "img",
  webp: "img",
  avif: "img",
  ico: "img",
  woff: "fonts",
  woff2: "fonts",
  eot: "fonts",
  ttf: "fonts",
  otf: "fonts",
};

const vendorChunkGroups = [
  { name: "vue-vendor", test: /[\\/]node_modules[\\/](vue|vue-router|pinia)[\\/]/ },
  { name: "element-plus", test: /[\\/]node_modules[\\/]element-plus[\\/]/ },
  { name: "axios", test: /[\\/]node_modules[\\/]axios[\\/]/ },
] as const;

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isServe = command === "serve";
  const isDevelopment = mode === "development";
  const isProduction = mode === "production";
  const enableMock = isServe && env.VITE_ENABLE_MOCK !== "false";

  return {
    plugins: [
      svgLoader({
        defaultImport: "url",
      }),
      vue(),
      viteMockServe({
        mockPath: "mock",
        enable: enableMock,
        logger: enableMock,
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/styles/variables.scss" as *;',
        },
      },
    },
    build: {
      sourcemap: isDevelopment,
      reportCompressedSize: isProduction,
      chunkSizeWarningLimit: 1000,
      rolldownOptions: {
        output: {
          entryFileNames: "js/[name]-[hash].js",
          chunkFileNames: "js/[name]-[hash].js",
          assetFileNames(assetInfo) {
            const extension = assetInfo.name?.split(".").pop()?.toLowerCase();
            const directory = extension
              ? (assetDirectoryMap[extension] ?? DEFAULT_ASSET_DIR)
              : DEFAULT_ASSET_DIR;

            return `${directory}/[name]-[hash][extname]`;
          },
          codeSplitting: {
            groups: [...vendorChunkGroups],
          },
        },
      },
    },
  };
});
